interface LayoutProps {
  children: React.ReactNode;
}

export default function MeetingLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen relative mt-16">
      {" "}
      {/* Add mt-16 for navbar height */}
      {children}
    </div>
  );
}
