import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    base_url = "http://localhost:5173/inspect"
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    good_img = os.path.join(base_dir, 'test_images', 'img_00351f186c1f4a42.jpg')
    blurry_img = os.path.join(base_dir, 'test_images', 'fake_blurry.jpg')
    zero_det_img = os.path.join(base_dir, 'test_images', 'zero_det.jpg')
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--window-size=1280,800')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        def upload_and_analyze(filepath, name):
            print(f"--- Testing {name} ---")
            driver.get(base_url)
            time.sleep(1)
            
            # Upload
            driver.execute_script("document.querySelector('input[type=file]').style.display = 'block';")
            driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(filepath)
            time.sleep(2)
            
            # Analyze
            analyze_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Analyze Image')]")
            analyze_btn.click()
            
            # Wait for response (up to 20 seconds)
            for _ in range(20):
                if driver.find_elements(By.CLASS_NAME, "result-container"):
                    break
                time.sleep(1)
                
            driver.save_screenshot(f'result_{name}.png')
            
            try:
                res = driver.find_element(By.CLASS_NAME, "result-container").text
                print(f"Result:\n{res}")
            except Exception as e:
                print(f"Could not read result text: {e}")
                
            # Check console errors for CORS
            logs = driver.get_log('browser')
            errors = [log['message'] for log in logs if log['level'] == 'SEVERE']
            if errors:
                print(f"Console Errors: {errors}")
            else:
                print("No Console Errors.")
                
        upload_and_analyze(good_img, "good_image")
        upload_and_analyze(blurry_img, "blurry_image")
        upload_and_analyze(zero_det_img, "zero_det_image")

    except Exception as e:
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
