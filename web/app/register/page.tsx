"use client";

import { useState } from "react";
import Link from "next/link";
import { Anchor, ShieldAlert, Mail, Lock, User as UserIcon } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await register({ email, password, firstname, lastname });
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Splash Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <Anchor className="h-8 w-8 text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight">PortKey</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            Join the Logistics Network
          </h1>
          <p className="text-lg text-slate-300">
            Create your broker account to manage global shipments, simplify tracking, and secure your supply chain data.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Basinillo — System Integration and Architecture
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full items-center justify-center bg-white dark:bg-slate-950 lg:w-1/2 px-8 py-12">
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
              Create an account
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Enter your details to register as a customs broker
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={UserIcon}
                placeholder="Juan"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                icon={UserIcon}
                placeholder="Dela Cruz"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="broker@portkey.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" isLoading={isLoading} className="mt-4">
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
