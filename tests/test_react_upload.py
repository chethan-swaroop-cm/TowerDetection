import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    base_url = "http://localhost:5173/inspect"
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    good_jpg = os.path.join(base_dir, 'test_images', 'img_00351f186c1f4a42.jpg')
    bad_txt = os.path.join(base_dir, 'test_images', 'bad.txt')
    test_png = os.path.join(base_dir, 'test_images', 'test.png')
    test_webp = os.path.join(base_dir, 'test_images', 'test.webp')
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--window-size=1280,800')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print("Loading /inspect...")
        driver.get(base_url)
        time.sleep(2)
        
        # Helper to upload via hidden input
        def upload_file(filepath):
            driver.execute_script("document.querySelector('input[type=file]').style.display = 'block';")
            driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(filepath)
            time.sleep(1)
            
        def check_console_errors(test_name):
            logs = driver.get_log('browser')
            errors = [log['message'] for log in logs if log['level'] == 'SEVERE']
            if errors:
                print(f"[{test_name}] Console Errors: {errors}")
            else:
                print(f"[{test_name}] No Console Errors.")

        # Test 1: Unsupported File (bad.txt)
        print("\nTest 1: Unsupported File (bad.txt)")
        upload_file(bad_txt)
        try:
            err_msg = driver.find_element(By.CLASS_NAME, "validation-error").text
            print(f"Result: {err_msg}")
        except Exception:
            print("Result: No validation error found!")
        check_console_errors('Unsupported')
        driver.get(base_url)
        time.sleep(1)

        # Test 2: WEBP
        print("\nTest 2: WEBP Upload")
        upload_file(test_webp)
        time.sleep(1)
        try:
            err_msg = driver.find_element(By.CLASS_NAME, "validation-error").text
            print(f"Result ERROR: {err_msg}")
        except Exception:
            print("Result: No validation error (Accepted)")
            meta = driver.find_elements(By.CLASS_NAME, "metadata-item")
            for m in meta:
                print(f"Metadata: {m.text}")
        check_console_errors('WEBP')
        driver.get(base_url)
        time.sleep(1)

        # Test 3: PNG
        print("\nTest 3: PNG Upload")
        upload_file(test_png)
        time.sleep(1)
        try:
            err_msg = driver.find_element(By.CLASS_NAME, "validation-error").text
            print(f"Result ERROR: {err_msg}")
        except Exception:
            print("Result: No validation error (Accepted)")
        check_console_errors('PNG')
        driver.get(base_url)
        time.sleep(1)

        # Test 4: JPG
        print("\nTest 4: JPG Upload")
        upload_file(good_jpg)
        time.sleep(1)
        try:
            err_msg = driver.find_element(By.CLASS_NAME, "validation-error").text
            print(f"Result ERROR: {err_msg}")
        except Exception:
            print("Result: No validation error (Accepted)")
        check_console_errors('JPG')

    except Exception as e:
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
