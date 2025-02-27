"use client";
import { useState, useEffect } from "react";
import {
  formatSentimentAnalysis,
  FormattedSentiment,
} from "../utils/sentimentFormatter";

interface SentimentProps {
  meetingId: string;
}

export default function Sentiment({ meetingId }: SentimentProps) {
  const [analysis, setAnalysis] = useState<FormattedSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get existing analysis
        const response = await fetch(`/api/meetings/${meetingId}/sentiment`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success === false) {
          throw new Error(data.error || "Failed to fetch analysis");
        }

        if (!data.analysis) {
          // If no existing analysis, generate new one
          const generateResponse = await fetch(
            `/api/meetings/${meetingId}/sentiment`,
            {
              method: "POST",
            }
          );

          if (!generateResponse.ok) {
            throw new Error(`HTTP error! status: ${generateResponse.status}`);
          }

          const generateData = await generateResponse.json();

          if (generateData.success === false) {
            throw new Error(
              generateData.error || "Failed to generate analysis"
            );
          }

          setAnalysis(formatSentimentAnalysis(generateData.analysis));
        } else {
          setAnalysis(formatSentimentAnalysis(data.analysis));
        }
      } catch (error) {
        console.error("Error fetching sentiment:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, [meetingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 p-4">Error: {error}</div>
    );
  }

  return (
    <div className="h-[calc(100vh-15.9rem)] overflow-y-auto elegant-scrollbar">
      <div className="space-y-3 p-2">
        {analysis ? (
          <>
            {/* Overall Tone - Compact Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Overall Tone
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium 
                ${
                  analysis.overallTone.tone === "Professional"
                    ? "bg-blue-100 text-blue-800"
                    : analysis.overallTone.tone === "Casual"
                    ? "bg-green-100 text-green-800"
                    : analysis.overallTone.tone === "Tense"
                    ? "bg-red-100 text-red-800"
                    : analysis.overallTone.tone === "Friendly"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-purple-100 text-purple-800"
                }`}
                >
                  {analysis.overallTone.tone}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {analysis.overallTone.description}
              </p>
            </div>

            {/* Key Moments - Collapsible Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Key Moments
              </h3>
              <div className="space-y-2">
                {analysis.keyMoments.map((moment, index) => (
                  <div key={index} className="border-l-2 border-amber-400 pl-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {moment.moment}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {moment.sentiment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Engagement
              </h3>
              {analysis.participantEngagement.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-1 last:mb-0"
                >
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 pr-2">
                    {item.observation}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0
                  ${
                    item.level === "High"
                      ? "bg-green-100 text-green-800"
                      : item.level === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  >
                    {item.level}
                  </span>
                </div>
              ))}
            </div>

            {/* Agreement & Disagreement - Combined */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Areas of Agreement
                  </h4>
                  <ul className="space-y-1">
                    {analysis.agreementAreas.map((area, index) => (
                      <li key={index} className="flex items-start text-xs">
                        <span className="text-green-500 mr-1.5 mt-0.5">•</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {area}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Areas of Discussion
                  </h4>
                  <ul className="space-y-1">
                    {analysis.disagreementAreas.map((area, index) => (
                      <li key={index} className="flex items-start text-xs">
                        <span className="text-amber-500 mr-1.5 mt-0.5">•</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {area}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Communication Insights - Compact */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Communication Insights
              </h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Patterns
                  </h4>
                  <ul className="space-y-1">
                    {analysis.communicationDynamics.patterns.map(
                      (pattern, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <span className="text-blue-500 mr-1.5 mt-0.5">•</span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {pattern}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {analysis.communicationDynamics.suggestions.map(
                      (suggestion, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <span className="text-purple-500 mr-1.5 mt-0.5">
                            •
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {suggestion}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            No sentiment analysis available.
          </div>
        )}
      </div>
    </div>
  );
}
