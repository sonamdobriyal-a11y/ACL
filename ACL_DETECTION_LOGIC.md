# ACL Tear Detection Logic

## How It Works

### 1. **Pose Detection**
- Uses MediaPipe Pose to detect 33 body landmarks
- Identifies key points: hips, knees, and ankles for both legs

### 2. **Knee Angle Calculation**
The system calculates the knee angle using three points:
- **Point 1**: Hip joint (LEFT_HIP or RIGHT_HIP)
- **Point 2**: Knee joint (LEFT_KNEE or RIGHT_KNEE) - **vertex of the angle**
- **Point 3**: Ankle joint (LEFT_ANKLE or RIGHT_ANKLE)

The angle is calculated using the formula:
```
angle = arctan2(ankle_y - knee_y, ankle_x - knee_x) - arctan2(hip_y - knee_y, hip_x - knee_x)
```

This gives the angle at the knee joint (the angle between the thigh and shin).

### 3. **ACL Tear Probability Calculation**

The system evaluates ACL tear risk based on knee angle abnormalities:

## Detection Conditions

### **High Risk Conditions (50%+ probability)**

1. **Hyperextension** (Angle < 5°)
   - Risk Score: +30%
   - Condition: Knee is bent backward beyond normal extension
   - Medical significance: ACL prevents hyperextension; extreme hyperextension suggests ACL damage

2. **Extreme Flexion** (Angle > 160°)
   - Risk Score: +25%
   - Condition: Knee is bent too far forward
   - Medical significance: Unnatural extreme flexion can indicate instability

### **Medium Risk Conditions (30-50% probability)**

3. **Limited Flexion** (5° ≤ Angle ≤ 30°)
   - Risk Score: +20%
   - Condition: Knee cannot bend properly (stiffness)
   - Medical significance: Post-injury stiffness or guarding behavior

4. **Near-Maximum Flexion** (140° ≤ Angle ≤ 160°)
   - Risk Score: +15%
   - Condition: Knee is at the upper limit of normal range
   - Medical significance: May indicate compensation or limited range of motion

### **Low Risk Conditions (0-30% probability)**

5. **Normal Range** (30° < Angle < 140°)
   - Risk Score: -10% (reduces overall probability)
   - Condition: Knee is within normal functional range
   - Medical significance: Healthy knee movement

## Risk Level Classification

- **Low Risk (0-30%)**: Normal knee angles detected
- **Medium Risk (30-50%)**: Slight abnormalities detected
- **High Risk (50%+)**: Significant angle abnormalities

## Key Points

1. **Bilateral Analysis**: The system analyzes both left and right knees independently
2. **Average Calculation**: Also provides an average risk assessment
3. **Real-time Detection**: Can detect angles in real-time from camera feed
4. **Image Analysis**: Can analyze uploaded static images

## Limitations

⚠️ **Important Medical Disclaimer**:
- This is a **demonstration tool** for educational purposes
- It only analyzes **geometric angles**, not actual ligament integrity
- Real ACL diagnosis requires:
  - Physical examination
  - Medical imaging (MRI, X-ray)
  - Clinical history
  - Professional medical assessment

## Example Scenarios

### Scenario 1: Normal Standing
- **Knee Angle**: ~180° (straight leg)
- **Risk**: Low (0-10%)
- **Reason**: Normal standing posture

### Scenario 2: Deep Squat
- **Knee Angle**: ~45° (bent knee)
- **Risk**: Low (0-10%)
- **Reason**: Normal functional range

### Scenario 3: Hyperextended Knee
- **Knee Angle**: < 5° (bent backward)
- **Risk**: High (30%+)
- **Reason**: Abnormal hyperextension

### Scenario 4: Extreme Flexion
- **Knee Angle**: > 160° (over-flexed)
- **Risk**: High (25%+)
- **Reason**: Beyond normal range

### Scenario 5: Stiff Knee
- **Knee Angle**: 10-20° (limited flexion)
- **Risk**: Medium (20%+)
- **Reason**: Reduced range of motion

## Technical Implementation

The detection algorithm:
1. Captures image/video frame
2. Processes with MediaPipe Pose
3. Extracts hip, knee, and ankle coordinates
4. Calculates angle for each leg
5. Applies risk scoring based on angle ranges
6. Returns probability percentage and risk level
7. Visualizes skeleton overlay on image

## Future Enhancements

Potential improvements could include:
- Asymmetry detection (comparing left vs right)
- Movement pattern analysis (gait analysis)
- Historical tracking (comparing over time)
- Machine learning models trained on actual ACL injury data
- Integration with additional biomechanical markers
