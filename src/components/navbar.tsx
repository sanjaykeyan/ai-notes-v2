"use client";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  const AuthenticatedContent = () => {
    const [proStatus, setProStatus] = useState({ isPro: false, proUntil: null });

    useEffect(() => {
      const fetchProStatus = async () => {
        try {
          const response = await fetch('/api/user/pro-status');
          const data = await response.json();
          if (response.ok) {
            setProStatus(data);
          }
        } catch (error) {
          console.error('Failed to fetch pro status:', error);
        }
      };

      if (isLoaded && isSignedIn) {
        fetchProStatus();
      }
    }, [isLoaded, isSignedIn]);

    return (
      <>
        <div className="hidden md:flex items-center gap-6">
          {/* Pro status badge */}
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs rounded-full ${
              proStatus.isPro 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {proStatus.isPro ? 'PRO' : 'FREE'}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-4 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <nav className="flex items-center gap-6">
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => router.push("/meetings")}
            >
              Meetings
            </button>
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => router.push("/pricing")}
            >
              Pricing
            </button>
          </nav>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
        </div>
        <div className="md:hidden flex items-center gap-4">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {createPortal(
          <div
            className={`fixed inset-0 bg-black/50 z-[999] md:hidden transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleMobileMenu}
          >
            <div
              className={`fixed right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <button
                  onClick={toggleMobileMenu}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="pt-8 mb-8">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-200"
                  />
                </div>
                <nav className="flex flex-col gap-4">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/meetings")}
                  >
                    Meetings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/pricing")}
                  >
                    Pricing
                  </button>
                </nav>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/Icon.png"
            alt="Memoria AI Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain"
            priority
          />
          <span className="hidden md:inline font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Memoria AI
          </span>
        </button>
        <SignedIn>
          <AuthenticatedContent />
        </SignedIn>
        <SignedOut>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-gray-600 hover:text-gray-900">
              About
            </button>
            <button className="hidden md:block text-gray-600 hover:text-gray-900">
              Pricing
            </button>
            <Link
              href="/auth/sign-in"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
