"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/sign-in");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
              Transform Meetings into
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Actionable Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Automatically convert your meetings, interviews, and recordings
              into searchable text with Memoria AI. Transcribe, summarize, and
              collaborate all in one powerful workflow.
            </p>
            <div className="flex justify-center mb-12">
              <button
                onClick={handleSignIn}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium
                         hover:bg-blue-700 transition-all duration-300
                         hover:shadow-xl hover:shadow-blue-500/20"
              >
                Start for Free
              </button>
            </div>

            {/* Integration logos */}
            <div className="flex flex-wrap justify-center gap-8 mb-16 opacity-70">
              {["Zoom", "Google Meet", "Microsoft Teams", "Webex", "Slack"].map(
                (app) => (
                  <span key={app} className="text-sm text-gray-500">
                    {app}
                  </span>
                )
              )}
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "5M+", label: "Minutes Transcribed" },
                { number: "50%", label: "Time Saved" },
                { number: "4.8/5", label: "User Rating" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50"
                >
                  <div className="text-3xl font-bold text-blue-600">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase 1: Meeting Transcription */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold leading-tight">
                Meeting
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Transcription
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Transform your recorded meetings into accurate, searchable text.
                Upload any meeting recording and get high-quality transcripts
                with speaker detection.
              </p>
              <ul className="space-y-4">
                {[
                  "99% accuracy in transcription",
                  "Automatic speaker identification",
                  "Fast processing time",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:ml-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-10 blur-3xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/animations/transcription-demo.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase 2: Smart Summary */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-10 blur-3xl"></div>
              <div className="relative">
                <div className="rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                  >
                    <source
                      src="/animations/summary-demo.mp4"
                      type="video/mp4"
                    />{" "}
                    {/* Add this animation */}
                  </video>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl font-bold leading-tight">
                AI-Powered
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Summary
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get instant, actionable insights from your meetings. Our AI
                summarizes key points, decisions, and action items
                automatically.
              </p>
              <div className="grid gap-6">
                {[
                  {
                    title: "Key Points",
                    description: "Automatically extract main discussion topics",
                  },
                  {
                    title: "Action Items",
                    description: "Never miss a task or follow-up item",
                  },
                  {
                    title: "Smart Timeline",
                    description: "Jump to any moment in the conversation",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Memoria AI Works</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Powerful features to make every meeting count
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Meeting Transcription",
                description:
                  "Convert your meeting recordings into text with speaker detection in 50+ languages",
              },
              {
                icon: "💡",
                title: "Smart Summaries",
                description:
                  "Get instant meeting summaries, action items, and key decisions",
              },
              {
                icon: "🔄",
                title: "Team Collaboration",
                description:
                  "Share and collaborate on meeting notes in real-time",
              },
              {
                icon: "🔍",
                title: "Smart Search",
                description:
                  "Find any moment across all your meeting recordings",
              },
              {
                icon: "🔗",
                title: "Seamless Integration",
                description:
                  "Works with your favorite tools like Slack, Notion, and more",
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description:
                  "SOC2 and GDPR compliant for complete peace of mind",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative group p-8 rounded-2xl bg-white dark:bg-gray-800 
                         hover:shadow-xl dark:shadow-gray-900/50
                         transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using Memoria AI to make their
              meetings more productive.
            </p>
            <button
              onClick={handleSignIn}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium
                       hover:bg-gray-100 transition-all duration-300
                       hover:shadow-xl hover:shadow-blue-500/20"
            >
              Get Started Free
            </button>
            <p className="mt-4 opacity-80">No credit card required</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
