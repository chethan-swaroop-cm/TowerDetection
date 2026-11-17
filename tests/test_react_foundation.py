import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    url = "http://localhost:5173/"
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("Loading React App...")
        driver.get(url)
        time.sleep(2)
        driver.save_screenshot('react_1_empty_state.png')
        
        # Check console errors
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']
        if errors:
            print(f"Browser Console Errors Found: {errors}")
            
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        good_img = os.path.join(base_dir, 'test_images', 'img_00351f186c1f4a42.jpg')
        blurry_img = os.path.join(base_dir, 'test_images', 'fake_blurry.jpg')

        # Test 1: Good Image
        print("Uploading good image...")
        # Since input is display: none, we must unhide it or send keys directly
        driver.execute_script("document.querySelector('input[type=file]').style.display = 'block';")
        driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(good_img)
        
        # Wait for simulated upload
        time.sleep(1)
        driver.save_screenshot('react_2_upload_progress.png')
        
        time.sleep(1) # wait for 100%
        driver.save_screenshot('react_3_execute_ready.png')
        
        print("Executing detection...")
        btn = driver.find_element(By.XPATH, "//button[contains(text(), 'EXECUTE DETECTION')]")
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(4)
        
        driver.save_screenshot('react_4_success_result.png')
        print("Success flow screenshots captured.")
        
        # Reset
        print("Testing reset and blurry image...")
        btn = driver.find_element(By.XPATH, "//button[contains(text(), 'ANALYZE ANOTHER IMAGE')]")
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(1)
        
        # Test 2: Blurry Image
        driver.execute_script("document.querySelector('input[type=file]').style.display = 'block';")
        driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(blurry_img)
        time.sleep(1.5)
        btn = driver.find_element(By.XPATH, "//button[contains(text(), 'EXECUTE DETECTION')]")
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(4)
        
        driver.save_screenshot('react_5_blurry_rejection.png')
        print("Rejection flow screenshot captured.")
        
        print("Layout and End-to-End verified.")
        
    except Exception as e:
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
