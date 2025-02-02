"use client";
import { useRouter } from "next/navigation";
import Script from "next/script";

const PricingPage = () => {
  const router = useRouter();

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
              show_default_blocks: true
            }
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="pt-16 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              From startups to enterprise companies, find the perfect plan for your team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="relative bg-white border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 left-6 bg-gray-100 px-4 py-1 rounded-full text-sm font-medium text-gray-600">
                Starter
              </div>
              <h2 className="text-2xl font-bold mb-4 mt-2">Free</h2>
              <p className="text-4xl font-bold mb-6">
                $0
                <span className="text-gray-500 text-lg font-normal">/month</span>
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">5 meetings per month</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Basic AI summarization</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">1GB storage</span>
                </li>
              </ul>
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Individual Plan */}
            <div className="relative bg-white border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 left-6 bg-purple-100 px-4 py-1 rounded-full text-sm font-medium text-purple-600">
                Individual
              </div>
              <h2 className="text-2xl font-bold mb-4 mt-2">Pay Per Meeting</h2>
              <p className="text-4xl font-bold mb-6">
                $1
                <span className="text-gray-500 text-lg font-normal">/meeting</span>
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Full Pro features</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Pay as you go</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">No subscription</span>
                </li>
              </ul>
              <button className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium">
                Try Now
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
              <div className="absolute -top-4 left-6 bg-blue-500 px-4 py-1 rounded-full text-sm font-medium text-white">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold mb-4 mt-2">Pro</h2>
              <p className="text-4xl font-bold mb-6">
                $19
                <span className="text-blue-100 text-lg font-normal">/month</span>
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited meetings</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <button 
                onClick={handleProPayment}
                className="w-full py-3 px-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium shadow-lg"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
              {['SSL security', 'API access', '24/7 support', 'Regular updates'].map((feature) => (
                <span key={feature} className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
