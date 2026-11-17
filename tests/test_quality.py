import os
import sys
import cv2
import numpy as np

# Add the parent directory to sys.path to easily import the image_quality module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from image_quality.quality_check import assess_image_quality

def setup_test_images():
    """Creates temporary images for testing the quality check module."""
    test_dir = os.path.join(os.path.dirname(__file__), "test_data")
    os.makedirs(test_dir, exist_ok=True)
    
    valid_path = os.path.join(test_dir, "valid.jpg")
    corrupt_path = os.path.join(test_dir, "corrupt.jpg")
    
    # Create a valid test image (random noise with mid-range brightness has high variance/sharpness)
    valid_img = np.random.randint(50, 200, (100, 100, 3), dtype=np.uint8)
    cv2.imwrite(valid_path, valid_img)
    
    # Create an unreadable/corrupt image (a text file acting as a jpg)
    with open(corrupt_path, "w") as f:
        f.write("This is fake image data.")
        
    return valid_path, corrupt_path, os.path.join(test_dir, "missing.jpg")

def test_nonexistent_image(missing_path):
    print(f"--- Testing Nonexistent Image ---")
    result = assess_image_quality(missing_path)
    print(f"Result: {result}\n")
    assert result["status"] == "rejected", "Expected status to be 'rejected'"
    assert "File does not exist." in result["reasons"], "Expected specific rejection reason"

def test_unreadable_image(corrupt_path):
    print(f"--- Testing Unreadable Image ---")
    result = assess_image_quality(corrupt_path)
    print(f"Result: {result}\n")
    assert result["status"] == "rejected", "Expected status to be 'rejected'"
    assert "Image is unreadable or corrupt." in result["reasons"], "Expected specific rejection reason"

def test_valid_image(valid_path):
    print(f"--- Testing Valid Image ---")
    result = assess_image_quality(valid_path)
    print(f"Result: {result}\n")
    assert result["status"] == "good", "Expected status to be 'good'"
    assert len(result["reasons"]) == 0, "Expected no rejection reasons"

if __name__ == "__main__":
    print("Starting Quality Check Tests...\n")
    valid_path, corrupt_path, missing_path = setup_test_images()
    
    try:
        test_nonexistent_image(missing_path)
        test_unreadable_image(corrupt_path)
        test_valid_image(valid_path)
        print("✅ ALL TESTS PASSED SUCCESSFULLY.")
    except AssertionError as e:
        print(f"❌ TEST FAILED: {e}")
