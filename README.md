# YouTube Timestamp Finder

A full-stack application with a React TypeScript frontend and Python FastAPI backend.

## Project Structure

```
youtube-timestamp-finder/
├── frontend/          # React TypeScript app (Vite)
├── backend/           # Python FastAPI server
├── package.json       # Root package.json with scripts
└── README.md          # This file
```

## Prerequisites

- **Node.js** (version 22.17.1 recommended - see .nvmrc file)
- **Python** (version 3.8 or higher)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

## Quick Start

### Option 1: Run Everything at Once

1. Ensure you're using the correct Node.js version (if using nvm):
   ```bash
   nvm use
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Start both frontend and backend:
   ```bash
   npm run dev
   ```

This will start:
- Frontend on: http://localhost:5173
- Backend on: http://localhost:8000

### Option 2: Run Frontend and Backend Separately

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

The API will be available at:
- Main API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The React app will be available at: http://localhost:5173

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Root endpoint with welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/hello/{name}` - Personalized greeting endpoint
- `POST /api/transcript` - **NEW!** Get YouTube video transcript

### YouTube Transcript API

**Endpoint:** `POST /api/transcript`

**Request Body:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "video_id": "VIDEO_ID",
  "transcript": [
    {
      "text": "Transcript text here",
      "start": 1.2,
      "duration": 2.5
    }
  ],
  "status": "success",
  "message": "Successfully retrieved transcript"
}
```

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Or just the video ID directly

**Features:**
- ✅ Auto-generated transcripts
- ✅ Manual transcripts  
- ✅ Precise timestamps
- ✅ Multiple language support
- ✅ Comprehensive error handling

## Development

### Frontend (React + TypeScript)

- Built with **Vite** for fast development and building
- **TypeScript** for type safety
- **React** with modern hooks
- Hot module replacement (HMR) enabled

### Backend (Python + FastAPI)

- **FastAPI** for modern, fast API development
- **Pydantic** for data validation
- **Uvicorn** as ASGI server
- **CORS** enabled for frontend communication
- Auto-generated API documentation

## Building for Production

### Frontend

```bash
npm run build:frontend
```

This creates a `frontend/dist` directory with production-ready files.

### Backend

The Python backend can be deployed using any ASGI server. For production, consider using:

```bash
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

## Features

- ✅ React TypeScript frontend with Vite 7.x
- ✅ Python FastAPI backend with auto-generated docs
- ✅ **YouTube Transcript API integration**
- ✅ **Support for auto-generated and manual transcripts**
- ✅ **Precise timestamp data for video content**
- ✅ CORS configuration for frontend-backend communication
- ✅ Interactive transcript testing interface
- ✅ Type-safe API communication
- ✅ Hot reload for both frontend and backend
- ✅ Comprehensive error handling
- ✅ Multiple YouTube URL format support

## Next Steps

The core YouTube transcript functionality is now working! You can extend this by:

1. **Timestamp Search**: Add the ability to search within transcripts and jump to specific timestamps
2. **Multi-language Support**: Implement transcript language selection and translation
3. **Transcript Export**: Add functionality to export transcripts in various formats (SRT, VTT, TXT)
4. **Video Analysis**: Integrate AI/ML for content analysis, summarization, or keyword extraction
5. **Database Integration**: Store and cache transcripts for faster retrieval
6. **User Authentication**: Add user accounts and saved transcript history
7. **Batch Processing**: Support multiple video transcript fetching
8. **Testing**: Add comprehensive tests (Jest for frontend, pytest for backend)
9. **Deployment**: Set up production deployment with Docker/cloud services

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 5173 or 8000 are in use, update the ports in the configuration files.

2. **CORS errors**: Make sure the backend CORS configuration includes your frontend URL.

3. **Python dependencies**: If you encounter issues with pip, try using a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Node.js version**: If you get warnings about Node.js version, consider updating to the latest LTS version.

## License

This project is open source and available under the [MIT License](LICENSE). 