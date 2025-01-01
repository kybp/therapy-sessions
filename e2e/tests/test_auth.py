import re
from playwright.sync_api import Page, expect

from e2e.pages.home_page import HomePage

def test_registering(page: Page):
    home_page = HomePage(page)
    expect(page).to_have_title('Therapy Sessions')
    username, password = home_page.register()
    expect(page).to_have_title(re.compile(r'.*Dashboard'))

def test_sign_in(page: Page):
    home_page = HomePage(page)
    expect(page).to_have_title('Therapy Sessions')
    home_page.sign_in()
    expect(page).to_have_title(re.compile(r'.*Dashboard'))
