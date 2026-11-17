import torch
import matplotlib.pyplot as plt
import json
import os

ckpt = torch.load('models/best.pt', weights_only=False)
train_results = ckpt.get('train_results', {})
metrics = ckpt.get('train_metrics', {})

# Save metrics text
report = f"""TOWERVISION AI - MODEL EVALUATION REPORT

Dataset Configuration:
----------------------
Dataset Path: {ckpt.get('train_args', {}).get('data', 'Not Found')}
Note: The validation/test dataset is NOT present in the local environment (the model was trained on Google Colab).
Therefore, per-class evaluation, confusion matrix, instance counts, and example prediction images on the test set were not calculated.

Final Model Metrics (extracted from checkpoint validation):
-----------------------------------------------------------
1. Precision:  {metrics.get('metrics/precision(B)', 'N/A'):.4f}
2. Recall:     {metrics.get('metrics/recall(B)', 'N/A'):.4f}
3. mAP@50:     {metrics.get('metrics/mAP50(B)', 'N/A'):.4f}
4. mAP@50-95:  {metrics.get('metrics/mAP50-95(B)', 'N/A'):.4f}

5. IoU-related evaluation:
   Validation Box Loss: {metrics.get('val/box_loss', 'N/A'):.4f}
   Validation DFL Loss: {metrics.get('val/dfl_loss', 'N/A'):.4f}
   mAP@50-95 indirectly represents IoU threshold performance across 0.50 to 0.95.

Unavailable Metrics:
--------------------
6. Confusion matrix: Not calculated (dataset missing).
7. Per-class results: Not calculated (dataset missing).
8. Number of validation/test images: Not calculated (dataset missing).
9. Number of instances per class: Not calculated (dataset missing).
10. Example correct detections: Not generated (dataset missing).
11. Example incorrect/missed detections: Not generated (dataset missing).
"""

with open('evaluation/evaluation_report.txt', 'w') as f:
    f.write(report)

print(report)

# Plot Training Progress
epochs = train_results.get('epoch', [])
if epochs:
    plt.figure(figsize=(10, 8))
    
    plt.subplot(2, 2, 1)
    plt.plot(epochs, train_results.get('metrics/precision(B)', []), label='Precision')
    plt.plot(epochs, train_results.get('metrics/recall(B)', []), label='Recall')
    plt.title('Precision and Recall')
    plt.xlabel('Epoch')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(2, 2, 2)
    plt.plot(epochs, train_results.get('metrics/mAP50(B)', []), label='mAP@50')
    plt.plot(epochs, train_results.get('metrics/mAP50-95(B)', []), label='mAP@50-95')
    plt.title('mAP Scores')
    plt.xlabel('Epoch')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(2, 2, 3)
    plt.plot(epochs, train_results.get('train/box_loss', []), label='Train Box Loss')
    plt.plot(epochs, train_results.get('val/box_loss', []), label='Val Box Loss')
    plt.title('Box Loss')
    plt.xlabel('Epoch')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(2, 2, 4)
    plt.plot(epochs, train_results.get('train/cls_loss', []), label='Train Cls Loss')
    plt.plot(epochs, train_results.get('val/cls_loss', []), label='Val Cls Loss')
    plt.title('Class Loss')
    plt.xlabel('Epoch')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig('evaluation/training_metrics_plot.png')
    print("Plot saved to evaluation/training_metrics_plot.png")
