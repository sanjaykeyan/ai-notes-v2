import "./meetings.css";
import Sidebar from "@/components/MeetingSidebar";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden pt-[72px] bg-white meetings-container">
      <div className="h-full flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
