'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
