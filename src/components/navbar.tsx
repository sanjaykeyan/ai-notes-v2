"use client";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const AuthenticatedContent = () => {
    useEffect(() => {
      if (isLoaded && isSignedIn && user) {
        console.log("Current user:", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress,
        });
      }
    }, [isLoaded, isSignedIn]);

    return (
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 rounded-lg bg-gray-100 focus:bg-white border border-transparent
                       focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            Meetings
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            Teams
          </button>
        </nav>

        {/* Notification Bell */}
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
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    );
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MeetingNotes AI
          </span>
        </div>

        <SignedIn>
          <AuthenticatedContent />
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">About</button>
            <button className="text-gray-600 hover:text-gray-900">
              Pricing
            </button>
            <Link
              href="/auth/sign-in"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                         transition-all duration-200 hover:shadow-lg"
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
