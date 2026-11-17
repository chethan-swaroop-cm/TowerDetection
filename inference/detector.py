import os
import sys

# Attempt to import ultralytics, gracefully handling if it is not installed yet
try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

# Add parent directory to path so we can import our modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from image_quality.quality_check import assess_image_quality
from utils.confidence import calculate_class_metrics


# ==============================================================================
# CONFIGURATION
# ==============================================================================
# The model path is configurable here. Do NOT assume a trained model exists yet.
DEFAULT_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'best.pt'))
DEFAULT_OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', 'outputs'))
# ==============================================================================


def run_inference(image_path, model_path=DEFAULT_MODEL_PATH, output_dir=DEFAULT_OUTPUT_DIR):
    """
    Executes the full inference pipeline on a single image.
    1. Checks image quality.
    2. Aborts if image is poor quality, missing, or unreadable.
    3. Runs YOLO object detection.
    4. Calculates class-wise confidence metrics.
    5. Saves the annotated output.
    """
    
    # ---------------------------------------------------------
    # Step 1: Image Quality Check
    # ---------------------------------------------------------
    quality_result = assess_image_quality(image_path)
    
    # Handle missing or unreadable images directly using the quality result reasons
    reasons = quality_result.get("reasons", [])
    if "File does not exist." in reasons:
        return {
            "status": "error",
            "message": "Missing image file.",
            "quality": quality_result
        }
        
    if "Image is unreadable or corrupt." in reasons:
        return {
            "status": "error",
            "message": "Unreadable image file.",
            "quality": quality_result
        }

    # Handle quality rejections (e.g., blurry, overexposed)
    if quality_result.get("status") == "rejected":
        # Return quality rejection, DO NOT execute YOLO model
        return {
            "status": "rejected_quality",
            "message": "Image failed quality checks.",
            "quality": quality_result
        }

    # ---------------------------------------------------------
    # Step 2: Ensure Model is Available
    # ---------------------------------------------------------
    if not os.path.exists(model_path):
        return {
            "status": "error",
            "message": f"Model file not found at {model_path}.",
            "quality": quality_result
        }
        
    if YOLO is None:
        return {
            "status": "error",
            "message": "Ultralytics YOLO library is not installed in the environment.",
            "quality": quality_result
        }

    # ---------------------------------------------------------
    # Step 3: Load Model & Run YOLO Inference
    # ---------------------------------------------------------
    try:
        model = YOLO(model_path)
        # Execute YOLO on the image
        results = model(image_path)
    except Exception as e:
        return {
            "status": "error",
            "message": f"Inference execution error: {str(e)}",
            "quality": quality_result
        }

    # ---------------------------------------------------------
    # Step 4: Collect Detections
    # ---------------------------------------------------------
    detections = []
    
    # Extract data from the YOLO result object
    if len(results) > 0:
        result = results[0]
        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                # Bounding box format: [x1, y1, x2, y2]
                xyxy = box.xyxy[0].tolist() 
                
                # Fetch class name mapped from the model
                cls_name = model.names[cls_id]
                
                detections.append({
                    "class": cls_name,
                    "confidence": conf,
                    "bbox": xyxy
                })

    # ---------------------------------------------------------
    # Step 5: Calculate Class-wise Metrics
    # ---------------------------------------------------------
    # Utilizing our dedicated utility for specific classes
    # (supporting_tower, monopole_tower)
    metrics = calculate_class_metrics(detections)

    # ---------------------------------------------------------
    # Step 6: Save Annotated Output Image
    # ---------------------------------------------------------
    os.makedirs(output_dir, exist_ok=True)
    filename = os.path.basename(image_path)
    output_path = os.path.join(output_dir, f"annotated_{filename}")
    
    try:
        if len(results) > 0:
            # Save YOLO's auto-annotated image
            results[0].save(filename=output_path)
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to save annotated image: {str(e)}",
            "quality": quality_result,
            "detections": detections,
            "metrics": metrics
        }

    # ---------------------------------------------------------
    # Step 7: Return Structured Result
    # ---------------------------------------------------------
    message = "Inference completed successfully." if detections else "No detections found."
    
    return {
        "status": "success",
        "message": message,
        "quality": quality_result,
        "detections": detections,
        "metrics": metrics,
        "annotated_image_path": output_path if len(results) > 0 else None
    }
