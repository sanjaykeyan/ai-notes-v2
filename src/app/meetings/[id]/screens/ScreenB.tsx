import { useState, useEffect } from "react";
import { TypeWriter } from "@/app/components/TypeWriter";
import {
  formatSummary,
  getSectionEmoji,
  getSectionColor,
} from "../utils/notesFormatter";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface ScreenBProps {
  summary: string;
}

interface ExpandedInsight {
  insightIndex: number;
  points: string[];
  isLoading: boolean;
  isTyping: boolean;
}

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  showHint?: boolean;
}

interface ParentSectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function SectionHeader({
  title,
  isExpanded,
  onToggle,
  showHint,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full group bg-gradient-to-r from-white to-gray-50/80 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-0.5 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-40"
              }`}
            />
            <div className="flex flex-col items-start">
              <h3 className="font-medium text-gray-700 text-sm">{title}</h3>
              {showHint && (
                <span className="text-[11px] text-indigo-500/80">
                  Click items below to see AI analysis
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <span className="text-xs text-indigo-500/80 font-medium">
              {showHint ? "Viewing insights" : "Expanded"}
            </span>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-indigo-500/60 transition-transform duration-300 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <div
        className={`h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-opacity duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

function ParentSectionHeader({
  title,
  isExpanded,
  onToggle,
}: ParentSectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full group bg-gradient-to-r from-white to-gray-50/80 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-0.5 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-40"
              }`}
            />
            <div className="flex flex-col items-start">
              <h3 className="font-medium text-gray-700 text-sm">{title}</h3>
              <span className="text-[11px] text-indigo-500/80">
                {isExpanded ? "View complete meeting details" : "Click to expand full summary"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <span className="text-xs text-indigo-500/80 font-medium">
              Expanded
            </span>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-indigo-500/60 transition-transform duration-300 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <div
        className={`h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-opacity duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

export default function ScreenB({ summary }: ScreenBProps) {
  const formattedSummary = formatSummary(summary);
  const [fontSize, setFontSize] = useState(14);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [expandedInsight, setExpandedInsight] =
    useState<ExpandedInsight | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [sectionsState, setSectionsState] = useState({
    keyInsights: true,
    overview: true,
    keyPoints: true,
    actionItems: true,
    decisions: true,
    nextSteps: true,
  });

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

  const toggleSection = (section: keyof typeof sectionsState) => {
    setSectionsState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderKeyInsights = () => {
    return formattedSummary?.keyInsights.map((insight, index) => (
      <div key={index} className="group/insight space-y-2">
        <li
          className={`text-gray-700 cursor-pointer rounded-lg transition-all duration-300 ease-in-out 
            ${
              expandedInsight?.insightIndex === index
                ? "bg-gradient-to-r from-indigo-50/90 to-blue-50/80 border border-indigo-100/50 shadow-sm"
                : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
            }`}
          onClick={() => handleInsightClick(insight, index)}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="flex items-start gap-3 p-2.5">
            <div className="relative flex-shrink-0 mt-1">
              <div
                className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                  expandedInsight?.insightIndex === index
                    ? "bg-indigo-100"
                    : "bg-gray-100 group-hover/insight:bg-indigo-50"
                }`}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                  expandedInsight?.insightIndex === index ? "rotate-90" : ""
                }`}
              >
                <ChevronDownIcon className="w-3 h-3 text-indigo-500" />
              </div>
            </div>
            <span className="flex-1">{insight}</span>
          </div>
        </li>
        {expandedInsight?.insightIndex === index && (
          <div
            className="ml-6 pl-4 border-l-2 border-blue-200 overflow-hidden transition-all duration-500 ease-in-out"
            style={{ fontSize: `${fontSize}px` }}
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
          <div className="p-6 space-y-6" style={{ fontSize: `${fontSize}px` }}>
            {formattedSummary ? (
              <div>
                {/* Key Insights Section */}
                <div className="space-y-4">
                  <SectionHeader
                    title="Key Meeting Insights"
                    isExpanded={sectionsState.keyInsights}
                    onToggle={() => toggleSection("keyInsights")}
                    showHint={true}
                  />
                  {sectionsState.keyInsights && (
                    <div className="animate-fadeIn">
                      <ul className="space-y-3 list-none px-4">
                        {renderKeyInsights()}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Full Summary Section */}
                <div className="space-y-6 mt-6">
                  <ParentSectionHeader
                    title="Full Meeting Summary"
                    isExpanded={showFullSummary}
                    onToggle={() => setShowFullSummary(!showFullSummary)}
                  />

                  {showFullSummary && (
                    <div className="space-y-6 animate-fadeIn bg-gradient-to-b from-gray-50/50 to-white p-5 rounded-xl border border-gray-100">
                      {/* Overview Section */}
                      <div className="space-y-4">
                        <SectionHeader
                          title="Overview"
                          isExpanded={sectionsState.overview}
                          onToggle={() => toggleSection("overview")}
                        />
                        {sectionsState.overview && (
                          <div className="px-4 animate-fadeIn">
                            <p className="text-gray-700 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                              {formattedSummary.overview}
                            </p>
                          </div>
                        )}
                      </div>

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
                              <SectionHeader
                                title={title}
                                isExpanded={
                                  sectionsState[
                                    section as keyof typeof sectionsState
                                  ]
                                }
                                onToggle={() =>
                                  toggleSection(
                                    section as keyof typeof sectionsState
                                  )
                                }
                              />
                              {sectionsState[
                                section as keyof typeof sectionsState
                              ] && (
                                <div className="px-4 animate-fadeIn">
                                  <ul className="space-y-3 list-none">
                                    {Array.isArray(items) &&
                                      items.map(
                                        (item: string, index: number) => (
                                          <li
                                            key={index}
                                            className="text-gray-700 flex items-start gap-2"
                                            style={{ fontSize: `${fontSize}px` }}
                                          >
                                            <span className="text-gray-400 mt-1">
                                              •
                                            </span>
                                            <span>{item}</span>
                                          </li>
                                        )
                                      )}
                                  </ul>
                                </div>
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
              <div className="text-gray-500 italic" style={{ fontSize: `${fontSize}px` }}>
                No summary available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
