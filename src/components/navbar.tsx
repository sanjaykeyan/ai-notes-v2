"use client";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useNotifications } from '@/contexts/NotificationContext';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  const getMobilePageTitle = (path: string) => {
    if (path.includes("/meetings")) return "Meetings";
    if (path.includes("/pricing")) return "Pricing";
    if (path.includes("/settings")) return "Settings";
    return "Home";
  };

  const AuthenticatedContent = () => {
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

    return (
      <>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Pro status badge */}
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                proStatus.isPro
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {proStatus.isPro ? "PRO" : "FREE"}
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
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[480px] overflow-y-auto z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => {
                          notifications.forEach(n => deleteNotification(n.id));
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors relative group ${
                            notification.read ? 'bg-white' : 'bg-blue-50/40'
                          }`}
                        >
                          <div onClick={() => markAsRead(notification.id)} className="cursor-pointer pr-8">
                            <p className="text-sm text-gray-800 leading-snug">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              {!notification.read && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                  New
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Delete notification"
                          >
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        <p className="mt-4 text-sm text-gray-500">No notifications</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between w-full">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
          <span className="text-gray-600 font-medium text-center flex-1">
            {getMobilePageTitle(pathname)}
          </span>
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

        {/* Mobile Menu Portal */}
        {createPortal(
          <div
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] md:hidden
              transition-all duration-500 ease-in-out
              ${
                isMobileMenuOpen
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            onClick={toggleMobileMenu}
          >
            <div
              className={`fixed right-0 top-0 h-full w-72 bg-white shadow-2xl
                transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100 rotate-0"
                    : "translate-x-[110%] opacity-60 rotate-1"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content slides in with a slight delay */}
              <div
                className={`h-full transition-all duration-500 delay-100
                ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              >
                {/* User Profile Section */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <button
                    onClick={toggleMobileMenu}
                    className="absolute top-5 right-5 p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                  <div className="flex items-center gap-4 mb-4">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{ elements: { avatarBox: "w-12 h-12" } }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user?.firstName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.emailAddresses[0].emailAddress}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        proStatus.isPro
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {proStatus.isPro ? "PRO" : "FREE"}
                    </span>
                    {!proStatus.isPro && (
                      <button
                        onClick={() => router.push("/pricing")}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search meetings..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                  {[
                    {
                      title: "Dashboard",
                      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                      href: "/dashboard",
                    },
                    {
                      title: "Meetings",
                      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                      href: "/meetings",
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
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        router.push(item.href);
                        toggleMobileMenu();
                      }}
                      className="flex items-center gap-3 w-full p-3 text-gray-700 hover:bg-gray-50 rounded-xl group transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
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
                      <span className="font-medium group-hover:text-blue-600">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>v2.0.0</span>
                    <button
                      onClick={() => router.push("/help")}
                      className="hover:text-gray-900"
                    >
                      Help & Support
                    </button>
                  </div>
                </div>
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
        {/* Logo - Hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image
            src="/Icon.png"
            alt="Memoria AI Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain"
            priority
          />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Memoria AI
          </span>
        </div>

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
