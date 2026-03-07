"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ship, 
  BarChart3, 
  Settings, 
  Users,
  Anchor
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/shipments", icon: Ship, label: "Shipments" },
  { href: "/dashboard/analysis", icon: BarChart3, label: "Analysis" },
  { href: "/dashboard/admin", icon: Users, label: "User Management", adminOnly: true },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === Role.ADMIN
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 lg:static">
      <div className="mb-10 flex items-center gap-3 px-2">
        <Anchor className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          PortKey
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Spacer pushing footer down */}
      <div className="flex-1" />
      
      <div className="mt-8 rounded-xl bg-slate-50 px-4 py-5 dark:bg-slate-900">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
          Plan Status
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {user?.plan || "FREE"}
          </span>
          {user?.plan !== "PRO" && (
            <button className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
              Upgrade
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
