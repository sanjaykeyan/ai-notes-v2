export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <div className="relative pt-16 lg:pt-24 pb-8 lg:pb-12 min-h-screen z-0">
        <div className="container mx-auto px-4 lg:px-6">{children}</div>
      </div>
    </div>
  );
}
