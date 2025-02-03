import { useState, useEffect } from "react";
import { TypeWriter } from "@/app/components/TypeWriter";
import {
  formatSummary,
  getSectionEmoji,
  getSectionColor,
} from "../utils/notesFormatter";

interface ScreenBProps {
  summary: string;
}

interface ExpandedInsight {
  insightIndex: number;
  points: string[];
  isLoading: boolean;
  isTyping: boolean;
}

export default function ScreenB({ summary }: ScreenBProps) {
  const formattedSummary = formatSummary(summary);
  const [fontSize, setFontSize] = useState(14);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [expandedInsight, setExpandedInsight] =
    useState<ExpandedInsight | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    if (expandedInsight?.points.length && expandedInsight.isTyping) {
      setTypingIndex(0);
    }
  }, [expandedInsight?.points, expandedInsight?.isTyping]);

  const adjustFontSize = (increment: boolean) => {
    setFontSize((prev) => {
      const newSize = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newSize, 12), 24);
    });
  };

  const handleInsightClick = async (insight: string, index: number) => {
    if (expandedInsight?.insightIndex === index) {
      setExpandedInsight(null);
      return;
    }

    setExpandedInsight({
      insightIndex: index,
      points: [],
      isLoading: true,
      isTyping: false,
    });
    setTypingIndex(0);

    try {
      const response = await fetch("/api/expand-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          insight,
          transcript: summary,
        }),
      });

      const data = await response.json();
      setExpandedInsight({
        insightIndex: index,
        points: data.expandedPoints,
        isLoading: false,
        isTyping: true,
      });
    } catch (error) {
      console.error("Error expanding insight:", error);
      setExpandedInsight({
        insightIndex: index,
        points: ["Failed to load expanded insights"],
        isLoading: false,
        isTyping: false,
      });
    }
  };

  const renderKeyInsights = () => {
    return formattedSummary?.keyInsights.map((insight, index) => (
      <div key={index} className="space-y-2">
        <li
          className={`text-gray-700 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
            expandedInsight?.insightIndex === index
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
              : "hover:bg-blue-50/30"
          }`}
          onClick={() => handleInsightClick(insight, index)}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-blue-500 transition-all duration-300 ${
                expandedInsight?.insightIndex === index ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            {insight}
          </div>
        </li>
        {expandedInsight?.insightIndex === index && (
          <div
            className="ml-6 pl-4 border-l-2 border-blue-200 overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: expandedInsight ? "500px" : "0",
              opacity: expandedInsight ? 1 : 0,
            }}
          >
            {expandedInsight.isLoading ? (
              <div className="flex flex-col gap-2 py-3 px-4">
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative h-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        style={{
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s infinite linear",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-pulse [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            ) : (
              <ul className="space-y-1.5 pt-1">
                {expandedInsight.points.map((point, idx) => (
                  <li
                    key={idx}
                    className={`text-gray-600 text-sm rounded-md transition-all duration-300 ease-out ${
                      idx <= typingIndex
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1"
                    }`}
                    style={{
                      transitionDelay: `${idx * 50}ms`,
                    }}
                  >
                    <div className="flex items-start gap-2 p-2 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-md">
                      <span className="text-blue-400 mt-1">•</span>
                      {idx === typingIndex ? (
                        <TypeWriter
                          text={point}
                          delay={15}
                          onComplete={() => {
                            if (idx < expandedInsight.points.length - 1) {
                              setTypingIndex(idx + 1);
                            }
                          }}
                        />
                      ) : idx < typingIndex ? (
                        <span>{point}</span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    ));
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
            <div
              className="prose max-w-none"
              style={{ fontSize: `${fontSize}px` }}
            >
              {formattedSummary ? (
                <div className="space-y-8">
                  {/* Key Insights Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className={`${getSectionColor("keyInsights")} text-lg font-bold flex items-center gap-2`}>
                        {getSectionEmoji("keyInsights")} Key Meeting Insights
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-sm text-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden sm:inline">Click insights to expand</span>
                        <span className="sm:hidden">Tap to expand</span>
                      </div>
                    </div>
                    <ul className="space-y-3 list-none pl-6">
                      {renderKeyInsights()}
                    </ul>
                  </div>

                  <hr className="my-6 border-gray-200" />

                  {/* Collapsible Full Summary */}
                  <div>
                    <button
                      onClick={() => setShowFullSummary(!showFullSummary)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-lg border border-blue-100 transition-all duration-300 group hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-blue-500 text-lg">
                          {showFullSummary ? "📖" : "📑"}
                        </span>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">
                            Full Meeting Summary
                          </span>
                          <span className="text-sm text-gray-500">
                            {showFullSummary ? "Hide detailed overview" : "View complete meeting notes"}
                          </span>
                        </div>
                      </div>
                      <span className={`text-blue-500 transition-transform duration-300 ${
                        showFullSummary ? "rotate-180" : ""
                      }`}>
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M6 9L12 15L18 9" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {showFullSummary && (
                      <div className="mt-6 space-y-8 animate-fadeIn">
                        {/* Original summary sections */}
                        {/* Overview Section */}
                        <div>
                          <h3
                            className={`${getSectionColor(
                              "overview"
                            )} text-lg font-bold mb-3 flex items-center gap-2`}
                          >
                            {getSectionEmoji("overview")} Overview
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {formattedSummary.overview}
                          </p>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        {/* Other Sections */}
                        {Object.entries(formattedSummary).map(
                          ([section, items]) => {
                            if (
                              section === "overview" ||
                              section === "keyInsights"
                            )
                              return null;
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
                          }
                        )}
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
