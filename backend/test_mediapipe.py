#!/usr/bin/env python3
"""Test script to diagnose MediaPipe import issues"""

print("Testing MediaPipe imports...")
print("=" * 50)

# Test 1: Basic import
try:
    import mediapipe as mp
    print("✓ Successfully imported mediapipe")
    print(f"  MediaPipe location: {mp.__file__ if hasattr(mp, '__file__') else 'unknown'}")
    print(f"  MediaPipe version: {mp.__version__ if hasattr(mp, '__version__') else 'unknown'}")
    print(f"  MediaPipe attributes: {[x for x in dir(mp) if not x.startswith('_')][:10]}")
except Exception as e:
    print(f"✗ Failed to import mediapipe: {e}")
    exit(1)

# Test 2: Try mp.solutions
try:
    mp_pose = mp.solutions.pose
    print("\n✓ Successfully accessed mp.solutions.pose")
except AttributeError as e:
    print(f"\n✗ Failed to access mp.solutions.pose: {e}")
    print("  Trying alternative imports...")
    
    # Test 3: Try direct import
    try:
        from mediapipe.python.solutions import pose as mp_pose
        print("  ✓ Successfully imported from mediapipe.python.solutions.pose")
    except ImportError as e2:
        print(f"  ✗ Failed: {e2}")
        
        # Test 4: Try another path
        try:
            import mediapipe.python.solutions.pose as mp_pose
            print("  ✓ Successfully imported using import mediapipe.python.solutions.pose")
        except ImportError as e3:
            print(f"  ✗ Failed: {e3}")
            print("\n" + "=" * 50)
            print("RECOMMENDATION: Try reinstalling MediaPipe:")
            print("  pip uninstall mediapipe -y")
            print("  pip install mediapipe==0.10.32")
            exit(1)

# Test 5: Try drawing_utils
try:
    mp_drawing = mp.solutions.drawing_utils
    print("\n✓ Successfully accessed mp.solutions.drawing_utils")
except AttributeError:
    try:
        from mediapipe.python.solutions import drawing_utils as mp_drawing
        print("\n✓ Successfully imported drawing_utils from mediapipe.python.solutions")
    except ImportError:
        try:
            import mediapipe.python.solutions.drawing_utils as mp_drawing
            print("\n✓ Successfully imported drawing_utils using direct import")
        except ImportError as e:
            print(f"\n✗ Failed to import drawing_utils: {e}")

# Test 6: Try creating a Pose instance
try:
    test_pose = mp_pose.Pose(static_image_mode=True)
    print("\n✓ Successfully created Pose instance")
    print("\n" + "=" * 50)
    print("SUCCESS: MediaPipe is working correctly!")
    print("The import method that works is:")
    if hasattr(mp, 'solutions'):
        print("  import mediapipe as mp")
        print("  mp_pose = mp.solutions.pose")
    else:
        print("  from mediapipe.python.solutions import pose as mp_pose")
except Exception as e:
    print(f"\n✗ Failed to create Pose instance: {e}")
    exit(1)
