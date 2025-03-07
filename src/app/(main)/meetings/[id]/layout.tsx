"use client";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MeetingLayout({ children }: LayoutProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900">
      <div className="flex-1 relative">{children}</div>
    </div>
  );
}
