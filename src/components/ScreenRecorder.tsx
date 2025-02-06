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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Ready to Record Your Meeting
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6 max-w-md">
            Click the button below to start recording. Make sure to grant
            microphone access when prompted for the best audio quality.
          </p>

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 
                         dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200
                         hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 dark:bg-red-500 hover:bg-red-700 
                         dark:hover:bg-red-600 text-white rounded-lg transition-all duration-200
                         hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                Stop Recording{" "}
                {recordingDuration > 0 &&
                  `(${formatDuration(recordingDuration)})`}
              </button>
            )}
          </div>

          {isRecording && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Recording in progress... Click stop when finished.
            </p>
          )}
        </div>
      </div>

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
