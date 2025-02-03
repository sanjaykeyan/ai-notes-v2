export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="h-full pt-[5rem]">
        <div className="container mx-auto h-[calc(100%-3rem)] px-4 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
