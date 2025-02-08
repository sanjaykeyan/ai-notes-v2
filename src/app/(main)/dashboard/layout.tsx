export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="h-full pt-[5rem]">
        <div className="container mx-auto h-[calc(100%-3rem)] px-4 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
