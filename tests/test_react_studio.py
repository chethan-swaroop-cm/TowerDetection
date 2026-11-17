import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def main():
    base_url = "http://localhost:5173"
    routes = ["/", "/inspect", "/dashboard", "/history"]
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--window-size=1280,800')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        for route in routes:
            url = base_url + route
            print(f"Loading {url}...")
            driver.get(url)
            time.sleep(2)
            
            # Check console errors
            logs = driver.get_log('browser')
            errors = [log for log in logs if log['level'] == 'SEVERE']
            if errors:
                print(f"[{route}] Browser Console Errors Found: {errors}")
                
            route_name = route.replace('/', '') or 'home'
            driver.save_screenshot(f'react_studio_{route_name}.png')
            print(f"[{route}] Screenshot saved.")
            
    except Exception as e:
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
