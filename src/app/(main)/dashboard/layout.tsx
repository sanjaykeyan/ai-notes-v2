export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-full pt-[5rem]">
        <div className="container mx-auto h-[calc(100%-3rem)] px-4 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
