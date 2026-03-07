"use client";

import { useEffect, useState } from "react";
import { getAllUsers, getAllShipments } from "@/services/admin-service";
import { User, Shipment, Role, Plan } from "@/types";
import { Users, Ship, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic client-side guard, though proxy/layout should strictly handle this in a real app
    if (user && user.role !== Role.ADMIN) {
      redirect("/dashboard");
    }

    async function fetchData() {
      try {
        const [usersData, shipmentsData] = await Promise.all([
          getAllUsers(),
          getAllShipments(),
        ]);
        setUsers(usersData);
        setShipments(shipmentsData);
      } catch (err) {
        console.error("Admin fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user?.role === Role.ADMIN) {
      fetchData();
    }
  }, [user]);

  if (isLoading) return <SkeletonLoader rows={8} />;

  const proUsers = users.filter((u) => u.plan === Plan.PRO).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Administration
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Global view of all users and platform activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
           <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</h3>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
           <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pro Subscriptions</h3>
             <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{proUsers}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
           <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Global Shipments</h3>
            <Ship className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{shipments.length}</p>
        </div>

         <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
           <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</h3>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-4 text-xl font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Registered Brokers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
               <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Joined</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{u.firstname} {u.lastname}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                       u.role === Role.ADMIN ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                     }`}>
                       {u.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                       u.plan === Plan.PRO ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                     }`}>
                       {u.plan}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     Active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
