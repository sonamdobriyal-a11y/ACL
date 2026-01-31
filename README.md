# ACL Tear Detection System

A professional web application that uses AI-powered MediaPipe pose detection to analyze body posture and detect potential ACL (Anterior Cruciate Ligament) tears by measuring knee angles and calculating risk probabilities.

🌐 **[View Live Demo](#)** | 📚 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** | ⚡ **[Quick Deploy](QUICK_DEPLOY.md)**

## Features

- **Real-time Camera Detection**: Use your webcam to detect ACL tear risk in real-time
- **Image Upload**: Upload images for analysis
- **Pose Skeleton Visualization**: See MediaPipe pose landmarks drawn on the body
- **Knee Angle Measurement**: Automatic calculation of left and right knee angles
- **ACL Tear Probability**: Risk assessment based on knee angle abnormalities
- **Multi-Page Application**: Professional navigation with Home, Live Detection, and Upload pages
- **Educational Content**: Information about ACL tears and detection methodology
- **Modern UI**: Beautiful, responsive web interface with custom illustrations
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
ACL_cursor/
├── backend/          # Python FastAPI backend
│   ├── main.py      # API server and detection logic
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoCapture.js
│   │   │   ├── ImageUpload.js
│   │   │   └── ResultsDisplay.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## How It Works

### ACL Detection Algorithm

The system detects ACL tear risk by:

1. **Pose Detection**: Uses MediaPipe to detect 33 body landmarks
2. **Knee Angle Calculation**: Calculates the angle between hip-knee-ankle for both legs
3. **Risk Assessment**: Evaluates risk based on:
   - Hyperextension (angle < 5°)
   - Extreme flexion (angle > 160°)
   - Abnormal angle ranges
   - Asymmetric angles between legs

### Risk Levels

- **Low Risk (0-30%)**: Normal knee angles detected
- **Medium Risk (30-50%)**: Slight abnormalities detected
- **High Risk (50%+)**: Significant angle abnormalities

## API Endpoints

### POST `/detect`
Upload an image file for ACL detection.

**Request**: Multipart form data with `file` field

**Response**:
```json
{
  "success": true,
  "annotated_image": "data:image/jpeg;base64,...",
  "left_knee_angle": 165.3,
  "right_knee_angle": 162.1,
  "average_knee_angle": 163.7,
  "left_acl_probability": 25.0,
  "right_acl_probability": 20.0,
  "average_acl_probability": 22.5,
  "landmarks_detected": true
}
```

### POST `/detect-base64`
Detect ACL from base64 encoded image.

**Request**:
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**: Same as `/detect` endpoint

## Usage

1. Start both backend and frontend servers
2. Open the web application in your browser
3. Choose between:
   - **Camera Mode**: Real-time detection using webcam
   - **Upload Mode**: Upload an image for analysis
4. View the results showing:
   - Annotated image with pose skeleton
   - Knee angles for both legs
   - ACL tear probability percentages
   - Risk level indicators

## Technical Details

### Backend
- **Framework**: FastAPI
- **Pose Detection**: MediaPipe Pose
- **Image Processing**: OpenCV, PIL
- **CORS**: Enabled for localhost development

### Frontend
- **Framework**: React 18
- **Pose Visualization**: MediaPipe JavaScript
- **HTTP Client**: Axios
- **Styling**: CSS with modern gradients and animations

## Important Notes

⚠️ **Medical Disclaimer**: This is a demonstration tool for educational purposes only. It should NOT be used for actual medical diagnosis. Always consult with qualified healthcare professionals for medical assessments.

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions in your browser
- Check that no other application is using the camera
- Try refreshing the page

### Backend Connection Error
- Verify the backend is running on port 8000
- Check CORS settings if accessing from a different origin
- Ensure all dependencies are installed

### No Pose Detected
- Ensure the person is fully visible in the frame
- Check lighting conditions
- Try different camera angles
- Make sure the person is facing the camera

## Deployment

### Quick Deployment (15 minutes)

Deploy to production in 3 simple steps:

1. **Backend**: Deploy to Render or Railway (free tier)
2. **Frontend**: Deploy to Vercel (free tier)
3. **Configure**: Set environment variables

### Choose Your Backend Platform:

#### Option 1: Render (Recommended for reliability) ⭐
- ✅ 750 free hours/month
- ✅ Automatic HTTPS
- ✅ Simple setup
- ⚠️ Cold starts after 15 min idle (free tier)

📖 **[Deploy on Render Guide](RENDER_DEPLOY.md)** - Complete Render deployment guide

#### Option 2: Railway (Recommended for speed)
- ✅ $5 credit/month
- ✅ Faster deployment
- ✅ No cold starts on free tier

📖 **[Deploy on Railway Guide](QUICK_DEPLOY.md)** - Railway deployment guide

### Frontend Deployment (Both options use Vercel)

📖 **Full Guide**: See deployment guides above for step-by-step instructions

📋 **Checklist**: Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to ensure everything works

### All Deployment Options

- **Render + Vercel** ⭐ Most reliable (750 free hours)
- **Railway + Vercel** ⭐ Fastest (but $5 credit)
- **Heroku** (Paid, simpler setup)
- **Docker** (Full control, VPS required)
- **AWS/GCP/Azure** (Enterprise, most flexible)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions for all platforms.

## Project Documentation

- 📖 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- ⚡ [Quick Deploy](QUICK_DEPLOY.md) - 15-minute deployment guide
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Pre/post-deployment checks
- 🎨 [Assets & Design](ASSETS_AND_DESIGN.md) - Visual assets documentation
- 📋 [Multi-Page Setup](MULTIPAGE_SETUP.md) - Application architecture
- 🔬 [Detection Logic](ACL_DETECTION_LOGIC.md) - Algorithm details

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **AI/ML**: MediaPipe Pose Detection
- **Image Processing**: OpenCV, NumPy, Pillow
- **Server**: Uvicorn ASGI server

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Pose Visualization**: MediaPipe JavaScript
- **HTTP Client**: Axios
- **Styling**: Modern CSS with gradients and animations

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is for educational and demonstration purposes only.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For deployment help, see:
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Deploy Guide](QUICK_DEPLOY.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)

## Acknowledgments

- MediaPipe by Google Research
- React team for the amazing framework
- FastAPI for the modern Python web framework
