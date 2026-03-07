"use client";

import { LogOut, Bell, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle (visible only on small screens) */}
        <button className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white lg:hidden">
          PortKey
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications mock */}
        <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-4 border-l border-slate-200 pl-6 dark:border-slate-800">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {user ? `${user.firstname} ${user.lastname}` : "Loading..."}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${
                user?.role === Role.ADMIN 
                  ? "text-purple-600 dark:text-purple-400" 
                  : "text-slate-500 dark:text-slate-400"
              }`}>
                {user?.role === Role.ADMIN ? "Administrator" : "Broker"}
              </span>
            </div>
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {user ? user.firstname.charAt(0) : "?"}
          </div>

          <button
            onClick={logout}
            className="ml-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
