def calculate_class_metrics(detections):
    """
    Calculates the detection count and average confidence for required classes.
    
    Args:
        detections (list): A list of dictionaries representing object detections.
                           Expected format: [{"class": "class_name", "confidence": float}, ...]
                           
    Returns:
        dict: A clean dictionary containing counts and average confidences for 
              'supporting_tower' and 'monopole_tower'. Suitable for Flask API responses.
    """
    # Initialize the required structure for the response
    metrics = {
        "supporting_tower": {
            "count": 0,
            "average_confidence": None
        },
        "monopole_tower": {
            "count": 0,
            "average_confidence": None
        }
    }
    
    # Track accumulated confidences for average calculation
    confidences = {
        "supporting_tower": [],
        "monopole_tower": []
    }
    
    # Iterate over detections and aggregate data
    for det in detections:
        cls_name = det.get("class")
        conf = det.get("confidence")
        
        # Only process required classes and ignore malformed detections missing confidence
        if cls_name in confidences and conf is not None:
            confidences[cls_name].append(conf)
            metrics[cls_name]["count"] += 1
            
    # Calculate averages
    for cls_name, cls_confidences in confidences.items():
        if metrics[cls_name]["count"] > 0:
            avg_conf = sum(cls_confidences) / metrics[cls_name]["count"]
            metrics[cls_name]["average_confidence"] = avg_conf
            
    return metrics
