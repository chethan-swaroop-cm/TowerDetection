import os
import sys

def verify_model():
    print("=== MODEL VERIFICATION ===")
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'best.pt'))
    test_image_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'test_images', 'img_00351f186c1f4a42.jpg'))
    
    print(f"Model path: {model_path}")
    print(f"Test image path: {test_image_path}")

    # 1. Check if it exists
    if not os.path.exists(model_path):
        print("MODEL FILE: FAIL (File not found)")
        return
    else:
        print("MODEL FILE: PASS")

    # 2. Try to load with Ultralytics
    try:
        from ultralytics import YOLO
        model = YOLO(model_path)
        print("LOADABLE: PASS")
    except ImportError:
        print("LOADABLE: FAIL (Ultralytics not installed)")
        return
    except Exception as e:
        print(f"LOADABLE: FAIL ({e})")
        return

    # 7. Basic Model Info
    print(f"TASK: {model.task}")
    
    # 3. Print class names and mapping
    names = model.names
    num_classes = len(names)
    print(f"NUMBER OF CLASSES: {num_classes}")
    
    print("CLASS MAPPING:")
    for cls_id, cls_name in names.items():
        print(f"  {cls_id}: {cls_name}")
        
    # 5. Verify required classes
    required_classes = {'supporting_tower', 'monopole_tower'}
    actual_classes = set(names.values())
    if num_classes == 2 and required_classes == actual_classes:
        print("REQUIRED CLASSES: PASS")
    else:
        print(f"REQUIRED CLASSES: FAIL (Expected exactly {required_classes}, found {actual_classes})")

    # 8. Run ONE test inference
    if not os.path.exists(test_image_path):
        print(f"TEST INFERENCE: FAIL (Test image not found at {test_image_path})")
        return

    try:
        print("\n=== RUNNING INFERENCE ===")
        results = model(test_image_path)
        print("TEST INFERENCE: PASS")
        
        # 7 & 8: Process results
        result = results[0]
        boxes = result.boxes
        num_detections = len(boxes)
        print(f"NUMBER OF DETECTIONS: {num_detections}")
        
        print("DETECTIONS:")
        for i, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            cls_name = names[cls_id]
            conf = float(box.conf[0].item())
            xyxy = box.xyxy[0].tolist()
            print(f"  Detection {i+1}: Class='{cls_name}', Confidence={conf:.4f}, BBox={xyxy}")
            
    except Exception as e:
        print(f"TEST INFERENCE: FAIL ({e})")
        return

if __name__ == "__main__":
    verify_model()
