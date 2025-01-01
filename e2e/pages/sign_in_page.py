from e2e import config
from faker import Faker
from playwright.sync_api import Page

fake = Faker()


class SignInPage():
    def __init__(self, page: Page):
        self.page = page

    @property
    def username_input(self):
        return self.page.get_by_test_id('username-input')

    @property
    def password_input(self):
        return self.page.get_by_test_id('password-input')

    @property
    def submit_button(self):
        return self.page.get_by_role("button", name="Sign In")

    def sign_in(self):
        self.username_input.fill(config.username)
        self.password_input.fill(config.password)
        self.submit_button.click()

        return config.username, config.password
