import json
import re
from zoneinfo import ZoneInfo

import jdatetime
from bs4 import BeautifulSoup

from ingestion.providers.base import ScrapedListing

DIGIT_TRANSLATION = str.maketrans(
    "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩",
    "01234567890123456789",
)
IRAN_MOBILE_PATTERN = re.compile(
    r"(?<!\d)(?:(?:\+|00)?98|0)?[\s\-()]*9"
    r"(?:[\s\-()]*\d){9}(?!\d)"
)
IRAN_PHONE_PATTERN = re.compile(
    r"(?<!\d)(?:(?:\+|00)?98|0)[\s\-()]*"
    r"(?:\d[\s\-()]*){9}\d(?!\d)"
)
PERSIAN_MONTHS = {
    "فروردین": 1,
    "اردیبهشت": 2,
    "خرداد": 3,
    "تیر": 4,
    "مرداد": 5,
    "شهریور": 6,
    "مهر": 7,
    "آبان": 8,
    "آذر": 9,
    "دی": 10,
    "بهمن": 11,
    "اسفند": 12,
}
DESCRIPTION_MARKERS = (
    "وب‌اپلیکیشن یا PWA دیوار",
    "وب اپلیکیشن یا PWA دیوار",
    "نصب آن، استفاده از دیوار",
    "انتشار آگهی:",
    "آخرین به‌روز‌رسانی:",
    "آخرین بروزرسانی:",
    "آخرین نردبان:",
)


def parse_int(value):
    if value is None:
        return None
    digits = re.sub(r"[^\d-]", "", str(value).translate(DIGIT_TRANSLATION))
    if not digits or digits == "-":
        return None
    try:
        return int(digits)
    except ValueError:
        return None


def parse_money(value):
    if value is None:
        return None
    text = str(value).translate(DIGIT_TRANSLATION)
    multipliers = {"میلیارد": 1_000_000_000, "میلیون": 1_000_000, "هزار": 1_000}
    if any(unit in text for unit in multipliers):
        total = 0
        matched = False
        for number, unit in re.findall(r"([\d,٬.]+)\s*(میلیارد|میلیون|هزار)", text):
            try:
                total += (
                    float(number.replace(",", "").replace("٬", "")) * multipliers[unit]
                )
                matched = True
            except ValueError:
                continue
        if matched:
            return int(total)
    return parse_int(text)


def clean_description(text):
    cleaned = str(text or "").strip()
    if not cleaned or any(marker in cleaned for marker in DESCRIPTION_MARKERS):
        return ""
    return cleaned


def normalize_iran_mobile(value):
    """Return an Iranian mobile number in local 09xxxxxxxxx form."""
    normalized = str(value or "").translate(DIGIT_TRANSLATION)
    match = IRAN_MOBILE_PATTERN.search(normalized)
    if not match:
        return ""
    digits = re.sub(r"\D", "", match.group(0))
    if digits.startswith("0098"):
        digits = digits[4:]
    elif digits.startswith("98"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = digits[1:]
    return f"0{digits}" if len(digits) == 10 and digits.startswith("9") else ""


def normalize_iran_phone(value):
    """Return an Iranian mobile or landline number in local form."""
    mobile = normalize_iran_mobile(value)
    if mobile:
        return mobile
    normalized = str(value or "").translate(DIGIT_TRANSLATION)
    match = IRAN_PHONE_PATTERN.search(normalized)
    if not match:
        return ""
    digits = re.sub(r"\D", "", match.group(0))
    if digits.startswith("0098"):
        digits = digits[4:]
    elif digits.startswith("98"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = digits[1:]
    return f"0{digits}" if len(digits) == 10 and digits[0] in "123456789" else ""


def extract_contact_phone(page_source):
    """Extract only contact UI phone values, not numbers in the ad body."""
    soup = BeautifulSoup(page_source or "", "html.parser")
    for anchor in soup.select("a[href^='tel:']"):
        phone = normalize_iran_phone(anchor.get("href", "")[4:])
        if phone:
            return phone

    contact_markers = (
        "\u0634\u0645\u0627\u0631\u0647",
        "\u062a\u0645\u0627\u0633",
        "\u0645\u0648\u0628\u0627\u06cc\u0644",
        "phone",
        "mobile",
    )
    for row in soup.select(
        "div.kt-unexpandable-row, [role='dialog'], "
        "[class*='contact'], [data-testid*='contact']"
    ):
        text = row.get_text(" ", strip=True)
        lowered = text.lower()
        if not any(marker in lowered for marker in contact_markers):
            continue
        phone = normalize_iran_phone(text)
        if phone:
            return phone
    return ""


def parse_preloaded_state(page_source):
    soup = BeautifulSoup(page_source or "", "html.parser")
    prefix = "window.__PRELOADED_STATE__ = "
    for script in soup.find_all("script"):
        text = script.get_text() or ""
        if prefix not in text:
            continue
        json_text = text[text.find(prefix) + len(prefix) :].lstrip()
        try:
            state, _ = json.JSONDecoder().raw_decode(json_text)
            return state
        except json.JSONDecodeError:
            continue
    return None


def find_first_string(node, keys):
    """Find a string value in Divar's versioned/nested response shapes."""

    if isinstance(node, dict):
        for key in keys:
            value = node.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        for value in node.values():
            found = find_first_string(value, keys)
            if found:
                return found
    elif isinstance(node, list):
        for value in node:
            found = find_first_string(value, keys)
            if found:
                return found
    return ""


def iter_widget_data(sections, section_name):
    widgets = sections.get(section_name, []) if isinstance(sections, dict) else []
    if not isinstance(widgets, list):
        return
    for widget in widgets:
        if not isinstance(widget, dict):
            continue
        data = widget.get("data")
        if not isinstance(data, dict):
            data = widget.get("dto", {}).get("data", {})
        if isinstance(data, dict):
            yield widget.get("widgetType") or widget.get("widget_type"), data


def parse_floor(value):
    numbers = [
        int(number)
        for number in re.findall(r"\d+", str(value).translate(DIGIT_TRANSLATION))
    ]
    if not numbers:
        return None, None
    return numbers[0], numbers[1] if len(numbers) > 1 else None


def parse_area_from_title(title):
    normalized = str(title or "").translate(DIGIT_TRANSLATION)
    match = re.search(
        r"(?<!\d)(\d{2,5})\s*(?:متری|متر\s*مربع)(?![A-Za-z0-9\u0600-\u06ff])",
        normalized,
    )
    return int(match.group(1)) if match else None


def apply_value(payload, title, value):
    label = str(title or "").strip()
    if not label or value in (None, ""):
        return
    if label == "متراژ":
        payload["area_m2"] = parse_int(value)
    elif label == "ساخت":
        payload["build_year"] = parse_int(value)
    elif label == "اتاق":
        payload["room_count"] = parse_int(value)
    elif label == "تصویر‌ها برای همین ملک است؟":
        payload["pictures_match_property"] = any(
            word in str(value).strip().lower()
            for word in ("بله", "دارد", "yes", "true")
        )
    elif label == "قیمت کل":
        payload["total_price_toman"] = parse_money(value)
    elif label == "قیمت هر متر":
        payload["price_per_meter_toman"] = parse_money(value)
    elif any(word in label for word in ("ودیعه", "رهن", "Mortgage")):
        payload["mortgage_toman"] = parse_money(value)
    elif any(
        word in label
        for word in ("اجارهٔ ماهانه", "اجاره ماهانه", "اجاره", "Monthly rent", "Rent")
    ):
        payload["monthly_rent_toman"] = parse_money(value)
    elif "بیعانه" in label:
        payload["deposit_toman"] = parse_money(value)
    elif label == "طبقه":
        payload["floor_number"], payload["total_floors"] = parse_floor(value)


def parse_source_datetime(text):
    normalized = str(text or "").translate(DIGIT_TRANSLATION)
    pattern = re.compile(
        r"(?P<label>انتشار آگهی|آخرین به‌روز‌رسانی|آخرین بروزرسانی|آخرین نردبان):\s*"
        r"(?P<day>\d{1,2})\s+(?P<month>\S+)\s+(?P<year>\d{4})،\s*"
        r"(?P<hour>\d{1,2}):(?P<minute>\d{2})"
    )
    parsed = {}
    for match in pattern.finditer(normalized):
        month = PERSIAN_MONTHS.get(match.group("month"))
        if not month:
            continue
        jalali = jdatetime.datetime(
            int(match.group("year")),
            month,
            int(match.group("day")),
            int(match.group("hour")),
            int(match.group("minute")),
        )
        value = jalali.togregorian().replace(tzinfo=ZoneInfo("Asia/Tehran"))
        key = "published" if match.group("label") == "انتشار آگهی" else "updated"
        if key == "published" or key not in parsed:
            parsed[key] = value
    return parsed


def extract_source_datetime(soup):
    """Extract Divar's publication metadata from its listing info row."""
    info_text = "\n".join(
        row.get_text("\n", strip=True) for row in soup.select(".kt-info-row")
    )
    metadata = parse_source_datetime(info_text)
    if metadata:
        return metadata
    # Keep a fallback for Divar markup variants that expose the same labels
    # without the current kt-info-row wrapper.
    return parse_source_datetime(soup.get_text("\n", strip=True))


def extract_rendered_description(soup):
    for section in soup.select("section.post-page__section--padded"):
        heading = section.select_one("h2.kt-title-row__title")
        if not heading or heading.get_text(strip=True) != "توضیحات":
            continue
        for candidate in section.select(
            "p.kt-description-row__text.kt-description-row__text--primary"
        ):
            description = clean_description(candidate.get_text(strip=True))
            if description:
                return description
    return ""


def listing_token_from_url(url):
    clean = str(url or "").split("?", 1)[0].rstrip("/")
    return clean.rsplit("/", 1)[-1] if "/v/" in clean else ""


def parse_listing_page(page_source, url):
    token = listing_token_from_url(url)
    payload = {
        "external_id": token,
        "url": url,
        "title": "",
        "phone": "",
        "description": "",
        "divar_neighborhood_name": "",
        "area_m2": None,
        "build_year": None,
        "room_count": None,
        "total_price_toman": None,
        "price_per_meter_toman": None,
        "mortgage_toman": None,
        "monthly_rent_toman": None,
        "deposit_toman": None,
        "floor_number": None,
        "total_floors": None,
        "pictures_match_property": None,
        "picture_count": 0,
        "source_published_at": None,
        "source_updated_at": None,
    }

    state = parse_preloaded_state(page_source)
    post = state.get("currentPost", {}).get("post") if isinstance(state, dict) else None
    if isinstance(post, dict):
        payload["external_id"] = post.get("token") or token
        seo = post.get("seo") if isinstance(post.get("seo"), dict) else {}
        web_info = seo.get("webInfo") if isinstance(seo.get("webInfo"), dict) else {}
        payload["title"] = (
            post.get("title") or web_info.get("title") or seo.get("title") or ""
        )
        payload["divar_neighborhood_name"] = find_first_string(
            post,
            ("district_persian", "districtPersian", "neighborhood_persian"),
        )
        sections = post.get("sections", {})
        for _, data in iter_widget_data(sections, "TITLE"):
            payload["title"] = payload["title"] or data.get("title") or ""
        for _, data in iter_widget_data(sections, "LIST_DATA"):
            items = data.get("items")
            if isinstance(items, list):
                for item in items:
                    if isinstance(item, dict):
                        apply_value(payload, item.get("title"), item.get("value"))
            else:
                apply_value(payload, data.get("title"), data.get("value"))
        for widget_type, data in iter_widget_data(sections, "DESCRIPTION"):
            if widget_type == "DESCRIPTION_ROW":
                payload["description"] = clean_description(data.get("text"))
                if payload["description"]:
                    break
        for _, data in iter_widget_data(sections, "IMAGE"):
            if isinstance(data.get("items"), list):
                payload["picture_count"] = len(data["items"])
                break

    soup = BeautifulSoup(page_source or "", "html.parser")
    if not payload["divar_neighborhood_name"]:
        for script in soup.select('script[type="application/ld+json"]'):
            try:
                schema_data = json.loads(script.get_text() or "null")
            except json.JSONDecodeError:
                continue
            payload["divar_neighborhood_name"] = find_first_string(
                schema_data,
                ("district_persian", "districtPersian", "neighborhood_persian"),
            )
            if payload["divar_neighborhood_name"]:
                break
    title = soup.select_one("h1.kt-page-title__title")
    payload["title"] = payload["title"] or (title.get_text(strip=True) if title else "")
    for table in soup.select("table.kt-group-row"):
        labels = table.select("thead .kt-group-row-item__title")
        values = table.select("tbody .kt-group-row-item__value")
        for label, value in zip(labels, values):
            key_snapshot = dict(payload)
            apply_value(
                key_snapshot, label.get_text(strip=True), value.get_text(strip=True)
            )
            for key in (
                "area_m2",
                "build_year",
                "room_count",
                "pictures_match_property",
            ):
                if payload[key] is None and key_snapshot[key] is not None:
                    payload[key] = key_snapshot[key]
    for row in soup.select("div.kt-unexpandable-row"):
        label = row.select_one("p.kt-unexpandable-row__title")
        value = row.select_one("p.kt-unexpandable-row__value")
        if not label or not value:
            continue
        candidate = dict(payload)
        apply_value(candidate, label.get_text(strip=True), value.get_text(strip=True))
        for key in (
            "total_price_toman",
            "price_per_meter_toman",
            "mortgage_toman",
            "monthly_rent_toman",
            "deposit_toman",
            "floor_number",
            "total_floors",
        ):
            if payload[key] is None and candidate[key] is not None:
                payload[key] = candidate[key]
    payload["description"] = payload["description"] or extract_rendered_description(
        soup
    )
    if payload["area_m2"] is None:
        payload["area_m2"] = parse_area_from_title(payload["title"])
    metadata = extract_source_datetime(soup)
    payload["source_published_at"] = metadata.get("published")
    payload["source_updated_at"] = metadata.get("updated")

    if not payload["external_id"] or not payload["title"]:
        return None
    substantive = (
        payload["description"],
        payload["area_m2"],
        payload["total_price_toman"],
        payload["mortgage_toman"],
        payload["monthly_rent_toman"],
    )
    if not any(value not in (None, "", 0) for value in substantive):
        return None
    return ScrapedListing(**payload)
