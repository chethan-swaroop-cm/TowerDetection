import os
import requests
import cv2
import numpy as np
import time

BASE_URL = "http://localhost:5000"

def create_blurry_image(output_path):
    """Creates a completely uniform/blurry image that fails the Laplacian variance test."""
    img = np.ones((100, 100, 3), dtype=np.uint8) * 128
    cv2.imwrite(output_path, img)
    return output_path

def run_tests():
    print("=======================================")
    print("      BACKEND API VERIFICATION         ")
    print("=======================================\n")
    
    # Let backend start up
    time.sleep(2)
    
    # ---------------------------------------------------------
    # 1. GET /health
    # ---------------------------------------------------------
    print("Test 1: GET /health")
    try:
        r1 = requests.get(f"{BASE_URL}/health")
        print(f"Status: {r1.status_code}")
        print(f"Response: {r1.json()}")
        print(f"Result: {'PASS' if r1.status_code == 200 else 'FAIL'}\n")
    except Exception as e:
        print(f"Error: {e}\nResult: FAIL\n")

    # ---------------------------------------------------------
    # 2. POST /predict with an existing valid image
    # ---------------------------------------------------------
    print("Test 2: POST /predict with an existing valid image")
    valid_img_path = os.path.join(os.path.dirname(__file__), "..", "test_images", "img_00351f186c1f4a42.jpg")
    if os.path.exists(valid_img_path):
        with open(valid_img_path, "rb") as f:
            r2 = requests.post(f"{BASE_URL}/predict", files={"image": f})
        print(f"Status: {r2.status_code}")
        print(f"Response: {r2.json()}")
        
        # We expect a 503 because the YOLO model (best.pt) is missing but the quality check passes.
        passed = (r2.status_code == 503 and r2.json().get('status') == 'model_not_available')
        print(f"Result: {'PASS' if passed else 'FAIL'}\n")
    else:
        print(f"Valid image not found at {valid_img_path}\nResult: SKIP\n")

    # ---------------------------------------------------------
    # 3. POST /predict without an image
    # ---------------------------------------------------------
    print("Test 3: POST /predict without an image")
    r3 = requests.post(f"{BASE_URL}/predict", data={"other_field": "test"})
    print(f"Status: {r3.status_code}")
    print(f"Response: {r3.json()}")
    print(f"Result: {'PASS' if r3.status_code == 400 else 'FAIL'}\n")

    # ---------------------------------------------------------
    # 4. POST /predict with an unsupported file
    # ---------------------------------------------------------
    print("Test 4: POST /predict with an unsupported file")
    req_file = os.path.join(os.path.dirname(__file__), "..", "requirements.txt")
    with open(req_file, "rb") as f:
        r4 = requests.post(f"{BASE_URL}/predict", files={"image": ("requirements.txt", f)})
    print(f"Status: {r4.status_code}")
    print(f"Response: {r4.json()}")
    print(f"Result: {'PASS' if r4.status_code == 400 else 'FAIL'}\n")

    # ---------------------------------------------------------
    # 5. POST /predict with a blurry test image
    # ---------------------------------------------------------
    print("Test 5: POST /predict with a blurry test image")
    blurry_path = os.path.join(os.path.dirname(__file__), "test_data", "blurry_test.jpg")
    os.makedirs(os.path.dirname(blurry_path), exist_ok=True)
    create_blurry_image(blurry_path)
    
    with open(blurry_path, "rb") as f:
        r5 = requests.post(f"{BASE_URL}/predict", files={"image": f})
    print(f"Status: {r5.status_code}")
    print(f"Response: {r5.json()}")
    
    # We expect a 400 with status 'rejected' because it fails the blurry quality check
    passed_blurry = (r5.status_code == 400 and r5.json().get('status') == 'rejected')
    print(f"Result: {'PASS' if passed_blurry else 'FAIL'}\n")
    
    print("=======================================")
    print("      ALL TESTS COMPLETED              ")
    print("=======================================")

if __name__ == "__main__":
    run_tests()
