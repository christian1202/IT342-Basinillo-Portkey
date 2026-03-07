"use client";

import { useState } from "react";
import Link from "next/link";
import { Anchor, ShieldAlert, Mail, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Splash Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex relative overflow-hidden">
        {/* Subtle mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <Anchor className="h-8 w-8 text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight">PortKey</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Intelligent Customs Clearance
          </h1>
          <p className="text-lg text-slate-300">
            Track cargo lifecycles, monitor a real-time demurrage countdown, and prevent costly port penalties from a centralized dashboard.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Basinillo — System Integration and Architecture
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full items-center justify-center bg-white dark:bg-slate-950 lg:w-1/2 px-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-10 flex items-center justify-center gap-2 lg:hidden">
            <Anchor className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              PortKey
            </span>
          </div>

          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Sign in to your broker account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="broker@portkey.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-2">
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
            >
              Sign up as a Broker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
