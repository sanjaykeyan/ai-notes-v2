import Navbar from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[56px]">
        {children}
      </div>
    </>
  );
}
