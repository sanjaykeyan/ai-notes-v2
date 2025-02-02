export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-full pt-[5rem]"> {/* Further increased padding-top */}
        <div className="container mx-auto h-[calc(100%-2rem)] px-3 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
