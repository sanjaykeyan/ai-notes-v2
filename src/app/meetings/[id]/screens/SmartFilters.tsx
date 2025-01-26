"use client";
import { useState, useEffect } from "react";
import SmartFilterDisplay from "../components/SmartFilterDisplay";

interface SmartFiltersData {
  dates: string[];
  metrics: string[];
  tasks: string[];
}

interface APIResponse {
  content: SmartFiltersData;
  cached: boolean;
  cachedAt?: string;
  error?: string;
}

interface SmartFiltersProps {
  meetingId: string;
}

export default function SmartFilters({ meetingId }: SmartFiltersProps) {
  const [data, setData] = useState<SmartFiltersData | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/meetings/${meetingId}/smartFilters`);
        const result: APIResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        if (!result.content) {
          throw new Error('No content received from server');
        }

        setData(result.content);
        setIsCached(result.cached);
        setCachedAt(result.cachedAt || null);
      } catch (err) {
        console.error('SmartFilters error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [meetingId]);

  if (isLoading) return (
    <div className="p-4 text-gray-600">
      <div className="animate-pulse">Loading smart filters...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-4">
      <div className="text-red-500 font-medium mb-2">Error loading smart filters</div>
      <div className="text-sm text-gray-600">{error}</div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto elegant-scrollbar">
      {isCached && cachedAt && (
        <div className="px-2 py-1 mb-2 text-xs text-gray-500 bg-gray-50 rounded-md">
          Using cached analysis from {new Date(cachedAt).toLocaleDateString()}
        </div>
      )}
      <div className="p-2">
        <SmartFilterDisplay
          data={data || { dates: [], metrics: [], tasks: [] }}
        />
      </div>
    </div>
  );
}
