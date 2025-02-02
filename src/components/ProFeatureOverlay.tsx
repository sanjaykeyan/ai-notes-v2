import { useRouter } from "next/navigation";

export default function ProFeatureOverlay() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
        PRO Feature
      </div>
      <h3 className="text-xl font-semibold mb-2">Smart Filters</h3>
      <p className="text-gray-600 mb-4 max-w-sm">
        Upgrade to Pro to unlock AI-powered smart filters and get deeper insights from your meetings.
      </p>
      <button
        onClick={() => router.push("/pricing")}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
