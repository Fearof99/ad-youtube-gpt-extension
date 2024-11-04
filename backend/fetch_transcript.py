# fetch_transcript.py
import sys
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine all lines into a single string
        full_transcript = " ".join([line['text'] for line in transcript])
        print(full_transcript)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    video_id = sys.argv[1]
    get_transcript(video_id)
