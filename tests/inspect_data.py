import torch
import sys

# PyTorch load
try:
    data = torch.load(r'c:\Users\VB\Desktop\reproject\tower-detection\models\weights.pt\best\data.pkl', map_location='cpu', weights_only=False)
    
    # Let's inspect the model classes. Usually under data['model'].names
    model = data.get('model', None)
    if model and hasattr(model, 'names'):
        names = model.names
        print("Number of classes:", len(names))
        for k, v in names.items():
            print(f"ID {k}: {v}")
    else:
        print("Could not find names in model object.")
except Exception as e:
    print(f"Failed: {e}")
