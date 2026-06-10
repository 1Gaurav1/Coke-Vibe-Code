import sys
import os
from moviepy import VideoFileClip

video_path = "Generate_video_rotating_shoes_202606092341.mp4"
audio_path = os.path.join("Photos", "video_audio.mp3")

if os.path.exists(audio_path):
    os.remove(audio_path)

print("Extracting audio from video...")
video = VideoFileClip(video_path)

audio = video.audio
if audio is None:
    print("Video has no audio track!")
    sys.exit(0)

# Remove the last 2 seconds to match the frames
trim_seconds = 2
if video.duration > trim_seconds:
    trimmed_audio = audio.subclipped(0, video.duration - trim_seconds)
else:
    trimmed_audio = audio

# Write the audio to an mp3 file
trimmed_audio.write_audiofile(audio_path, logger=None)
video.close()

print(f"Audio extracted successfully to {audio_path}")
