"use client";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

const PricingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"free" | "individual" | "pro">(
    "free"
  );

  const handleProPayment = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 1900 * 100,
        currency: "INR",
        name: "AI Notes Pro",
        description: "Pro Plan Subscription",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment and update user status
            const verificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verificationResponse.ok) {
              const errorData = await verificationResponse.json();
              console.error("Payment verification failed:", errorData);
              throw new Error(errorData.error || "Payment verification failed");
            }

            const verificationResult = await verificationResponse.json();
            if (verificationResult.success) {
              console.log("Payment successful", verificationResult);
              router.push("/dashboard");
            } else {
              console.error("Payment verification failed:", verificationResult);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
          }
        },
        prefill: {
          email: "",
        },
        // Simplified payment methods configuration
        config: {
          display: {
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  interface PricingCardProps {
    type: "free" | "individual" | "pro";
    title: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    buttonAction: () => void;
    special?: boolean;
  }

  const PricingCard = ({
    type,
    title,
    price,
    period,
    features,
    buttonText,
    buttonAction,
    special = false,
  }: PricingCardProps) => (
    <div
      className={`relative ${
        special
          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
          : "bg-white dark:bg-gray-800 dark:text-gray-100"
      } border-2 dark:border-gray-700 rounded-2xl md:p-8 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Show badge only on desktop */}
      <div
        className={`absolute -top-4 left-6 md:block hidden ${
          special
            ? "bg-blue-500 text-white"
            : type === "free"
            ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
        } 
        px-4 py-1 rounded-full text-sm font-medium`}
      >
        {type === "free"
          ? "Starter"
          : type === "individual"
          ? "Individual"
          : "Most Popular"}
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 mt-2">
        {title}
      </h2>
      <p className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
        {price}
        <span
          className={`${
            special ? "text-blue-100" : "text-gray-500"
          } text-base md:text-lg font-normal`}
        >
          {period}
        </span>
      </p>
      <div
        className={`h-px w-full bg-gradient-to-r from-transparent ${
          special ? "via-white/20" : "via-gray-200 dark:via-gray-700"
        } to-transparent mb-4 md:mb-6`}
      ></div>
      <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className={`w-4 h-4 md:w-5 md:h-5 ${
                special ? "text-white" : "text-blue-500 dark:text-blue-400"
              } mr-2 md:mr-3 flex-shrink-0`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm md:text-base">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={buttonAction}
        className={`w-full py-2.5 md:py-3 px-4 ${
          special
            ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        } rounded-xl transition-colors font-medium text-sm md:text-base`}
      >
        {buttonText}
      </button>
    </div>
  );

  const TabSelector = () => (
    <div className="flex divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
      {["free", "individual", "pro"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "free" | "individual" | "pro")}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-all relative
            ${
              activeTab === tab
                ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }
          `}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </button>
      ))}
    </div>
  );

  const pricingData: Record<"free" | "individual" | "pro", PricingCardProps> = {
    free: {
      type: "free",
      title: "Free",
      price: "$0",
      period: "/month",
      features: [
        "5 meetings per month",
        "Basic AI summarization",
        "1GB storage",
      ],
      buttonText: "Get Started",
      buttonAction: () => router.push("/dashboard"),
    },
    individual: {
      type: "individual",
      title: "Pay Per Meeting",
      price: "$1",
      period: "/meeting",
      features: ["Full Pro features", "Pay as you go", "No subscription"],
      buttonText: "Try Now",
      buttonAction: () => {},
    },
    pro: {
      type: "pro",
      title: "Pro",
      price: "$19",
      period: "/month",
      features: [
        "Unlimited meetings",
        "Advanced AI features",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
      buttonAction: handleProPayment,
      special: true,
    },
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900">
        <DashboardSidebar />

        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ marginLeft: "calc(var(--sidebar-width) - 10px)" }}
        >
          <DashboardTopbar />

          <div className="flex-1 p-1 pl-0 overflow-hidden">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-y-auto elegant-scrollbar">
              <div className="p-8">
                <div className="text-center mb-8 md:mb-12">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Choose Your Plan
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                    From startups to enterprise companies, find the perfect plan
                    for your team
                  </p>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="max-w-sm mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 dark:border-gray-700">
                      <TabSelector />
                      <div className="p-6">
                        <p className="text-3xl font-bold mb-4">
                          {pricingData[activeTab].price}
                          <span className="text-gray-500 text-base font-normal">
                            {pricingData[activeTab].period}
                          </span>
                        </p>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
                        <ul className="space-y-3 mb-6">
                          {pricingData[activeTab].features.map(
                            (feature, index) => (
                              <li key={index} className="flex items-center">
                                <svg
                                  className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {feature}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                        <button
                          onClick={pricingData[activeTab].buttonAction}
                          className={`w-full py-2.5 px-4 ${
                            activeTab === "pro"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                          } rounded-xl transition-all font-medium text-sm`}
                        >
                          {pricingData[activeTab].buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {Object.values(pricingData).map((plan) => (
                    <PricingCard key={plan.type} {...plan} />
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm md:text-base">
                    All plans include:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-3xl mx-auto">
                    {[
                      "SSL security",
                      "API access",
                      "24/7 support",
                      "Regular updates",
                    ].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-white dark:bg-gray-800 rounded-full 
                                     text-xs md:text-sm text-gray-600 dark:text-gray-400 shadow-sm 
                                     border border-gray-100 dark:border-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
