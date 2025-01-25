"use client";
import { useEffect, useState } from "react";
import { TrashIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface Bookmark {
  id: string;
  text: string;
  createdAt: string;
}

interface BookmarksProps {
  meetingId: string;
  onBookmarksChange?: () => void;
}

function EmptyBookmarksTutorial() {
  return (
    <div className="text-center p-8 max-w-sm mx-auto">
      <BookmarkIcon className="h-8 w-8 mx-auto mb-4 text-gray-400" />
      <h3 className="text-base font-medium text-gray-900 mb-2">
        No bookmarks yet
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Save important parts of your meeting notes for quick access:
      </p>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            1
          </div>
          <p>Select any text in your transcript</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            2
          </div>
          <p>Click the bookmark icon that appears</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            3
          </div>
          <p>Find all your bookmarks here</p>
        </div>
      </div>
    </div>
  );
}

export default function Bookmarks({
  meetingId,
  onBookmarksChange,
}: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/bookmarks?meetingId=${meetingId}`);
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // Add effect to refetch when refreshKey changes
  useEffect(() => {
    fetchBookmarks();
  }, [meetingId, refreshKey]);

  // Add this effect to listen for bookmark changes
  useEffect(() => {
    if (onBookmarksChange) {
      // Create a function to handle the refresh
      const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
      };

      // Set up event listener
      window.addEventListener("bookmarkUpdated", handleRefresh);

      return () => {
        window.removeEventListener("bookmarkUpdated", handleRefresh);
      };
    }
  }, [onBookmarksChange]);

  const handleDelete = async (bookmarkId: string) => {
    try {
      setIsDeleting(bookmarkId);
      const response = await fetch(`/api/bookmarks?id=${bookmarkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      // Call onBookmarksChange after successful deletion
      onBookmarksChange?.();
      toast.success("Bookmark deleted successfully", {
        duration: 2000,
        style: {
          background: "#F9FAFB",
          color: "#1F2937",
          border: "1px solid #E5E7EB",
        },
      });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("Failed to delete bookmark");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative group"
            >
              <p className="text-[14px] leading-relaxed text-gray-700 pr-8">{bookmark.text}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(bookmark.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(bookmark.id)}
                disabled={isDeleting === bookmark.id}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[14px] text-gray-500 text-center py-8">
          No bookmarks yet
        </div>
      )}
    </div>
  );
}
