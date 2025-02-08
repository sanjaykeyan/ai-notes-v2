import Link from "next/link";

type MeetingWithInsights = {
  id: string;
  title: string;
  createdAt: Date;
  summary: string | null;
  keyTakeaways: string[] | null;
  actionItems: string[] | null;
};

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

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Latest Meeting Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            From: {meeting.title}
          </p>
        </div>
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          View Full Summary →
        </Link>
      </div>

      <div className="space-y-6">
        {meeting.summary && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Summary
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {meeting.summary}
            </p>
          </div>
        )}

        {meeting.keyTakeaways && meeting.keyTakeaways.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Key Takeaways
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {meeting.keyTakeaways.slice(0, 3).map((takeaway, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}

        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Action Items
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {meeting.actionItems.slice(0, 3).map((action, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
