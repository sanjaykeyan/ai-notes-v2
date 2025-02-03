interface LayoutProps {
  children: React.ReactNode;
}

export default function MeetingLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen relative mt-16 bg-white dark:bg-gray-900">
      {children}
    </div>
  );
}
