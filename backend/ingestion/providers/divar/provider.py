import hashlib
import json
import os
import re
from contextlib import contextmanager
from dataclasses import fields
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.support.ui import WebDriverWait

from ingestion.providers.base import DiscoveredListing

from .limiter import LocalRequestLimiter
from .parser import listing_token_from_url, parse_listing_page, parse_preloaded_state


class RateLimitDetected(RuntimeError):
    pass


class ListingRemoved(RuntimeError):
    pass


class ProviderError(RuntimeError):
    pass


RATE_LIMIT_MARKERS = (
    "too many requests",
    "error 429",
    "status code 429",
    "rate limit",
    "تعداد درخواست بیش از حد",
    "درخواست‌های بیش از حد",
)
REMOVED_MARKERS = (
    "این صفحه حذف شده یا وجود ندارد",
    "این آگهی حذف شده است",
)


def canonical_url(url):
    token = listing_token_from_url(url)
    return f"https://divar.ir/v/{token}" if token else ""


def normalize_url(href):
    if not href:
        return ""
    absolute = urljoin("https://divar.ir", href.split("?", 1)[0])
    parsed = urlparse(absolute)
    if parsed.netloc not in {"divar.ir", "www.divar.ir"} or "/v/" not in parsed.path:
        return ""
    return absolute.rstrip("/")


class DivarProvider:
    def __init__(self, driver_factory=None, limiter=None):
        self.driver_factory = driver_factory or self._create_driver
        self.limiter = limiter or LocalRequestLimiter()

    @staticmethod
    def _common_arguments(options):
        for argument in (
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--window-size=1365,900",
        ):
            options.add_argument(argument)
        options.page_load_strategy = "eager"
        options.add_experimental_option(
            "prefs",
            {"profile.managed_default_content_settings.images": 2},
        )
        return options

    def _create_driver(self):
        errors = []
        chrome_options = self._common_arguments(ChromeOptions())
        chrome_binary = os.environ.get("CHROME_BIN")
        if chrome_binary:
            chrome_options.binary_location = chrome_binary
        factories = (
            lambda: webdriver.Chrome(options=chrome_options),
            lambda: webdriver.Edge(options=self._common_arguments(EdgeOptions())),
        )
        for factory in factories:
            try:
                driver = factory()
                driver.set_page_load_timeout(15)
                return driver
            except WebDriverException as error:
                errors.append(str(error))
        raise ProviderError("Could not start Chrome or Edge: " + " | ".join(errors))

    @contextmanager
    def session(self):
        driver = self.driver_factory()
        try:
            yield driver
        finally:
            try:
                driver.quit()
            except Exception:
                pass

    @staticmethod
    def _page_text(page_source):
        return (
            BeautifulSoup(page_source or "", "html.parser")
            .get_text(" ", strip=True)
            .lower()
        )

    def _classify_page(self, page_source):
        text = self._page_text(page_source)
        if any(marker in text for marker in RATE_LIMIT_MARKERS):
            raise RateLimitDetected("Divar returned a throttling page")
        if any(marker in text for marker in REMOVED_MARKERS):
            raise ListingRemoved("Divar listing is removed or unavailable")

    @staticmethod
    def _detail_page_ready(page_source):
        soup = BeautifulSoup(page_source or "", "html.parser")
        if not soup.select_one("h1.kt-page-title__title"):
            return False
        if soup.select_one(
            "table.kt-group-row, div.kt-unexpandable-row, "
            "section.post-page__section--padded"
        ):
            return True
        state = parse_preloaded_state(page_source)
        post = (
            state.get("currentPost", {}).get("post")
            if isinstance(state, dict)
            else None
        )
        sections = post.get("sections", {}) if isinstance(post, dict) else {}
        return (
            any(bool(widgets) for widgets in sections.values())
            if isinstance(sections, dict)
            else False
        )

    @staticmethod
    def _fill_missing_details(primary, fallback):
        if primary is None:
            return fallback
        if fallback is None:
            return primary
        for model_field in fields(primary):
            name = model_field.name
            if getattr(primary, name) in (None, "", 0) and getattr(
                fallback, name
            ) not in (
                None,
                "",
                0,
            ):
                setattr(primary, name, getattr(fallback, name))
        return primary

    @staticmethod
    def _extract_links(page_source):
        soup = BeautifulSoup(page_source or "", "html.parser")
        discovered = {}
        for anchor in soup.select("a[href*='/v/']"):
            url = normalize_url(anchor.get("href"))
            token = listing_token_from_url(url)
            if not token:
                continue
            card_text = anchor.get_text(" ", strip=True)
            card_payload = {"text": card_text[:1000]} if card_text else {}
            fingerprint = (
                hashlib.sha256(
                    json.dumps(card_payload, ensure_ascii=False, sort_keys=True).encode(
                        "utf-8"
                    )
                ).hexdigest()
                if card_payload
                else ""
            )
            discovered.setdefault(token, (url, fingerprint, card_payload))

        state = parse_preloaded_state(page_source)
        if isinstance(state, dict):
            nb = state.get("nb") if isinstance(state.get("nb"), dict) else {}
            pagination = (
                nb.get("pagination") if isinstance(nb.get("pagination"), dict) else {}
            )
            for token in (
                pagination.get("tokens", [])
                if isinstance(pagination.get("tokens"), list)
                else []
            ):
                if isinstance(token, str) and re.fullmatch(
                    r"[A-Za-z0-9_-]{6,32}", token
                ):
                    discovered.setdefault(
                        token, (f"https://divar.ir/v/{token}", "", {})
                    )
            widgets = (
                nb.get("listWidgets") if isinstance(nb.get("listWidgets"), list) else []
            )
            for widget in widgets:
                data = widget.get("data") if isinstance(widget, dict) else None
                token = data.get("token") if isinstance(data, dict) else None
                if isinstance(token, str) and re.fullmatch(
                    r"[A-Za-z0-9_-]{6,32}", token
                ):
                    discovered.setdefault(
                        token, (f"https://divar.ir/v/{token}", "", {})
                    )
        return discovered

    @staticmethod
    def _scroll(driver):
        driver.execute_script("""
            const nodes = [document.scrollingElement, document.documentElement, document.body,
              ...Array.from(document.querySelectorAll('*')).filter((el) => {
                const style = getComputedStyle(el);
                return /(auto|scroll)/.test(style.overflowY || '') && el.scrollHeight > el.clientHeight + 80;
              })];
            for (const node of nodes.filter(Boolean)) {
              try { node.scrollTop += 1800; node.dispatchEvent(new Event('scroll', {bubbles: true})); } catch (_) {}
            }
            window.scrollBy(0, 1800);
            """)

    def discover(
        self,
        search_url,
        *,
        full=False,
        known_external_ids=None,
        known_streak=100,
        max_cards=500,
    ):
        known_external_ids = set(known_external_ids or ())
        with self.session() as driver:
            discovery_error = None
            for attempt in range(3):
                self.limiter.wait()
                try:
                    driver.get(search_url)
                except TimeoutException:
                    pass
                try:
                    WebDriverWait(driver, 20).until(
                        lambda current: bool(self._extract_links(current.page_source))
                    )
                    discovery_error = None
                    break
                except TimeoutException as error:
                    discovery_error = error
                    self._classify_page(driver.page_source)
                    self.limiter.block(10 * (2**attempt))
            if discovery_error is not None:
                raise ProviderError(
                    "Search page did not expose listing links after three attempts"
                ) from discovery_error

            all_links = {}
            consecutive_no_new = 0
            scrolls = 0
            while True:
                current = self._extract_links(driver.page_source)
                before = len(all_links)
                all_links.update(current)
                consecutive_no_new = (
                    consecutive_no_new + 1 if len(all_links) == before else 0
                )

                ordered_tokens = list(all_links)
                trailing_known = 0
                for token in reversed(ordered_tokens):
                    if token not in known_external_ids:
                        break
                    trailing_known += 1

                if (
                    not full
                    and len(all_links) >= min(100, max_cards)
                    and trailing_known >= known_streak
                ):
                    break
                if not full and len(all_links) >= max_cards:
                    break
                if full and consecutive_no_new >= 15:
                    break
                if scrolls >= (5000 if full else max(50, max_cards * 2)):
                    break
                self.limiter.wait()
                self._scroll(driver)
                scrolls += 1

            return [
                DiscoveredListing(
                    external_id=token,
                    url=url,
                    position=index,
                    card_fingerprint=fingerprint,
                    card_payload=card_payload,
                )
                for index, (token, (url, fingerprint, card_payload)) in enumerate(
                    all_links.items()
                )
            ]

    def fetch_listing(self, url, *, driver=None):
        if driver is None:
            with self.session() as managed_driver:
                return self.fetch_listing(url, driver=managed_driver)
        best_details = None
        for attempt in range(3):
            self.limiter.wait()
            try:
                driver.get(url)
            except TimeoutException:
                pass
            try:
                WebDriverWait(driver, 5).until(
                    lambda current: self._detail_page_ready(current.page_source)
                )
            except TimeoutException:
                pass
            page_source = driver.page_source
            self._classify_page(page_source)
            details = parse_listing_page(page_source, url)
            if details is not None:
                best_details = self._fill_missing_details(best_details, details)
            if details is not None and self._detail_page_ready(page_source):
                return self._fill_missing_details(details, best_details)
            if attempt < 2:
                self.limiter.block(5 * (2**attempt))
        if best_details is not None:
            return best_details
        raise ProviderError("Listing page did not contain a substantive listing")
