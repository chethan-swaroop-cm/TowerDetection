import os
import requests
import json

URL = "http://127.0.0.1:5000/predict"

def run_test(test_name, file_path, expected_status_code, expected_json_key):
    print(f"\n--- {test_name} ---")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}. Skipping.")
        return
        
    try:
        with open(file_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(URL, files=files)
            
        print(f"Status Code: {response.status_code} (Expected: {expected_status_code})")
        try:
            data = response.json()
            print("Response JSON:")
            print(json.dumps(data, indent=2))
            
            if response.status_code == expected_status_code and expected_json_key in data.get('status', '') or expected_json_key in str(data):
                print(f"TEST PASSED")
            else:
                print(f"TEST FAILED (Did not find expected status/key)")
                
        except Exception as e:
            print(f"Failed to parse JSON: {e}")
            print(response.text)
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    test_img = os.path.join(base_dir, 'test_images', 'img_00351f186c1f4a42.jpg')
    # Setup for Test 2: Blurry image
    import cv2
    import numpy as np
    blurry_img_path = os.path.join(base_dir, 'test_images', 'fake_blurry.jpg')
    img = cv2.imread(test_img)
    if img is not None:
        blurry = cv2.GaussianBlur(img, (99, 99), 0)
        cv2.imwrite(blurry_img_path, blurry)
    
    # Setup for Test 4: Unsupported file
    unsupported_path = os.path.join(base_dir, 'test_images', 'fake_file.txt')
    with open(unsupported_path, 'w') as f:
        f.write("This is not an image.")

    run_test("TEST 1: Good Image", test_img, 200, "success")
    run_test("TEST 2: Blurry Image", blurry_img_path, 400, "rejected")
    
    # For TEST 3: Zero detections. Create a noise image to pass quality check
    zero_img_path = os.path.join(base_dir, 'test_images', 'zero_det.jpg')
    noise = np.random.randint(50, 200, (400, 400, 3), dtype=np.uint8)
    cv2.imwrite(zero_img_path, noise)
    run_test("TEST 3: Zero Detections", zero_img_path, 200, "success")
    
    run_test("TEST 4: Unsupported File", unsupported_path, 400, "error")
