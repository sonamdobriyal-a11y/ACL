# ACL Detection System - Multi-Page Application

## Overview
A professional, multi-page web application for ACL tear detection using AI-powered pose estimation.

## Application Structure

### Pages

1. **Home Page** (`/`)
   - Hero section with call-to-action buttons
   - About ACL tears section
   - How we solve the problem
   - Technology stack information
   - Medical disclaimer

2. **Live Detection** (`/camera-detection`)
   - Real-time camera-based detection
   - Live pose tracking with skeleton overlay
   - Real-time risk assessment
   - Side panel with statistics

3. **Upload Image** (`/upload-image`)
   - Image upload functionality
   - Static image analysis
   - Annotated results with skeleton overlay
   - Detailed risk assessment

### Components

- **Navbar**: Professional navigation bar with active link highlighting
- **VideoCapture**: Live camera feed with MediaPipe integration
- **ImageUpload**: Drag-and-drop image upload interface
- **ResultsDisplay**: Dynamic results panel (adapts to camera/upload mode)

## Features

### Professional Design
- Modern gradient color scheme (#667eea to #764ba2)
- Responsive layout for all screen sizes
- Smooth transitions and hover effects
- Professional typography and spacing

### Navigation
- Sticky navigation bar
- Active page highlighting
- Mobile-responsive menu
- Logo with icon

### Content
- Educational information about ACL tears
- Technology explanation
- Risk assessment guide
- Medical disclaimer

### Technical Features
- Multi-page routing with React Router
- Conditional rendering based on mode
- Responsive grid layouts
- Professional animations

## Starting the Application

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## Page Navigation

- **Home**: Introduction and information
- **Live Detection**: Real-time camera analysis
- **Upload Image**: Static image analysis

## Design System

### Colors
- Primary: #667eea (Purple-Blue)
- Secondary: #764ba2 (Purple)
- Success: #4CAF50 (Green)
- Warning: #ff9800 (Orange)
- Danger: #f44336 (Red)

### Typography
- Headings: System fonts (San Francisco, Segoe UI, Roboto)
- Body: 1rem base size
- Line height: 1.6-1.8 for readability

### Spacing
- Base unit: 8px
- Section padding: 60-100px vertical
- Component gaps: 20-30px

## Responsive Breakpoints

- Desktop: > 968px (2-column layout)
- Tablet: 768px - 968px (single column)
- Mobile: < 768px (optimized for touch)
- Small mobile: < 480px (compact layout)

## No Emojis
All emojis have been removed for a professional appearance. Icons use SVG or text characters (✓, →, •) for visual indicators.

## Professional Elements

1. **Hero Section**: Bold gradient with clear CTA buttons
2. **Feature Cards**: Hover effects and shadow transitions
3. **Live Indicator**: Animated pulse dot for live detection
4. **Tech Stack**: Professional information display
5. **Disclaimer**: Orange-accented warning box
6. **Navigation**: Clean, modern header

## File Structure

```
frontend/src/
├── App.js                      # Main routing
├── App.css                     # Global app styles
├── index.js                    # Entry point
├── index.css                   # Global styles
├── components/
│   ├── Navbar.js              # Navigation component
│   ├── Navbar.css
│   ├── VideoCapture.js        # Camera detection
│   ├── VideoCapture.css
│   ├── ImageUpload.js         # Image upload
│   ├── ImageUpload.css
│   ├── ResultsDisplay.js      # Results panel
│   └── ResultsDisplay.css
└── pages/
    ├── Home.js                # Home page
    ├── Home.css
    ├── CameraDetection.js     # Live detection page
    ├── CameraDetection.css
    ├── ImageUploadPage.js     # Upload page
    └── ImageUploadPage.css
```

## Key Improvements

1. ✓ Multi-page navigation
2. ✓ Professional design system
3. ✓ Educational content about ACL
4. ✓ Responsive across all devices
5. ✓ No emojis - professional appearance
6. ✓ Sticky navigation
7. ✓ Smooth page transitions
8. ✓ Clear call-to-action buttons
9. ✓ Medical disclaimer
10. ✓ Technology stack information
