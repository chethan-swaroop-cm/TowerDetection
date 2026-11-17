import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    html_path = "http://localhost:8000/"
    good_img = os.path.join(base_dir, 'test_images', 'img_00351f186c1f4a42.jpg')
    blurry_img = os.path.join(base_dir, 'test_images', 'fake_blurry.jpg')
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("Running Test 3: Load page")
        driver.get(html_path)
        time.sleep(1)
        assert driver.find_element(By.ID, "empty-state").is_displayed(), "Empty state not shown initially"
        
        # TEST 1: Good image
        print("Running Test 1: Good image")
        driver.find_element(By.ID, "file-input").send_keys(good_img)
        time.sleep(1.5) # Wait for progress bar simulation (20% per 100ms)
        execute_btn = driver.find_element(By.ID, "execute-btn")
        assert execute_btn.is_enabled(), "Execute button should be enabled"
        assert "active" in driver.find_element(By.ID, "track-execute").get_attribute("class"), "Pipeline execute not active"
        
        execute_btn.click()
        time.sleep(5)
        
        assert driver.find_element(By.ID, "results-container").is_displayed(), "Results container not shown"
        assert "active" in driver.find_element(By.ID, "track-output").get_attribute("class"), "Pipeline output not active"
        assert "success" in driver.find_element(By.ID, "track-detection").get_attribute("class"), "Pipeline detection not success"
        print("Test 1 Passed")
        
        # TEST 5: Analyze another image
        print("Running Test 5: Analyze another image")
        driver.find_element(By.ID, "reset-success-btn").click()
        time.sleep(1)
        assert driver.find_element(By.ID, "empty-state").is_displayed(), "Should reset to empty state"
        print("Test 5 Passed")
        
        # TEST 2: Blurry image
        print("Running Test 2: Blurry image")
        driver.find_element(By.ID, "file-input").send_keys(blurry_img)
        time.sleep(1.5)
        btn = driver.find_element(By.ID, "execute-btn")
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(5)
        
        assert driver.find_element(By.ID, "quality-card").is_displayed(), "Quality card not shown"
        assert "REJECTED" in driver.find_element(By.ID, "quality-status-badge").text, "Quality status badge not REJECTED"
        assert "error" in driver.find_element(By.ID, "track-quality").get_attribute("class"), "Pipeline quality not error"
        assert not driver.find_element(By.ID, "results-container").is_displayed(), "Results should NOT be shown"
        print("Test 2 Passed")
        
        print("ALL TESTS PASSED SUCCESSFULLY")
    except Exception as e:
        driver.save_screenshot('screenshot_error.png')
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
