"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  Wrench,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Award,
  Loader2,
  LockKeyhole,
} from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            rememberMe,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row font-sans">
      
      {/* LEFT SIDE: Brand Hero Panel */}
      <div className="w-full lg:w-[48%] bg-[#0A192F] p-8 md:p-14 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between">
        
        {/* Glow Visual Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F9A370]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F9A370]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto w-full relative z-10 space-y-10">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F9A370]/20 border border-[#F9A370]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F9A370] tracking-wide uppercase">
              <CheckCircle2 className="w-4 h-4" />
              Verified London Portal
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Find your perfect <br />
              <span className="text-[#F9A370] underline decoration-wavy decoration-[#F9A370]/40 underline-offset-8">
                London home
              </span>{" "}
              with us
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Join over 4,000 tenants who trust LONDONROOMSRENT to find quality, fully-managed 
              accommodation across London — with all bills included.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-white">
                4,<span className="text-[#F9A370]">150</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Happy Tenants</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-[#F9A370]">332</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Properties Managed</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-white">
                <span className="text-[#F9A370]">16</span>+
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">London Boroughs</div>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            <FeatureItem
              icon={<CreditCard className="w-5 h-5 text-[#F9A370]" />}
              title="Pay rent online, anytime"
              desc="Secure card payments and direct debit — all from your dashboard"
            />
            <FeatureItem
              icon={<Wrench className="w-5 h-5 text-[#F9A370]" />}
              title="Report repairs in seconds"
              desc="24/7 maintenance reporting powered by Fixflo with real-time updates"
            />
            <FeatureItem
              icon={<FileText className="w-5 h-5 text-[#F9A370]" />}
              title="All documents in one place"
              desc="Your tenancy agreement, gas certificate and EPC — always accessible"
            />
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-4">
            <p className="italic text-gray-300 text-xs sm:text-sm leading-relaxed">
              "LONDONROOMSRENT made moving to London so easy. I found my room in Shoreditch within a week, 
              signed everything online, and the whole team was incredibly helpful."
            </p>
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden ring-2 ring-[#F9A370]/50">
                  <img
                    src="https://i.pravatar.cc/150?u=james"
                    alt="James Carter"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">James Carter</div>
                  <div className="text-[10px] text-gray-400">Tenant since 2024 · West Hampstead</div>
                </div>
              </div>
              <div className="flex text-[#F9A370] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Accreditations Footer */}
        <div className="pt-8 border-t border-white/10 mt-8 relative z-10 flex flex-wrap gap-2">
          <Badge text="Client Money Protection" />
          <Badge text="My Deposits" />
          <Badge text="PRS Member" />
        </div>
      </div>

      {/* RIGHT SIDE: Login Form Panel */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="bg-white border border-[#E8E4DF] w-full max-w-md rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
          
          {/* Header Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Sign in to access your tenant portal, manage your room, and book viewings.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 pl-10 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] text-xs sm:text-sm text-[#0A192F] transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 pl-10 pr-10 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] text-xs sm:text-sm text-[#0A192F] transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#F9A370] focus:ring-[#F9A370] w-4 h-4"
                />
                Remember me (30 days)
              </label>
              <Link
                href="/forget-password"
                className="text-[#F9A370] font-bold hover:underline text-xs"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#F9A370] hover:bg-[#e38d5b] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#F9A370]/20 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 ${
                loading ? "cursor-not-allowed opacity-80" : "group"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Error Feedback */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}
          </form>

          {/* Registration Redirect */}
          <div className="text-center text-xs sm:text-sm text-gray-500 pt-2 border-t border-[#E8E4DF]">
            Don't have an account?{" "}
            <Link
              href="/register-with-us"
              className="text-[#F9A370] font-bold hover:underline inline-flex items-center gap-1"
            >
              Register for free <ArrowRight size={14} />
            </Link>
          </div>

          {/* Trust Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <TrustTile icon={<LockKeyhole className="w-3.5 h-3.5 text-gray-400" />} label="SSL SECURED" />
            <TrustTile icon={<ShieldCheck className="w-3.5 h-3.5 text-gray-400" />} label="GDPR COMPLIANT" />
            <TrustTile icon={<Star className="w-3.5 h-3.5 text-gray-400" />} label="TRUSTPILOT 4.9" />
            <TrustTile icon={<Award className="w-3.5 h-3.5 text-gray-400" />} label="AWARD WINNING" />
          </div>

        </div>
      </div>

    </div>
  );
}

// Sub-components
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm">
      <div className="w-9 h-9 rounded-xl bg-[#0A192F] border border-[#F9A370]/30 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-xs sm:text-sm text-white">{title}</h3>
        <p className="text-[11px] text-gray-300 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Badge({ text }) {
  return (
    <div className="border border-white/20 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 bg-white/5 text-gray-300 font-medium">
      <CheckCircle2 className="w-3 h-3 text-[#F9A370]" />
      <span>{text}</span>
    </div>
  );
}

function TrustTile({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-center">
      {icon}
      <span className="text-[9px] font-bold text-gray-500 mt-1.5 tracking-wider">
        {label}
      </span>
    </div>
  );
}