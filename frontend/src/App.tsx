import { useState } from 'react'
import './App.css'

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

interface TranscriptResponse {
  video_id: string;
  title: string | null;
  transcript: TranscriptEntry[];
  status: string;
  message: string;
}

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://www.youtube.com/watch?v=jNQXAC9IVRw')
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [transcriptLoading, setTranscriptLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('Enter a YouTube URL to get started')
  const [videoId, setVideoId] = useState<string>('')

  // Function to format seconds into YouTube-style timestamps
  const formatTimestamp = (seconds: number, showHours: boolean): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (showHours) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
  }

  // Function to convert seconds to YouTube URL timestamp format
  const formatYouTubeTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    let timeString = ''
    if (hours > 0) {
      timeString += `${hours}h`
    }
    if (minutes > 0) {
      timeString += `${minutes}m`
    }
    if (secs > 0 || timeString === '') {
      timeString += `${secs}s`
    }
    
    return timeString
  }

  // Function to handle timestamp click
  const handleTimestampClick = (startTime: number) => {
    const timestampParam = formatYouTubeTimestamp(startTime)
    const videoUrl = `${youtubeUrl}&t=${timestampParam}`
    window.open(videoUrl, '_blank')
  }

  // Check if any timestamp exceeds 1 hour to determine format
  const maxTimestamp = transcript.length > 0 ? Math.max(...transcript.map(entry => entry.start)) : 0
  const showHours = maxTimestamp >= 3600

  const fetchTranscript = async () => {
    setTranscriptLoading(true)
    setTranscript([])
    setMessage('Fetching transcript...')
    
    try {
      const response = await fetch('http://localhost:8000/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: youtubeUrl })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to fetch transcript')
      }
      
      const data: TranscriptResponse = await response.json()
      setTranscript(data.transcript)
      setVideoId(data.video_id)
      setMessage(`Successfully retrieved ${data.transcript.length} transcript entries`)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      console.error('Transcript Error:', error)
    } finally {
      setTranscriptLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !transcriptLoading) {
      fetchTranscript()
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 YouTube Transcript Finder</h1>
        <p>Extract transcripts with precise timestamps from any YouTube video</p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <div className="url-input-group">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
              className="url-input"
              disabled={transcriptLoading}
            />
            <button 
              onClick={fetchTranscript} 
              disabled={transcriptLoading || !youtubeUrl.trim()}
              className="fetch-button"
            >
              {transcriptLoading ? 'Fetching...' : 'Get Transcript'}
            </button>
          </div>
          
          <div className="status-message">
            {message}
          </div>
        </div>

        {transcript.length > 0 && (
          <div className="transcript-section">
            <div className="transcript-header">
              <h2>📝 Transcript for Video: {videoId}</h2>
              <span className="entry-count">{transcript.length} entries</span>
            </div>
            
            <div className="transcript-container">
              {transcript.map((entry, index) => (
                <div key={index} className="transcript-entry">
                  <span 
                    className="timestamp clickable" 
                    onClick={() => handleTimestampClick(entry.start)}
                    title="Click to open YouTube video at this time"
                  >
                    {formatTimestamp(entry.start, showHours)}
                  </span>
                  <span className="transcript-text">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
