from faker import Faker
from playwright.sync_api import Page
from .register_page import RegisterPage
from .sign_in_page import SignInPage

fake = Faker()


class HomePage():
    def __init__(self, page: Page):
        self.page = page
        self.page.goto('http://localhost:3000')

    @property
    def register_link(self):
        return self.page.get_by_test_id('register-link')

    @property
    def sign_in_link(self):
        return self.page.get_by_test_id('sign-in-link')

    def register(self, type):
        self.register_link.click()
        return RegisterPage(self.page).register(type=type)

    def sign_in(self):
        self.sign_in_link.click()
        return SignInPage(self.page).sign_in()
