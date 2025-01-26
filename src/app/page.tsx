"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const HomePage = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/sign-in");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              Transform Meetings into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Actionable Notes
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let AI transform your meeting recordings into comprehensive,
              searchable notes instantly.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium
                               hover:bg-blue-700 transition-all duration-200 hover:shadow-xl
                               hover:-translate-y-0.5 transform"
                onClick={handleSignIn}
              >
                Get Started Free
              </button>
              <button
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium
                               hover:bg-gray-200 transition-all duration-200"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Smart Transcription",
                description: "Accurate speech-to-text with speaker recognition",
              },
              {
                icon: "💡",
                title: "AI Summary",
                description: "Get key points and action items automatically",
              },
              {
                icon: "🔄",
                title: "Easy Sharing",
                description: "Share and collaborate with your team instantly",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl
                            transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="text-4xl mb-4 transform transition-transform 
                              group-hover:scale-110 duration-300"
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 mb-8">Trusted by teams at</p>
          <div className="flex justify-center items-center gap-12 opacity-50">
            {["Google", "Microsoft", "Slack", "Twitter"].map((company) => (
              <span key={company} className="text-xl font-bold">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
