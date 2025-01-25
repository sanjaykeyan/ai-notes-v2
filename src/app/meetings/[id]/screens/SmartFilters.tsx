"use client";
import { useState, useEffect } from "react";
import SmartFilterDisplay from "../components/SmartFilterDisplay";

interface SmartFiltersProps {
  meetingId: string;
}

export default function SmartFilters({ meetingId }: SmartFiltersProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/meetings/${meetingId}/smartFilters`);
        const result = await response.json();
        // Parse the content string into JSON if it's a string
        const parsedContent =
          result.content && typeof result.content === "string"
            ? JSON.parse(result.content)
            : result.content;
        setData(parsedContent);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [meetingId]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 h-full overflow-auto">
      <SmartFilterDisplay
        data={data || { dates: [], metrics: [], tasks: [] }}
      />
    </div>
  );
}
