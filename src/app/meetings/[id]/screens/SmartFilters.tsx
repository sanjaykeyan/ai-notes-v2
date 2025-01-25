"use client";
import { useState, useEffect } from "react";

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
        setData(result);
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
  if (error) return <div className="p-4">{error}</div>;

  return (
    <div className="p-4 h-full overflow-auto">
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
