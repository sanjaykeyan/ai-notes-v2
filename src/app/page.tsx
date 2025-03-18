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
                Actionable Insights
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

      {/* How Memoria AI Works - Professional Flowchart Design */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Memoria AI Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our streamlined process turns meeting recordings into actionable
              insights
            </p>
          </div>

          {/* Professional Flowchart */}
          <div className="relative max-w-5xl mx-auto">
            {/* Desktop Connection Line */}
            <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-purple-500 z-0"></div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-16 lg:gap-x-6 relative">
              {[
                {
                  step: "01",
                  title: "Upload Recording",
                  description:
                    "Upload your audio or connect directly from Zoom, Teams, or other platforms",
                  icon: (
                    <svg
                      className="w-8 h-8 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M7 16.5V14.5M7 14.5V8.5C7 6.29086 8.79086 4.5 11 4.5H13C15.2091 4.5 17 6.29086 17 8.5V14.5M7 14.5H17M17 14.5V16.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 14.5V19.5M12 19.5L14 17.5M12 19.5L10 17.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Transcribe Audio",
                  description:
                    "Our AI converts speech to text with speaker identification and timestamps",
                  icon: (
                    <svg
                      className="w-8 h-8 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M7 7.5V6.5C7 5.11929 8.11929 4 9.5 4H14.5C15.8807 4 17 5.11929 17 6.5V7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.5 11H16.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7.5 14H16.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7.5 17H13.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  arrowPosition: "after",
                },
                {
                  step: "03",
                  title: "Generate Insights",
                  description:
                    "AI analyzes the transcript to identify key points, actions, and decisions",
                  icon: (
                    <svg
                      className="w-8 h-8 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9.5 14.5L11.5 16.5L14.5 12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3L13.6 4.5H17C17.5523 4.5 18 4.94772 18 5.5V8.2L19.5 10L18 11.8V14.5C18 15.0523 17.5523 15.5 17 15.5H13.6L12 17L10.4 15.5H7C6.44772 15.5 6 15.0523 6 14.5V11.8L4.5 10L6 8.2V5.5C6 4.94772 6.44772 4.5 7 4.5H10.4L12 3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17V21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M15 19H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
                {
                  step: "04",
                  title: "Share & Collaborate",
                  description:
                    "Access, share and collaborate on the insights with your team",
                  icon: (
                    <svg
                      className="w-8 h-8 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M13.5 10.5H16.5C17.6046 10.5 18.5 9.60457 18.5 8.5V5.5C18.5 4.39543 17.6046 3.5 16.5 3.5H13.5C12.3954 3.5 11.5 4.39543 11.5 5.5V8.5C11.5 9.60457 12.3954 10.5 13.5 10.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5.5 17.5H8.5C9.60457 17.5 10.5 16.6046 10.5 15.5V12.5C10.5 11.3954 9.60457 10.5 8.5 10.5H5.5C4.39543 10.5 3.5 11.3954 3.5 12.5V15.5C3.5 16.6046 4.39543 17.5 5.5 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13.5 20.5H16.5C17.6046 20.5 18.5 19.6046 18.5 18.5V15.5C18.5 14.3954 17.6046 13.5 16.5 13.5H13.5C12.3954 13.5 11.5 14.3954 11.5 15.5V18.5C11.5 19.6046 12.3954 20.5 13.5 20.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10.5 15.5H11.5M18.5 8.5V9.5C18.5 10.0523 18.0523 10.5 17.5 10.5H16.5M6.5 10.5H5.5C4.94772 10.5 4.5 10.9477 4.5 11.5V12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Step Card */}
                  <div className="w-full">
                    <div className="relative group">
                      {/* Connection dots for desktop */}
                      {index > 0 && (
                        <div className="hidden lg:block absolute top-12 -left-3 w-6 h-6">
                          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 scale-75 group-hover:scale-100 transition-all duration-300"></div>
                          <div className="absolute inset-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                      {index < 3 && (
                        <div className="hidden lg:block absolute top-12 -right-3 w-6 h-6">
                          <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 scale-75 group-hover:scale-100 transition-all duration-300"></div>
                          <div className="absolute inset-1.5 bg-purple-500 rounded-full"></div>
                        </div>
                      )}

                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform group-hover:-translate-y-1 transition-all duration-300">
                        <div className="mb-6 relative">
                          <span className="absolute top-0 right-0 text-xl font-bold text-blue-100 dark:text-blue-900">
                            {item.step}
                          </span>
                          <div className="w-16 h-16 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Mobile arrow indicator */}
                    {index < 3 && (
                      <div className="flex justify-center lg:hidden my-6">
                        <svg
                          className="w-6 h-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Result Showcase */}
            <div className="mt-20 pt-10 relative">
              <div className="hidden lg:block absolute top-0 left-1/2 w-0.5 h-10 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-2xl shadow-xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                  <div className="flex items-center mb-6 gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 3.5V2M15 3.5V2M9 21.5V20M15 21.5V20M20 9H22M20 14H22M2 9H4M2 14H4M6.2 18.3L4.8 19.7M6.2 5.7L4.8 4.3M17.8 18.3L19.2 19.7M17.8 5.7L19.2 4.3M12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        The Result: Complete Meeting Intelligence
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Everything you need from your meetings, organized and
                        ready to use
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Smart Transcript",
                        icon: "📝",
                        description:
                          "Searchable conversations with speaker labels",
                      },
                      {
                        label: "AI Summary",
                        icon: "📊",
                        description: "Concise overview of key topics discussed",
                      },
                      {
                        label: "Action Items",
                        icon: "✅",
                        description: "Tasks captured and ready for assignment",
                      },
                      {
                        label: "Key Decisions",
                        icon: "🔑",
                        description: "Important choices documented clearly",
                      },
                      {
                        label: "Topic Timeline",
                        icon: "🕒",
                        description: "Jump to any moment by topic",
                      },
                      {
                        label: "Collaborative Notes",
                        icon: "👥",
                        description: "Team annotations and comments",
                      },
                    ].map((result, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{result.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {result.label}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={handleSignIn}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      Experience the Difference
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
