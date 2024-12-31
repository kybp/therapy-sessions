from faker import Faker
from playwright.sync_api import Page

fake = Faker()


class HomePage():
    def __init__(self, page: Page):
        self.page = page
        self.page.goto('http://localhost:3000')

    @property
    def username_input(self):
        return self.page.get_by_test_id('username-input')

    @property
    def password_input(self):
        return self.page.get_by_test_id('password-input')

    @property
    def submit_button(self):
        return self.page.get_by_role("button", name="Submit")

    def register(self):
        username = fake.user_name()
        password = 'password123'

        self.username_input.fill(username)
        self.password_input.fill(password)
        self.submit_button.click()

        return username, password

    def sign_in(self, username, password):
        return
