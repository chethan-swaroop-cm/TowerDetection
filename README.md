# AI-Based Tower Component Detection and Visualization

## Overview
This project performs automated detection and localization of tower components using computer vision (YOLOv8) and a Flask backend coupled with a React frontend dashboard.

### Detection Classes
- `0`: `supporting_tower`
- `1`: `monopole_tower`

## Project Workflow
- **Phase 1:** Dataset Preparation (Complete)
- **Phase 2:** Model Development & Evaluation (Complete - YOLOv8 integrated)
- **Phase 3:** Dashboard Development (Complete - React UI built and connected to Flask)

## High-Level Architecture
```
Image
 ↓
Image Quality Check
 ↓
YOLO Object Detection
 ↓
Class + Bounding Box + Confidence
 ↓
Average Confidence
 ↓
Flask Backend
 ↓
Web Dashboard
 ↓
Output Image
```

## Technology Stack
- **Backend:** Flask, OpenCV, Python, NumPy
- **ML/Vision:** Ultralytics YOLOv8
- **Frontend:** React (Vite), React Router DOM

## Setup & Installation

### Backend
1. Create a virtual environment: `python -m venv .venv`
2. Activate it: `.venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Place trained model weights at: `models/best.pt`
5. Place any unzipped dataset in: `dataset/` (Use `data.yaml` for YOLO path configs)
6. Start the backend server: `python backend/app.py`
   - Server runs at `http://127.0.0.1:5000`

### Frontend (React Dashboard)
1. Navigate to the frontend directory: `cd frontend-react`
2. Install Node modules: `npm install`
3. Run the development server: `npm run dev`
4. The dashboard will be accessible via browser (typically `http://localhost:5173`).
