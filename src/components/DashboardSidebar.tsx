"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
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
      title: "Smart Search",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      href: "/SmartSearch",
    },
    {
      title: "All Recordings",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", // Folder icon path
      href: "/meetings",
    },
    {
      title: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/pricing",
    },
  ];

  const isSelected = (href: string) => {
    if (!pathname) return false;
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-48"
      } h-screen fixed left-0 top-0 bg-[#f8f9fa] dark:bg-gray-900 border-r border-gray-200/10 dark:border-gray-800 flex flex-col transition-[width] duration-300 text-[14px] font-[-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira_Sans,Droid_Sans,Helvetica_Neue,sans-serif] overflow-visible`}
      style={
        {
          "--sidebar-width": isCollapsed ? "4rem" : "12rem",
        } as React.CSSProperties
      }
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[22px] w-6 h-6 bg-[#f8f9fa] dark:bg-gray-900 border border-gray-200/20 dark:border-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-[100]"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-200/10 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Image
              src="/Icon.png"
              alt="Memoria AI Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <span
            className={`font-semibold text-[15px] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Memoria AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-1.5 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const selected = isSelected(item.href);
            return (
              <button
                key={item.title}
                onClick={() => router.push(item.href)}
                className={`flex items-center w-full p-2 rounded-lg group transition-all duration-200 overflow-hidden ${
                  selected
                    ? "bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                title={isCollapsed ? item.title : ""}
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      selected
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={selected ? 2 : 1.5}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <span
                  className={`ml-2 font-medium whitespace-nowrap transition-all duration-300 ${
                    selected
                      ? "text-purple-700 dark:text-purple-300"
                      : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  } ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
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
