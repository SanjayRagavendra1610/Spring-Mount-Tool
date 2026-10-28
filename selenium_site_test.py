from datetime import datetime
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = "http://127.0.0.1:3002/"
REPORT_PATH = Path(__file__).with_name("SELENIUM_TEST_REPORT.txt")
results = []
driver = None


def record(name, action):
    try:
        detail = action()
        results.append((name, "PASS", detail or ""))
    except Exception as error:
        page_text = " ".join(driver.find_element(By.TAG_NAME, "body").text.split())[:300]
        message = next(iter(getattr(error, "msg", str(error)).splitlines()), type(error).__name__)[:180]
        results.append((name, "FAIL", f"{type(error).__name__}: {message}; page: {page_text}"))


def visible_rows():
    return driver.find_elements(By.CSS_SELECTOR, "tbody tr")


def click_text(text):
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//button[normalize-space()='{text}']"))
    ).click()


def test_initial_registry():
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//*[normalize-space()='Master Roster']"))
    )
    WebDriverWait(driver, 10).until(lambda browser: browser.find_elements(By.CSS_SELECTOR, "tbody tr"))
    row_count = len(visible_rows())
    body_text = driver.find_element(By.TAG_NAME, "body").text
    count_text = next((line for line in body_text.splitlines() if "Showing " in line and " students" in line), "count unavailable")
    assert row_count > 0, "Registry table has no visible student rows"
    return f"Registry loaded with {row_count} visible rows; {count_text}"


def test_search():
    student_name = driver.find_element(By.CSS_SELECTOR, "tbody tr td:nth-child(4) button").text
    search = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Search by student name']")
    search.send_keys(student_name)
    WebDriverWait(driver, 5).until(
        lambda browser: len(visible_rows()) == 1 or len(visible_rows()) == 0
    )
    assert len(visible_rows()) == 1, f"Expected one result for {student_name}; found {len(visible_rows())}"
    visible_name = driver.find_element(By.CSS_SELECTOR, "tbody tr td:nth-child(4)").text
    assert visible_name == student_name
    search.send_keys(Keys.COMMAND, "a")
    search.send_keys(Keys.BACKSPACE)
    WebDriverWait(driver, 5).until(lambda browser: len(visible_rows()) > 1)
    return f"Search narrowed results to {student_name}, then cleared successfully"


def test_registry_tabs():
    expected_headers = {
        "Academics": "Academic %",
        "Sports": "Primary Sport",
        "Discipline": "Conduct",
        "Extracurricular": "Enrolled Clubs",
    }
    for tab, header in expected_headers.items():
        click_text(tab)
        WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.XPATH, f"//th//*[normalize-space()='{header}'] | //th[normalize-space()='{header}']"))
        )
    click_text("Master Roster")
    return "Academics, Sports, Discipline, and Extracurricular tabs displayed their expected columns"


def test_student_detail():
    first_name = driver.find_element(By.CSS_SELECTOR, "tbody tr td:nth-child(4) button").text
    driver.find_element(By.CSS_SELECTOR, "tbody tr td:nth-child(4) button").click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Portfolio Format:')]"))
    )
    assert first_name in driver.find_element(By.TAG_NAME, "main").text
    click_text("Spreadsheet Registry")
    return f"Opened the portfolio detail for {first_name} and returned to the registry"


def test_portfolio_directory():
    click_text("Student Portfolios")
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[normalize-space()='Student Portfolio Directory']"))
    )
    cards = driver.find_elements(By.XPATH, "//button[.//span[normalize-space()='View Full Portfolio']]")
    assert cards, "Portfolio directory has no cards"
    cards[0].click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Portfolio Format:')]"))
    )
    click_text("Spreadsheet Registry")
    return f"Directory loaded and opened a portfolio from {len(cards)} cards"


def test_analytics():
    click_text("School Analytics")
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[normalize-space()='Total Enrolled']"))
    )
    assert "Academic Honor Roll" in driver.find_element(By.TAG_NAME, "main").text
    return "Analytics summary and Academic Honor Roll rendered"


def test_role_switch_and_modal():
    driver.find_element(By.XPATH, "//button[normalize-space()='Admin']").click()
    WebDriverWait(driver, 5).until(
        lambda browser: browser.execute_script(
            "return JSON.parse(localStorage.getItem('scholargrid_auth_user_v1') || '{}').role"
        ) == "admin"
    )
    driver.find_element(By.XPATH, "//button[normalize-space()='Teacher']").click()
    WebDriverWait(driver, 5).until(
        lambda browser: browser.execute_script(
            "return JSON.parse(localStorage.getItem('scholargrid_auth_user_v1') || '{}').role"
        ) == "teacher"
    )
    click_text("Spreadsheet Registry")
    WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//main//button[normalize-space()='Add Student']"))
    ).click()
    WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.XPATH, "//*[normalize-space()='Add New Student Record']"))
    )
    for tab, expected in (
        ("Education & Academics", "Curriculum Subjects & Scores"),
        ("Sports & Athletics", "Primary Sport"),
        ("Discipline & Conduct", "Conduct Evaluation"),
        ("Extracurricular Activities", "Enrolled Clubs & Societies"),
        ("General & Identification", "Student Full Name *"),
    ):
        click_text(tab)
        WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.XPATH, f"//*[contains(normalize-space(), '{expected}')]") )
        )
    click_text("Cancel")
    WebDriverWait(driver, 5).until(
        EC.invisibility_of_element_located((By.XPATH, "//*[normalize-space()='Add New Student Record']"))
    )
    return "Admin/Teacher switching worked; all five add-form tabs opened and Cancel closed the form without saving"


def main():
    global driver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,1000")
    options.add_argument("--disable-background-networking")

    try:
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(30)
        driver.get(BASE_URL)
        record("Initial registry", test_initial_registry)
        if results[-1][1] == "PASS":
            record("Registry search", test_search)
            record("Registry category tabs", test_registry_tabs)
            record("Student portfolio detail", test_student_detail)
            record("Portfolio directory", test_portfolio_directory)
            record("School analytics", test_analytics)
            record("Role switching and add-form tabs", test_role_switch_and_modal)
    except WebDriverException as error:
        results.append(("Browser setup", "FAIL", f"{type(error).__name__}: {error}"))
    finally:
        if driver:
            driver.quit()

    passed = sum(status == "PASS" for _, status, _ in results)
    failed = sum(status == "FAIL" for _, status, _ in results)
    lines = [
        "ScholarGrid Selenium Website Test Report",
        f"Run timestamp: {datetime.now().astimezone().isoformat(timespec='seconds')}",
        f"Target: {BASE_URL}",
        "Browser: Google Chrome (headless), controlled with Selenium WebDriver",
        "Test data: bundled demo records; no records were created, edited, or deleted",
        f"Summary: {passed} passed, {failed} failed, {len(results)} total",
        "",
        "Results:",
    ]
    for name, status, detail in results:
        lines.append(f"{status}: {name}" + (f" - {detail}" if detail else ""))
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()