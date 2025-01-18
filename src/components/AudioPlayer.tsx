import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function AudioPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg py-3 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🎵</span>
          </div>
          <div>
            <h3 className="font-medium">Meeting Audio</h3>
            <p className="text-sm text-gray-500">00:00 / 00:00</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900">
            <SkipBack className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
            <Play className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-96">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full w-0 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
