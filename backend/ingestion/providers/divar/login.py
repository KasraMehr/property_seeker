from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


LOGIN_MARKERS = (
    "\u0648\u0631\u0648\u062f",
    "\u062b\u0628\u062a\u200c\u0646\u0627\u0645",
    "\u062b\u0628\u062a \u0646\u0627\u0645",
)
LOGIN_REQUIRED_MARKERS = (
    "\u0648\u0631\u0648\u062f \u0628\u0647 \u062d\u0633\u0627\u0628 \u06a9\u0627\u0631\u0628\u0631\u06cc",
)
PHONE_SUBMIT_MARKERS = (
    "\u0627\u0631\u0633\u0627\u0644 \u06a9\u062f",
    "\u062a\u0623\u06cc\u06cc\u062f",
    "\u062a\u0627\u06cc\u06cc\u062f",
    "\u0627\u062f\u0627\u0645\u0647",
)
OTP_SUBMIT_MARKERS = (
    "\u0648\u0631\u0648\u062f",
    "\u062a\u0623\u06cc\u06cc\u062f",
    "\u062a\u0627\u06cc\u06cc\u062f",
)


class DivarLoginError(RuntimeError):
    pass


class DivarLoginFlow:
    """Drive Divar's OTP flow while keeping one browser session alive."""

    def __init__(self, provider, *, step_timeout=90):
        self.provider = provider
        self.step_timeout = step_timeout

    @staticmethod
    def _visible_elements(driver, selector):
        visible = []
        for element in driver.find_elements(By.CSS_SELECTOR, selector):
            try:
                if element.is_displayed():
                    visible.append(element)
            except WebDriverException:
                continue
        return visible

    def _button_with_markers(self, driver, markers):
        for element in self._visible_elements(driver, "button, a[role='button']"):
            try:
                label = " ".join(
                    filter(
                        None,
                        (
                            element.text,
                            element.get_attribute("aria-label"),
                            element.get_attribute("title"),
                        ),
                    )
                )
            except WebDriverException:
                continue
            if any(marker in label for marker in markers):
                return element
        return None

    def _phone_input(self, driver):
        elements = self._visible_elements(
            driver,
            "input[type='tel'], input[autocomplete='tel'], input[name='phone']",
        )
        return elements[0] if elements else None

    def _otp_input(self, driver):
        elements = self._visible_elements(
            driver,
            "input[autocomplete='one-time-code'], input[name='otp'], "
            "input[name='code']",
        )
        if elements:
            return elements[0]
        for element in self._visible_elements(driver, "input[inputmode='numeric']"):
            try:
                maximum = int(element.get_attribute("maxlength") or 0)
            except ValueError:
                maximum = 0
            if 4 <= maximum <= 8:
                return element
        return None

    def _submit(self, driver, field, markers):
        try:
            button = field.find_element(
                By.XPATH,
                "./ancestor::form[1]//button[@type='submit']",
            )
            if button.is_displayed() and button.is_enabled():
                button.click()
                return
        except WebDriverException:
            pass
        button = self._button_with_markers(driver, markers)
        if button is None:
            field.send_keys(Keys.ENTER)
            return
        try:
            button.click()
        except WebDriverException:
            driver.execute_script("arguments[0].click();", button)

    @staticmethod
    def _open(driver, url):
        try:
            driver.get(url)
        except TimeoutException:
            # Divar can leave background requests open even though the UI is ready.
            pass

    def check_authenticated(self):
        """Return whether the persistent browser profile is logged in."""
        try:
            with self.provider.session() as driver:
                driver.set_page_load_timeout(min(self.step_timeout, 60))
                self._open(driver, "https://divar.ir/my-divar")
                WebDriverWait(driver, self.step_timeout).until(
                    lambda current: current.execute_script(
                        "return document.readyState"
                    )
                    in {"interactive", "complete"}
                )
                if self._phone_input(driver):
                    return False
                if self._button_with_markers(driver, LOGIN_REQUIRED_MARKERS):
                    return False
                if self._button_with_markers(driver, LOGIN_MARKERS):
                    return False
                return True
        except TimeoutException as error:
            raise DivarLoginError(
                "Timed out while checking the Divar session."
            ) from error

    def authenticate(self, phone, *, read_otp, on_otp_requested=None):
        try:
            with self.provider.session() as driver:
                driver.set_page_load_timeout(min(self.step_timeout, 60))
                self._open(driver, "https://divar.ir/my-divar")
                wait = WebDriverWait(driver, self.step_timeout)

                phone_input = self._phone_input(driver)
                if phone_input is None:
                    login_button = self._button_with_markers(driver, LOGIN_MARKERS)
                    if login_button is None:
                        try:
                            login_button = WebDriverWait(driver, 10).until(
                                lambda current: self._button_with_markers(
                                    current, LOGIN_MARKERS
                                )
                                or self._phone_input(current)
                            )
                        except TimeoutException:
                            # No login control on /my-divar means the saved profile
                            # is already authenticated.
                            return "already_authenticated"

                    if self._phone_input(driver) is None:
                        try:
                            login_button.click()
                        except WebDriverException:
                            driver.execute_script(
                                "arguments[0].click();", login_button
                            )
                    phone_input = wait.until(self._phone_input)

                phone_input.clear()
                phone_input.send_keys(phone)
                self._submit(driver, phone_input, PHONE_SUBMIT_MARKERS)

                otp_input = wait.until(self._otp_input)
                if on_otp_requested:
                    on_otp_requested()
                otp = read_otp(self.step_timeout)
                if not otp.isdigit() or not 4 <= len(otp) <= 8:
                    raise DivarLoginError("OTP must contain 4 to 8 digits.")
                otp_input.clear()
                otp_input.send_keys(otp)

                # Divar usually auto-submits when the final digit is typed.
                try:
                    WebDriverWait(driver, 5).until(
                        lambda current: self._otp_input(current) is None
                    )
                except TimeoutException:
                    otp_input = self._otp_input(driver)
                    if otp_input is not None:
                        self._submit(driver, otp_input, OTP_SUBMIT_MARKERS)

                wait.until(lambda current: self._otp_input(current) is None)
                self._open(driver, "https://divar.ir/my-divar")
                wait.until(
                    lambda current: current.execute_script(
                        "return document.readyState"
                    )
                    in {"interactive", "complete"}
                )
                if self._phone_input(driver) or self._button_with_markers(
                    driver, LOGIN_REQUIRED_MARKERS
                ):
                    raise DivarLoginError(
                        "Divar still shows the login form; the OTP was not accepted."
                    )
                return "authenticated"
        except TimeoutException as error:
            raise DivarLoginError(
                "Timed out during Divar login. Divar may have changed the login UI."
            ) from error
