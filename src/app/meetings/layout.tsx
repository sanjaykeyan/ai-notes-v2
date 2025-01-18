import "./meetings.css";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden pt-[72px] bg-white meetings-container">
      <div className="h-full">{children}</div>
    </div>
  );
}
