"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut, Bell, Mail } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const { data: session } = useSession();

  const user = session?.user;

//   useEffect(() => {console.log('uuu', user)}, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !dropdownRef?.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: any) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100/10 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user?.name?.[0] ?? "U"}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">
            {user?.name ?? "User"}
          </div>
          <div className="text-xs text-gray-500">
            {user?.email ?? "no-email@example.com"}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <div className="py-1">
            <button
              onClick={() => console.log("Profile clicked")}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={() => console.log("Settings clicked")}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Subscriptions
            </button>
            <button
              onClick={() => console.log("Settings clicked")}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Bookings
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => signOut()}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
