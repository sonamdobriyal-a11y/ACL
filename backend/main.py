from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from typing import List, Dict
import base64
import io
import os
import urllib.request
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe import ImageFormat

app = FastAPI(title="ACL Tear Detection API")

# Enable CORS
# Allow both local development and production frontend
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://acl-mu.vercel.app",  # Production frontend
]

# Add environment variable for additional origins if needed
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Pose Landmarker
# Download model file if it doesn't exist
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, 'pose_landmarker.task')

# Download the model if it doesn't exist
if not os.path.exists(MODEL_PATH):
    print("Downloading MediaPipe Pose Landmarker model...")
    MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    print("Model downloaded successfully!")

# Initialize with the model file
base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    output_segmentation_masks=False,
    min_pose_detection_confidence=0.5,
    min_pose_presence_confidence=0.5,
    min_tracking_confidence=0.5,
    num_poses=1,
    running_mode=vision.RunningMode.IMAGE
)
pose_landmarker = vision.PoseLandmarker.create_from_options(options)

# Pose landmark indices (from MediaPipe documentation)
class PoseLandmark:
    LEFT_HIP = 23
    LEFT_KNEE = 25
    LEFT_ANKLE = 27
    RIGHT_HIP = 24
    RIGHT_KNEE = 26
    RIGHT_ANKLE = 28


def calculate_angle(point1, point2, point3):
    """Calculate angle between three points in degrees, with improved hyperextension detection"""
    a = np.array([point1.x, point1.y])  # hip
    b = np.array([point2.x, point2.y])  # knee (vertex)
    c = np.array([point3.x, point3.y])  # ankle
    
    # Vector from knee to hip
    vec_hip = a - b
    # Vector from knee to ankle
    vec_ankle = c - b
    
    # Calculate angle using dot product
    dot_product = np.dot(vec_hip, vec_ankle)
    magnitude_hip = np.linalg.norm(vec_hip)
    magnitude_ankle = np.linalg.norm(vec_ankle)
    
    if magnitude_hip == 0 or magnitude_ankle == 0:
        return None
    
    cos_angle = dot_product / (magnitude_hip * magnitude_ankle)
    cos_angle = np.clip(cos_angle, -1.0, 1.0)
    angle = np.arccos(cos_angle) * 180.0 / np.pi
    
    # Detect hyperextension: if ankle is behind the knee relative to hip
    # Cross product to determine direction
    cross_product = vec_hip[0] * vec_ankle[1] - vec_hip[1] * vec_ankle[0]
    
    # If hyperextended (cross product < 0), the angle is > 180°
    # Convert to show as small angle for easier detection
    if cross_product < 0:  # Hyperextended
        angle = 180 - angle  # This will give us a small angle for hyperextension
    
    # Normalize to 0-180 range
    if angle > 180.0:
        angle = 360 - angle
    
    return angle


def detect_acl_angle(landmarks):
    """Detect ACL-related angles from pose landmarks"""
    if not landmarks or len(landmarks) == 0:
        return None, None, None
    
    try:
        # Key points for ACL detection (knee angle)
        # Left leg: hip -> knee -> ankle
        left_hip = landmarks[PoseLandmark.LEFT_HIP]
        left_knee = landmarks[PoseLandmark.LEFT_KNEE]
        left_ankle = landmarks[PoseLandmark.LEFT_ANKLE]
        
        # Right leg: hip -> knee -> ankle
        right_hip = landmarks[PoseLandmark.RIGHT_HIP]
        right_knee = landmarks[PoseLandmark.RIGHT_KNEE]
        right_ankle = landmarks[PoseLandmark.RIGHT_ANKLE]
        
        # Calculate knee angles
        left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)
        
        # Average knee angle (only if both angles are valid)
        if left_knee_angle is not None and right_knee_angle is not None:
            avg_knee_angle = (left_knee_angle + right_knee_angle) / 2
        else:
            avg_knee_angle = None
        
        return left_knee_angle, right_knee_angle, avg_knee_angle
    except (IndexError, AttributeError) as e:
        return None, None, None


def calculate_acl_tear_probability(knee_angle, left_angle=None, right_angle=None):
    """
    Calculate ACL tear probability with improved sensitivity and asymmetry detection.
    Normal knee flexion: 0-160 degrees
    ACL injury risk indicators:
    - Hyperextension (< 10 degrees or > 170 degrees)
    - Extreme flexion (> 150 degrees)
    - Asymmetric angles between legs
    - Abnormal angle ranges
    """
    if knee_angle is None:
        return 0.0
    
    probability = 0.0
    
    # Normal standing is typically 170-180 degrees - this should be LOW risk
    # Hyperextension detection (< 5 degrees or > 185 degrees - beyond normal standing)
    if knee_angle < 5 or knee_angle > 185:
        probability += 40.0
    
    # Extreme flexion risk (130-170 degrees - but exclude normal standing 170-180)
    # Only flag if significantly bent but not in normal standing range
    if 130 <= knee_angle < 170:  # Bent but not standing
        probability += 30.0
    
    # Abnormal angle ranges (more sensitive)
    if 5 <= knee_angle <= 40:  # Limited flexion
        probability += 25.0
    elif 120 <= knee_angle < 130:  # Near-max flexion
        probability += 20.0
    
    # Asymmetry detection (compare left vs right)
    if left_angle is not None and right_angle is not None:
        angle_diff = abs(left_angle - right_angle)
        # Only add asymmetry risk if both angles are not in normal standing range
        # and the difference is significant
        if angle_diff > 15 and not (170 <= left_angle <= 180 and 170 <= right_angle <= 180):
            probability += 25.0
    
    # Normal range (40-130 degrees for movement, 170-180 degrees for standing) - LOW risk
    if (40 < knee_angle < 130) or (170 <= knee_angle <= 180):
        # For normal positions, set probability to low (0-15%)
        probability = max(0, min(15, probability - 10.0))
    
    # Clamp probability between 0 and 100
    probability = max(0.0, min(100.0, probability))
    
    return round(probability, 2)


def draw_landmarks_on_image(rgb_image, detection_result):
    """Draw pose landmarks on image"""
    annotated_image = rgb_image.copy()
    
    if not detection_result.pose_landmarks:
        return annotated_image
    
    # Draw connections
    connections = [
        # Left leg
        (PoseLandmark.LEFT_HIP, PoseLandmark.LEFT_KNEE),
        (PoseLandmark.LEFT_KNEE, PoseLandmark.LEFT_ANKLE),
        # Right leg
        (PoseLandmark.RIGHT_HIP, PoseLandmark.RIGHT_KNEE),
        (PoseLandmark.RIGHT_KNEE, PoseLandmark.RIGHT_ANKLE),
        # Torso
        (PoseLandmark.LEFT_HIP, PoseLandmark.RIGHT_HIP),
    ]
    
    h, w, _ = annotated_image.shape
    
    # Draw connections
    for start_idx, end_idx in connections:
        if start_idx < len(detection_result.pose_landmarks[0]) and end_idx < len(detection_result.pose_landmarks[0]):
            start = detection_result.pose_landmarks[0][start_idx]
            end = detection_result.pose_landmarks[0][end_idx]
            cv2.line(
                annotated_image,
                (int(start.x * w), int(start.y * h)),
                (int(end.x * w), int(end.y * h)),
                (0, 255, 0),
                2
            )
    
    # Draw landmarks
    for landmark in detection_result.pose_landmarks[0]:
        x = int(landmark.x * w)
        y = int(landmark.y * h)
        cv2.circle(annotated_image, (x, y), 3, (0, 0, 255), -1)
    
    return annotated_image


def process_image(image_bytes: bytes):
    """Process image and detect ACL angles"""
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image format")
    
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Convert to MediaPipe Image
    mp_image = mp.Image(image_format=ImageFormat.SRGB, data=img_rgb)
    
    # Process with MediaPipe
    detection_result = pose_landmarker.detect(mp_image)
    
    # Draw pose landmarks
    annotated_image = draw_landmarks_on_image(img_rgb, detection_result)
    
    if detection_result.pose_landmarks and len(detection_result.pose_landmarks) > 0:
        landmarks = detection_result.pose_landmarks[0]
        
        # Calculate ACL angles
        left_angle, right_angle, avg_angle = detect_acl_angle(landmarks)
        
        # Calculate probabilities with asymmetry detection
        left_prob = calculate_acl_tear_probability(left_angle, left_angle, right_angle)
        right_prob = calculate_acl_tear_probability(right_angle, left_angle, right_angle)
        avg_prob = calculate_acl_tear_probability(avg_angle, left_angle, right_angle)
        
        # Return results without text overlays on image
        return {
            "annotated_image": annotated_image,
            "left_knee_angle": left_angle,
            "right_knee_angle": right_angle,
            "average_knee_angle": avg_angle,
            "left_acl_probability": left_prob,
            "right_acl_probability": right_prob,
            "average_acl_probability": avg_prob,
            "landmarks_detected": True
        }
    else:
        return {
            "annotated_image": annotated_image,
            "left_knee_angle": None,
            "right_knee_angle": None,
            "average_knee_angle": None,
            "left_acl_probability": 0.0,
            "right_acl_probability": 0.0,
            "average_acl_probability": 0.0,
            "landmarks_detected": False
        }


def image_to_base64(image):
    """Convert numpy image to base64 string"""
    # Convert RGB to BGR for OpenCV
    img_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    # Encode to JPEG
    _, buffer = cv2.imencode('.jpg', img_bgr)
    # Convert to base64
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return img_base64


@app.get("/")
async def root():
    return {"message": "ACL Tear Detection API is running"}


@app.get("/health")
async def health_check():
    """Health check endpoint to verify MediaPipe installation"""
    try:
        # Test MediaPipe import
        return {
            "status": "healthy",
            "mediapipe": "installed",
            "version": mp.__version__ if hasattr(mp, '__version__') else "unknown"
        }
    except Exception as e:
        return {
            "status": "error",
            "mediapipe": "not working",
            "error": str(e),
            "message": "Please reinstall MediaPipe: pip install --upgrade mediapipe"
        }


@app.post("/detect")
async def detect_acl(file: UploadFile = File(...)):
    """Endpoint to detect ACL tear from uploaded image"""
    try:
        # Read image file
        image_bytes = await file.read()
        
        # Process image
        result = process_image(image_bytes)
        
        # Convert annotated image to base64
        annotated_base64 = image_to_base64(result["annotated_image"])
        
        return JSONResponse({
            "success": True,
            "annotated_image": f"data:image/jpeg;base64,{annotated_base64}",
            "left_knee_angle": result["left_knee_angle"],
            "right_knee_angle": result["right_knee_angle"],
            "average_knee_angle": result["average_knee_angle"],
            "left_acl_probability": result["left_acl_probability"],
            "right_acl_probability": result["right_acl_probability"],
            "average_acl_probability": result["average_acl_probability"],
            "landmarks_detected": result["landmarks_detected"]
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-base64")
async def detect_acl_base64(data: dict):
    """Endpoint to detect ACL tear from base64 encoded image"""
    try:
        # Extract base64 image
        if "image" not in data:
            raise HTTPException(status_code=400, detail="No image provided")
        
        image_data = data["image"]
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Process image
        result = process_image(image_bytes)
        
        # Convert annotated image to base64
        annotated_base64 = image_to_base64(result["annotated_image"])
        
        return JSONResponse({
            "success": True,
            "annotated_image": f"data:image/jpeg;base64,{annotated_base64}",
            "left_knee_angle": result["left_knee_angle"],
            "right_knee_angle": result["right_knee_angle"],
            "average_knee_angle": result["average_knee_angle"],
            "left_acl_probability": result["left_acl_probability"],
            "right_acl_probability": result["right_acl_probability"],
            "average_acl_probability": result["average_acl_probability"],
            "landmarks_detected": result["landmarks_detected"]
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
