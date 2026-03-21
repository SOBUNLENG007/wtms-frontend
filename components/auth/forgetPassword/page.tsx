"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // await fetch("http://localhost:8080/api/v1/auth/forgot-password", ...)
    await new Promise((r) => setTimeout(r, 800));

    if (!email) {
      setError("Please enter your email address.");
    } else {
      setMessage("If an account exists for this email, you will receive password recovery instructions.");
      setEmail("");  
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-[500px] rounded-[32px] bg-white border border-slate-100 p-10 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      <div className="mb-8 text-left">
        <h2 className="text-[28px] font-bold tracking-tight text-slate-900">
          Forgot your password?
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Success State */}
        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {/* EMAIL INPUT */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-500 font-normal">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-300" />
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[52px] rounded-xl border-slate-200 text-slate-700 placeholder:text-slate-300 pl-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="mt-2 h-13 cursor-pointer w-full rounded-xl bg-[#3b82f6] text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending...
            </span>
          ) : (
            "Recover Password"
          )}
        </Button>

        {/* BACK TO LOGIN LINK */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[14px] font-medium text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}