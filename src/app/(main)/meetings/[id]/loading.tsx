export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
          {/* Add Audio Player Loading State */}
          <div className="fixed bottom-0 left-0 right-0">
            <div className="bg-white border-t p-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}