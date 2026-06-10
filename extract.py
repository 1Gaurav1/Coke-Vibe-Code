import sys
import subprocess
import os
import glob
import re

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import cv2
except ImportError:
    print("Installing OpenCV (this may take a few seconds)...")
    install("opencv-python")
    import cv2

video_path = "Generate_video_rotating_shoes_202606092341.mp4"
photos_dir = "Photos"

# Ensure Photos directory exists and clear old images
if not os.path.exists(photos_dir):
    os.makedirs(photos_dir)
else:
    for f in glob.glob(os.path.join(photos_dir, "*.jpg")):
        os.remove(f)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"Error: Could not open video file {video_path}")
    sys.exit(1)

fps = cap.get(cv2.CAP_PROP_FPS)
if fps == 0: fps = 30 # fallback
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
video_length_sec = total_frames / fps
print(f"Video is {video_length_sec:.2f} seconds long ({total_frames} frames @ {fps:.2f} fps)")

# Remove the last 2 seconds
trim_seconds = 2
trim_frames = int(fps * trim_seconds) 
frames_to_keep = max(1, total_frames - trim_frames)
print(f"Extracting {frames_to_keep} frames (removing last {trim_seconds} seconds).")

extracted_count = 0
for i in range(frames_to_keep):
    ret, frame = cap.read()
    if not ret:
        break
    
    # Save frame as HD high-quality JPG
    frame_filename = os.path.join(photos_dir, f"frame-{i+1:03d}.jpg")
    cv2.imwrite(frame_filename, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
    extracted_count += 1
    if extracted_count % 50 == 0:
        print(f"Extracted {extracted_count}/{frames_to_keep}...")

cap.release()
print(f"Successfully extracted {extracted_count} frames to {photos_dir}.")

# Update index.html
html_path = "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace old ezgif names with new clean names
content = content.replace("Photos/ezgif-frame-", "Photos/frame-")

# Update frameCount dynamically
content = re.sub(r'const frameCount = \d+;', f'const frameCount = {extracted_count};', content)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html to load the new HD frames.")
