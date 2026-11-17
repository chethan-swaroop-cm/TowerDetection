import cv2
import numpy as np
import os

# ==============================================================================
# CONFIGURATION THRESHOLDS
# ==============================================================================
# Note: These are initial baseline thresholds.
# They MUST be calibrated later using the actual tower images dataset.
# ==============================================================================

# Images with Laplacian variance below this are considered blurry
BLUR_THRESHOLD = 100.0  

# Pixel intensity considered as extremely high (0-255 scale)
OVEREXPOSURE_PIXEL_THRESHOLD = 250  
# Maximum acceptable percentage of overexposed pixels
OVEREXPOSURE_PERCENTAGE_THRESHOLD = 10.0  

# Pixel intensity considered as extremely low (0-255 scale)
UNDEREXPOSURE_PIXEL_THRESHOLD = 10  
# Maximum acceptable percentage of underexposed pixels
UNDEREXPOSURE_PERCENTAGE_THRESHOLD = 10.0  


def assess_image_quality(image_path):
    """
    Assesses an image's quality based on blur, overexposure, and underexposure.
    Returns a structured dictionary with the assessment results.
    """
    result = {
        "status": "rejected",
        "reasons": [],
        "blur_score": 0.0,
        "overexposed_percentage": 0.0,
        "underexposed_percentage": 0.0
    }

    # 1. Validate if the file actually exists
    if not os.path.exists(image_path):
        result["reasons"].append("File does not exist.")
        return result

    # 2. Read the image safely
    # cv2.imread returns None if the image is corrupt, unreadable, or invalid
    image = cv2.imread(image_path)
    if image is None:
        result["reasons"].append("Image is unreadable or corrupt.")
        return result

    # Convert image to grayscale for intensity-based computer vision calculations
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    total_pixels = gray_image.shape[0] * gray_image.shape[1]

    # 3. Calculate Blur (Variance of the Laplacian)
    # The Laplacian operator highlights regions of rapid intensity change (like edges).
    # A low variance indicates fewer edges, meaning the image is likely out of focus/blurry.
    blur_score = cv2.Laplacian(gray_image, cv2.CV_64F).var()
    result["blur_score"] = float(blur_score)

    if blur_score < BLUR_THRESHOLD:
        result["reasons"].append("Image is too blurry.")

    # 4. Calculate Overexposure
    # Count how many pixels are extremely bright (>= OVEREXPOSURE_PIXEL_THRESHOLD)
    overexposed_pixels = np.sum(gray_image >= OVEREXPOSURE_PIXEL_THRESHOLD)
    overexposed_percentage = (overexposed_pixels / total_pixels) * 100.0
    result["overexposed_percentage"] = float(overexposed_percentage)

    if overexposed_percentage > OVEREXPOSURE_PERCENTAGE_THRESHOLD:
        result["reasons"].append("Image is overexposed.")

    # 5. Calculate Underexposure
    # Count how many pixels are extremely dark (<= UNDEREXPOSURE_PIXEL_THRESHOLD)
    underexposed_pixels = np.sum(gray_image <= UNDEREXPOSURE_PIXEL_THRESHOLD)
    underexposed_percentage = (underexposed_pixels / total_pixels) * 100.0
    result["underexposed_percentage"] = float(underexposed_percentage)

    if underexposed_percentage > UNDEREXPOSURE_PERCENTAGE_THRESHOLD:
        result["reasons"].append("Image is underexposed.")

    # 6. Final Status Evaluation
    # If no rejection reasons were added, the image passes the quality check
    if len(result["reasons"]) == 0:
        result["status"] = "good"

    return result
