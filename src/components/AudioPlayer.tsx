import { Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { usePlayback } from '@/contexts/PlaybackContext';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

export default function AudioPlayer({ audioUrl, title = "Meeting Audio" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { setCurrentTime: setPlaybackCurrentTime, registerSeekCallback } = usePlayback();

  // Separate effect for seek callback registration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    registerSeekCallback((time: number) => {
      if (audio) {
        audio.currentTime = time;
      }
    });
  }, [registerSeekCallback]); // Only re-run if registerSeekCallback changes

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("Loading audio from URL:", audioUrl);

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setPlaybackCurrentTime(audio.currentTime);
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleCanPlay = () => {
      console.log("Audio can be played");
      setError(null);
    };
    const handleLoadStart = () => console.log("Audio loading started");
    const handleLoadedData = () => console.log("Audio data loaded");
    const handleError = () => {
      const errorMessage = audio.error 
        ? `Audio error: ${audio.error.message}` 
        : 'Unknown audio error';
      console.error(errorMessage);
      setError(errorMessage);
    };

    // Add loading state
    const handleWaiting = () => console.log("Audio is waiting/buffering");
    const handleSuspend = () => console.log("Audio download suspended");
    const handleStalled = () => console.log("Audio download stalled");

    // Add progress tracking
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const progress = (bufferedEnd / audio.duration) * 100;
        setLoadingProgress(progress);
        if (progress === 100) {
          setIsLoading(false);
        }
      }
    };

    const handleCanPlayThrough = () => {
      console.log("Audio can play through");
      setIsLoading(false);
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Test audio URL directly
    fetch(audioUrl)
      .then(response => {
        console.log('Audio URL headers:', response.headers);
        console.log('Audio URL status:', response.status);
      })
      .catch(err => console.error('Audio URL fetch error:', err));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [audioUrl, setPlaybackCurrentTime]); // Remove registerSeekCallback from dependencies

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        await audio.pause();
      } else {
        console.log("Attempting to play audio...");
        const playResult = await audio.play();
        console.log("Play succeeded:", playResult);
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Playback error:', err);
      setError(err instanceof Error ? err.message : 'Failed to play audio');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const progressBar = event.currentTarget;
    const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
    const percentageClicked = clickPosition / progressBar.offsetWidth;
    const newTime = percentageClicked * audio.duration;
    
    audio.currentTime = newTime;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm py-3 px-4 md:px-6">
      <audio 
        ref={audioRef} 
        src={audioUrl}
        preload="auto"
        crossOrigin="anonymous" // Add this line for CORS
      />
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
        {/* Album art and title - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🎵</span>
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        {/* Time display on mobile */}
        <div className="md:hidden text-sm text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Playback controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="text-gray-600 hover:text-gray-900">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-[400px] md:w-96">
          <div 
            className="h-1 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {isLoading && (
              <div 
                className="h-full bg-blue-300 rounded-full absolute top-0"
                style={{ width: `${loadingProgress}%` }}
              />
            )}
          </div>
          {isLoading && (
            <div className="text-xs text-gray-500 mt-1">
              Loading... {Math.round(loadingProgress)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
