export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="pt-[1.5rem] min-h-screen">
        {" "}
        {/* Changed from pt-[5rem] to pt-[4rem] */}
        <div className="container mx-auto px-4 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
