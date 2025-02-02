import { useState } from "react";
import {
  formatSummary,
  getSectionEmoji,
  getSectionColor,
} from "../utils/notesFormatter";

interface ScreenBProps {
  summary: string;
}

export default function ScreenB({ summary }: ScreenBProps) {
  const formattedSummary = formatSummary(summary);
  const [fontSize, setFontSize] = useState(14);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const adjustFontSize = (increment: boolean) => {
    setFontSize((prev) => {
      const newSize = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newSize, 12), 24);
    });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center lg:flex hidden">
        <h2 className="text-lg font-semibold text-gray-900">Meeting Summary</h2>
        <div className="flex items-center gap-1 bg-gray-50 rounded-md p-0.5 border border-gray-200">
          <button
            onClick={() => adjustFontSize(false)}
            className="px-1 py-0.5 rounded text-gray-600 text-xs font-medium hover:bg-white hover:shadow-sm transition-all duration-150"
            aria-label="Decrease font size"
          >
            Aa
          </button>
          <div className="w-px h-3 bg-gray-200 mx-0.5" />
          <button
            onClick={() => adjustFontSize(true)}
            className="px-1 py-0.5 rounded text-gray-600 text-xs font-medium hover:bg-white hover:shadow-sm transition-all duration-150"
            aria-label="Increase font size"
          >
            AA
          </button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto elegant-scrollbar">
          <div className="p-6">
            <div className="prose max-w-none" style={{ fontSize: `${fontSize}px` }}>
              {formattedSummary ? (
                <div className="space-y-8">
                  {/* Key Insights Section */}
                  <div>
                    <h3 className={`${getSectionColor("keyInsights")} text-lg font-bold mb-3 flex items-center gap-2`}>
                      {getSectionEmoji("keyInsights")} Key Meeting Insights
                    </h3>
                    <ul className="space-y-3 list-none pl-6">
                      {formattedSummary.keyInsights.map((insight, index) => (
                        <li key={index} className="text-gray-700">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="my-6 border-gray-200" />

                  {/* Collapsible Full Summary */}
                  <div>
                    <button
                      onClick={() => setShowFullSummary(!showFullSummary)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">Full Meeting Summary</span>
                      <span>{showFullSummary ? "▼" : "▶"}</span>
                    </button>
                    
                    {showFullSummary && (
                      <div className="mt-6 space-y-8">
                        {/* Original summary sections */}
                        {/* Overview Section */}
                        <div>
                          <h3 className={`${getSectionColor("overview")} text-lg font-bold mb-3 flex items-center gap-2`}>
                            {getSectionEmoji("overview")} Overview
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {formattedSummary.overview}
                          </p>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        {/* Other Sections */}
                        {Object.entries(formattedSummary).map(([section, items]) => {
                          if (section === "overview" || section === "keyInsights") return null;
                          const title = section
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");

                          return (
                            <div key={section} className="space-y-4">
                              <h3
                                className={`${getSectionColor(
                                  section as keyof typeof formattedSummary
                                )} text-lg font-bold flex items-center gap-2`}
                              >
                                {getSectionEmoji(
                                  section as keyof typeof formattedSummary
                                )}
                                {title}
                              </h3>
                              <ul className="space-y-3 list-none pl-6">
                                {Array.isArray(items) &&
                                  items.map((item: string, index: number) => (
                                    <li key={index} className="text-gray-700">
                                      • {item}
                                    </li>
                                  ))}
                              </ul>
                              {section !== "nextSteps" && (
                                <hr className="my-6 border-gray-200" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No summary available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
