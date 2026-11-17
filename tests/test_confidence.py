import os
import sys
import math

# Add parent directory to path so we can import the utils module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.confidence import calculate_class_metrics

def test_calculate_class_metrics():
    print("--- Testing Confidence Calculations ---")
    
    # Test Case 1: Standard inputs based on requirements
    detections_standard = [
        {"class": "supporting_tower", "confidence": 0.91},
        {"class": "supporting_tower", "confidence": 0.87},
        {"class": "supporting_tower", "confidence": 0.94},
        {"class": "monopole_tower", "confidence": 0.82},
        {"class": "monopole_tower", "confidence": 0.88},
    ]
    
    result_standard = calculate_class_metrics(detections_standard)
    
    supp_count = result_standard["supporting_tower"]["count"]
    supp_avg = result_standard["supporting_tower"]["average_confidence"]
    mono_count = result_standard["monopole_tower"]["count"]
    mono_avg = result_standard["monopole_tower"]["average_confidence"]
    
    print("Test Case 1 (Standard):")
    print(f"Supporting Tower: Count = {supp_count}, Avg Conf = {supp_avg}")
    print(f"Monopole Tower: Count = {mono_count}, Avg Conf = {mono_avg}\n")
    
    # Assertions
    assert supp_count == 3
    assert math.isclose(supp_avg, (0.91 + 0.87 + 0.94) / 3, rel_tol=1e-5)
    assert mono_count == 2
    assert math.isclose(mono_avg, 0.85, rel_tol=1e-5)
    
    
    # Test Case 2: Zero detections
    detections_empty = []
    result_empty = calculate_class_metrics(detections_empty)
    
    print("Test Case 2 (Empty):")
    print(result_empty, "\n")
    
    # Assertions for zero detections (must be None, not 0%)
    assert result_empty["supporting_tower"]["count"] == 0
    assert result_empty["supporting_tower"]["average_confidence"] is None
    assert result_empty["monopole_tower"]["count"] == 0
    assert result_empty["monopole_tower"]["average_confidence"] is None
    
    
    # Test Case 3: Mixed (One class present, one missing + an unknown class)
    detections_mixed = [
        {"class": "supporting_tower", "confidence": 0.99},
        {"class": "unknown_class", "confidence": 0.50}
    ]
    result_mixed = calculate_class_metrics(detections_mixed)
    
    print("Test Case 3 (Mixed):")
    print(result_mixed, "\n")
    
    # Assertions
    assert result_mixed["supporting_tower"]["count"] == 1
    assert math.isclose(result_mixed["supporting_tower"]["average_confidence"], 0.99)
    assert result_mixed["monopole_tower"]["count"] == 0
    assert result_mixed["monopole_tower"]["average_confidence"] is None

    print("All Confidence Tests Passed Successfully!")

if __name__ == "__main__":
    test_calculate_class_metrics()
