"use client";

import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";

const DashboardSidebar = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [proStatus, setProStatus] = useState({
    isPro: false,
    proUntil: null,
  });

  useEffect(() => {
    const fetchProStatus = async () => {
      try {
        const response = await fetch("/api/user/pro-status");
        const data = await response.json();
        if (response.ok) {
          setProStatus(data);
        }
      } catch (error) {
        console.error("Failed to fetch pro status:", error);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchProStatus();
    }
  }, [isLoaded, isSignedIn]);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      href: "/dashboard",
    },
    {
      title: "In-Person Meetings",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      href: "/meetings",
    },
    {
      title: "Online Meetings",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      href: "/online-meets",
    },
    {
      title: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      href: "/settings",
    },
    {
      title: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/pricing",
    },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } h-screen fixed left-0 top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 text-[14px] font-[-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira_Sans,Droid_Sans,Helvetica_Neue,sans-serif]`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Image
            src="/Icon.png"
            alt="Memoria AI Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span
            className={`font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            Memoria AI
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div
        className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-10 h-10" } }}
          />
          <div
            className={`flex-1 min-w-0 transition-opacity duration-300 ${
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.emailAddresses[0].emailAddress}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              proStatus.isPro
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {proStatus.isPro ? "PRO" : "FREE"}
          </span>
          {!proStatus.isPro && (
            <button
              onClick={() => router.push("/pricing")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
              className="flex items-center gap-3 w-full p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl group transition-colors"
              title={isCollapsed ? item.title : ""}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={item.icon}
                />
              </svg>
              <span
                className={`font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0 hidden" : "opacity-100"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            )}
          </button>
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            v2.0.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
