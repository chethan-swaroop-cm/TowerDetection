import os
from ultralytics import YOLO

model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'weights.pt'))
print(f"Trying to load {model_path}")

try:
    model = YOLO(model_path)
    print("Model loaded!")
    results = model('test_images/img_00351f186c1f4a42.jpg')
    print("Inference results:", results)
except Exception as e:
    print(f"FAILED to load or run inference: {str(e)}")
