'use client';

import { useRouter } from 'next/navigation';

export default function DeleteMeetingButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const response = await fetch(`/api/meetings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete meeting');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-xl font-bold"
      aria-label="Delete meeting"
    >
      ×
    </button>
  );
}