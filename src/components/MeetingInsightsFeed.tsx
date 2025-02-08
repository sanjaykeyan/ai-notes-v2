import Link from "next/link";

type MeetingWithInsights = {
  id: string;
  title: string;
  createdAt: Date;
  summary: string | null;
  keyTakeaways: string[] | null;
  actionItems: string[] | null;
  duration: number | null;
  isLiveRecorded: boolean;
  speakerMappings: Array<{
    customName: string;
    originalName: string;
  }>;
  timestampMapping: any | null;
};

function formatSummary(summary: string | null): string {
  if (!summary) return "";

  try {
    if (summary.startsWith("{")) {
      const parsed = JSON.parse(summary);

      // Check for different possible JSON structures
      if (parsed.overview && Array.isArray(parsed.overview)) {
        return parsed.overview[0]
          .trim()
          .replace(/[\[\]"]/g, "") // Remove brackets and quotes
          .replace(/\n+/g, " ") // Replace newlines with spaces
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .trim();
      }

      if (typeof parsed.summary === "string") {
        return parsed.summary
          .trim()
          .replace(/[\[\]"]/g, "")
          .replace(/\n+/g, " ")
          .replace(/\s+/g, " ");
      }
    }

    // If not JSON or parsing failed, clean up the raw text
    return summary
      .trim()
      .replace(/[\[\]"]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ");
  } catch (e) {
    console.error("Failed to parse summary:", e);
    // If JSON parsing fails, return cleaned plain text
    return summary
      .trim()
      .replace(/[\[\]"]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ");
  }
}

function formatInsights(insights: string[] | null): string[] {
  if (!insights) return [];

  try {
    // Handle the new JSON structure
    if (
      insights.length === 1 &&
      typeof insights[0] === "string" &&
      insights[0].startsWith("{")
    ) {
      const parsed = JSON.parse(insights[0]);
      if (parsed.keyInsights && Array.isArray(parsed.keyInsights)) {
        return parsed.keyInsights
          .filter(Boolean)
          .map((insight) => insight.trim())
          .filter((insight) => insight.length > 0);
      }
    }
  } catch (e) {
    console.error("Failed to parse insights:", e);
  }

  return [];
}

export default function MeetingInsightsFeed({
  meeting,
}: {
  meeting: MeetingWithInsights | null;
}) {
  if (!meeting) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>No meetings recorded yet.</p>
        <p className="mt-2">Upload your first meeting to see insights here!</p>
      </div>
    );
  }

  const formattedKeyTakeaways = formatInsights(meeting.keyTakeaways);
  const formattedSummary = formatSummary(meeting.summary);

  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Simplified Meeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Latest Meeting Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {meeting.title}
          </p>
        </div>
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group"
        >
          View Full Summary
          <svg
            className="w-4 h-4 transform transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Summary - Left Side */}
        {formattedSummary && (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Summary
            </h3>
            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ maxHeight: "120px" }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formattedSummary}
                </p>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/50 dark:from-gray-800/50 to-transparent" />
              </div>
              <Link
                href={`/meetings/${meeting.id}`}
                className="absolute bottom-0 left-0 right-0 text-center bg-gradient-to-t from-white/80 dark:from-gray-800/80 pt-8 pb-1"
              >
                <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                  Show More
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Meeting Analytics - Right Side */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Meeting Details
          </h3>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Duration
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {meeting.duration
                    ? `${Math.floor(meeting.duration / 60)} min ${Math.floor(
                        meeting.duration % 60
                      )} sec`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Recording Type
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {meeting.isLiveRecorded
                    ? "Live Recording"
                    : "Uploaded Recording"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(meeting.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Participants */}
            <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                Participants ({meeting.speakerMappings.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {meeting.speakerMappings.map((speaker, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-full px-3 py-1"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {speaker.customName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {speaker.customName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items Preview */}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Action Items ({meeting.actionItems.length})
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <span className="text-purple-500">•</span>
                {meeting.actionItems[0]}
              </p>
              <Link
                href={`/meetings/${meeting.id}`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-2"
              >
                See all action items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
