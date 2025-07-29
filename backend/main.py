from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
import re
from typing import List, Optional

app = FastAPI(title="YouTube Timestamp Finder API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development (consider restricting in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageResponse(BaseModel):
    message: str
    status: str

class TranscriptRequest(BaseModel):
    youtube_url: str

class TranscriptEntry(BaseModel):
    text: str
    start: float
    duration: float

class TranscriptResponse(BaseModel):
    video_id: str
    title: Optional[str] = None
    transcript: List[TranscriptEntry]
    status: str
    message: str

@app.get("/")
async def root():
    return {"message": "YouTube Timestamp Finder API is running!", "status": "success"}

@app.get("/api/health")
async def health_check():
    return {"message": "API is healthy", "status": "success"}

@app.get("/api/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello, {name}!", "status": "success"}

def extract_video_id(youtube_url: str) -> str:
    """
    Extract video ID from various YouTube URL formats
    """
    # Common YouTube URL patterns
    patterns = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^&\n?#]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/embed/([^&\n?#]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/v/([^&\n?#]+)',
        r'(?:https?://)?youtu\.be/([^&\n?#]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?.*v=([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, youtube_url)
        if match:
            return match.group(1)
    
    # If no pattern matches, assume the input is already a video ID
    if len(youtube_url) == 11 and re.match(r'^[a-zA-Z0-9_-]+$', youtube_url):
        return youtube_url
    
    raise ValueError("Invalid YouTube URL or video ID")

@app.post("/api/transcript", response_model=TranscriptResponse)
async def get_video_transcript(request: TranscriptRequest):
    """
    Get transcript for a YouTube video
    """
    try:
        # Extract video ID from URL
        video_id = extract_video_id(request.youtube_url)
        
        # Create API instance and get transcript
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id)
        
        # Convert to our format
        transcript_entries = [
            TranscriptEntry(
                text=snippet.text,
                start=snippet.start,
                duration=snippet.duration
            )
            for snippet in fetched_transcript
        ]
        
        return TranscriptResponse(
            video_id=video_id,
            transcript=transcript_entries,
            status="success",
            message=f"Successfully retrieved transcript for video {video_id}"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except TranscriptsDisabled:
        raise HTTPException(
            status_code=404, 
            detail="Transcripts are disabled for this video"
        )
    
    except NoTranscriptFound:
        raise HTTPException(
            status_code=404, 
            detail="No transcript found for this video"
        )
    
    except VideoUnavailable:
        raise HTTPException(
            status_code=404, 
            detail="Video is unavailable or does not exist"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching transcript: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 