import os
import sys
import uuid
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

# Add parent directory to sys.path to easily import our modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from inference.detector import run_inference

app = Flask(__name__)

# ==============================================================================
# CONFIGURATION
# ==============================================================================
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))
OUTPUT_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'outputs'))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max limit for uploads

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==============================================================================
# ROUTES
# ==============================================================================

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/health', methods=['GET'])
def health_check():
    """
    Basic health check endpoint.
    Works independently of whether the YOLO model has been provided yet.
    """
    return jsonify({
        "status": "healthy",
        "message": "Tower Detection Backend is running successfully."
    }), 200

@app.route('/outputs/<filename>')
def serve_output(filename):
    """Serve the annotated images to the frontend."""
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)


@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles image uploads, runs quality checks, and performs inference if possible.
    """
    # 1. Validate Uploaded File
    if 'image' not in request.files:
        return jsonify({"status": "error", "message": "No image part in the request"}), 400
        
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"status": "error", "message": "Invalid file type. Only JPG, JPEG, and PNG are allowed."}), 400
        
    # 2. Save Uploaded Image
    original_filename = secure_filename(file.filename)
    # Prefix with short UUID to prevent filename collisions
    unique_filename = f"{uuid.uuid4().hex[:8]}_{original_filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)
    
    # 3. Process the Image (Quality Check -> Inference)
    # The `run_inference` pipeline automatically runs the quality check first.
    result = run_inference(filepath)
    
    # 4. Handle Specific Outcomes
    
    # Outcome A: Image failed quality check
    if result.get("status") == "rejected_quality":
        return jsonify({
            "status": "rejected",
            "message": "Image failed quality checks. YOLO inference was not executed.",
            "image_quality": result.get("quality")
        }), 400
        
    # Outcome B: Image passed quality, but YOLO model is missing (as expected for now)
    if result.get("status") == "error" and "Model file not found" in result.get("message", ""):
        return jsonify({
            "status": "model_not_available",
            "message": "Image passed quality checks, but the trained YOLO model (best.pt) is not available yet.",
            "image_quality": result.get("quality")
        }), 503  # 503 Service Unavailable
        
    # Outcome C: Other execution errors (e.g., ultralytics missing, crash during inference)
    if result.get("status") == "error":
        return jsonify(result), 500
        
    # Outcome D: Full success (YOLO model exists and ran successfully)
    
    # Format the response exactly as required by the frontend
    formatted_response = {
        "status": "success",
        "image_quality": result.get("quality", {}),
        "detections": result.get("detections", []),
        "summary": {
            "total_objects": len(result.get("detections", [])),
            "average_confidence": result.get("metrics", {})
        }
    }
    
    # Add image URL if available
    annotated_path = result.get("annotated_image_path")
    if annotated_path and os.path.exists(annotated_path):
        filename = os.path.basename(annotated_path)
        formatted_response["processed_image_url"] = request.host_url + "outputs/" + filename
        
    return jsonify(formatted_response), 200


if __name__ == '__main__':
    # Run the Flask development server
    app.run(host='0.0.0.0', port=5000, debug=True)
