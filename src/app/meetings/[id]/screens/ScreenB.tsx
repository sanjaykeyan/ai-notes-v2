interface ScreenBProps {
  summary: string;
}

export default function ScreenB({ summary }: ScreenBProps) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 shrink-0">
        <h2 className="text-lg heading-text">Meeting Summary</h2>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto elegant-scrollbar">
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="content-text space-y-4">
                {summary.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
