import re
from playwright.sync_api import Page, expect

from e2e.pages.home_page import HomePage

def test_registering_as_client(page: Page):
    home_page = HomePage(page)
    expect(page).to_have_title('Therapy Sessions')
    username, password = home_page.register(type='client')
    expect(page).to_have_title(re.compile(r'.*Dashboard'))

def test_registering_as_therapist(page: Page):
    home_page = HomePage(page)
    expect(page).to_have_title('Therapy Sessions')
    username, password = home_page.register(type='therapist')
    expect(page).to_have_title(re.compile(r'.*Dashboard'))

def test_sign_in(page: Page):
    home_page = HomePage(page)
    expect(page).to_have_title('Therapy Sessions')
    home_page.sign_in()
    expect(page).to_have_title(re.compile(r'.*Dashboard'))
