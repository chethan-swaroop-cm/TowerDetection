import os
import glob
import sys

# Add parent directory to path so we can import the module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from image_quality.quality_check import assess_image_quality

def evaluate_actual_images():
    test_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'test_images'))
    
    # Supported image extensions
    image_extensions = ('*.png', '*.jpg', '*.jpeg')
    images = []
    for ext in image_extensions:
        images.extend(glob.glob(os.path.join(test_dir, ext)))
        
    if not images:
        print(f"No images found in {test_dir}")
        return

    # Print table header
    header = f"{'Filename':<25} | {'Status':<10} | {'Blur Score':<12} | {'Overexp %':<10} | {'Underexp %':<10} | {'Reasons'}"
    print(header)
    print("-" * len(header))
    
    for img_path in images:
        filename = os.path.basename(img_path)
        
        # Run quality check
        result = assess_image_quality(img_path)
        
        status = result.get('status', 'ERROR')
        blur = f"{result.get('blur_score', 0):.2f}"
        over = f"{result.get('overexposed_percentage', 0):.2f}"
        under = f"{result.get('underexposed_percentage', 0):.2f}"
        reasons = ", ".join(result.get('reasons', [])) if result.get('reasons') else "None"
        
        # Print table row
        print(f"{filename:<25} | {status:<10} | {blur:<12} | {over:<10} | {under:<10} | {reasons}")

if __name__ == "__main__":
    evaluate_actual_images()
