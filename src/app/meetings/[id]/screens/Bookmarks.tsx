import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface Bookmark {
  id: string;
  text: string;
  createdAt: string;
}

export default function Bookmarks({ meetingId }: { meetingId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
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

    fetchBookmarks();
  }, [meetingId]);

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
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative group"
        >
          <p className="text-sm text-gray-700 pr-8">{bookmark.text}</p>
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
      {bookmarks.length === 0 && (
        <p className="text-gray-500 text-center">No bookmarks yet</p>
      )}
    </div>
  );
}
