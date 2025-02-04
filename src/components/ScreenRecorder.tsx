"use client";
import { useState, useRef, useEffect } from "react";

interface ScreenRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

const ScreenRecorder = ({ onRecordingComplete }: ScreenRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);

  const startRecording = async () => {
    try {
      // Request screen capture with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
        video: {
          frameRate: 1, // Minimal video to focus on audio
        },
      });

      // Get the audio track from the screen capture
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        throw new Error("No audio track available");
      }

      // Create a new MediaStream with only the audio track
      const audioStream = new MediaStream([audioTrack]);

      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const endTime = Date.now();
      const duration = startTimeRef.current
        ? (endTime - startTimeRef.current) / 1000
        : 0;
      setRecordingDuration(duration);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, duration);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Update recording duration in real-time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && startTimeRef.current) {
      interval = setInterval(() => {
        const duration = (Date.now() - startTimeRef.current!) / 1000;
        setRecordingDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Clean up function
  const cleanup = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
        <p className="text-sm">
          ℹ️ Please select the tab or window containing your online meeting when
          prompted. Make sure to enable "Share audio" in the system dialog.
        </p>
      </div>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                   transition-all duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          Start Recording
        </button>
      ) : (
        <div className="space-y-2">
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 
                     transition-all duration-200 flex items-center gap-2 animate-pulse"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Stop Recording ({formatDuration(recordingDuration)})
          </button>
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <div className="mt-4">
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full"
            onEnded={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
