"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Sparkles,
  BellRing,
  UserCheck2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  User,
  Sliders,
  Calendar,
  PoundSterling,
  Building,
  CheckCircle2,
} from "lucide-react";
import Card from "./Card";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    budgetFrom: "",
    budgetTo: "",
    occupants: 1,
    roomType: "Any",
    needFromDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        toast.success(
          data.message || "Registration successful. Please verify your email."
        );
        setFormData({
          title: "Mr",
          firstName: "",
          surname: "",
          email: "",
          phone: "",
          password: "",
          budgetFrom: "",
          budgetTo: "",
          occupants: 1,
          roomType: "Any",
          needFromDate: "",
          notes: "",
        });
        router.push("/login");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#F47C3C]" />,
      title: "Personalised Matches",
      desc: "Rooms tailored precisely to your budget and preferred locations.",
    },
    {
      icon: <BellRing className="w-5 h-5 text-[#F47C3C]" />,
      title: "Instant Alerts",
      desc: "Get notified immediately as soon as verified listings match your search.",
    },
    {
      icon: <UserCheck2 className="w-5 h-5 text-[#F47C3C]" />,
      title: "Dedicated Letting Specialist",
      desc: "Personal assistance from start to key handover.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#F47C3C]" />,
      title: "Zero Tenant Fees",
      desc: "Free registration with complete price transparency.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row font-sans">
      
      {/* LEFT SECTION - Brand Hero Panel */}
      <div className="w-full lg:w-1/2 bg-[#0F253B] p-8 md:p-14 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between">
        
        {/* Glow Visual Element */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F47C3C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F47C3C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto w-full relative z-10 space-y-10">
          
          {/* Header Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F47C3C]/20 border border-[#F47C3C]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F47C3C] tracking-wide uppercase">
              <CheckCircle2 className="w-4 h-4" />
              Verified London Lettings
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Find Your <span className="text-[#F47C3C] underline decoration-wavy decoration-[#F47C3C]/40 underline-offset-8">Ideal Room</span> in London
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Register your requirements once. Our team matches you with off-market and newly listed properties ahead of public release.
            </p>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm space-y-2 hover:border-[#F47C3C]/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0F253B] border border-[#F47C3C]/30 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-white">{item.title}</h3>
                <p className="text-[#FFFFFF99] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Featured Cards Sub-block */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-[#F47C3C] uppercase">
                Featured Live Properties
              </span>
              <span className="text-xs text-gray-400">Updated Today</span>
            </div>
            <Card />
          </div>

        </div>

        {/* Footer Support Callout */}
        <div className="pt-8 text-center lg:text-left text-xs text-gray-400 border-t border-white/10 mt-8 relative z-10">
          Need assistance? Speak with an advisor at{" "}
          <a href="wa.me/+447950309760" className="text-[#F47C3C] font-bold underline">
            +447950309760
          </a>
        </div>
      </div>

      {/* RIGHT SECTION - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="bg-white border border-[#E8E4DF] w-full max-w-2xl rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="border-b border-[#E8E4DF] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F253B]">
              Tenant Registration
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Fields marked with an asterisk (<span className="text-red-500">*</span>) are mandatory.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F253B] text-xs font-bold uppercase tracking-wider">
                <User className="w-4 h-4 text-[#F47C3C]" />
                Personal Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    Title
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm font-medium text-[#0F253B]"
                  >
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Ms</option>
                    <option>Dr</option>
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+44 7123 456789"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Security */}
            <div className="space-y-4 pt-2 border-t border-[#E8E4DF]">
              <div className="flex items-center gap-2 text-[#0F253B] text-xs font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4 text-[#F47C3C]" />
                Account Security
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                  required
                />
              </div>
            </div>

            {/* Section 3: Accommodation Requirements */}
            <div className="space-y-4 pt-2 border-t border-[#E8E4DF]">
              <div className="flex items-center gap-2 text-[#0F253B] text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-[#F47C3C]" />
                Room Requirements & Budget
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase flex items-center gap-1">
                    <PoundSterling className="w-3 h-3 text-[#F47C3C]" /> Budget From (£/pcm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 600"
                    name="budgetFrom"
                    min={0}
                    value={formData.budgetFrom}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase flex items-center gap-1">
                    <PoundSterling className="w-3 h-3 text-[#F47C3C]" /> Budget To (£/pcm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    name="budgetTo"
                    min={0}
                    value={formData.budgetTo}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                    Number of Occupants <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="occupants"
                    value={formData.occupants}
                    min={1}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#F47C3C]" /> Room Type Preference
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                  >
                    <option>Any</option>
                    <option>Studio</option>
                    <option>Single Room</option>
                    <option>Double Room</option>
                    <option>Ensuite Room</option>
                    <option>1 Bedroom Flat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#F47C3C]" /> Desired Move-in Date
                </label>
                <input
                  type="date"
                  name="needFromDate"
                  value={formData.needFromDate}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase">
                  Additional Notes / Preferences
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Mention preferred locations (e.g. Camden, Greenwich), parking requirements, or special requests..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-[#F47C3C]/30 focus:border-[#F47C3C] text-xs sm:text-sm text-[#0F253B] resize-none"
                />
              </div>
            </div>

            {/* Submission Action */}
            <div className="space-y-4 pt-4 border-t border-[#E8E4DF]">
              <p className="text-[11px] text-[#6B7280] text-center leading-relaxed">
                By submitting this form, you agree to our{" "}
                <Link href="/privacy-policy" className="text-[#F47C3C] font-semibold underline">
                  Privacy Statement
                </Link>
                . We respect your data privacy and will never share your information.
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#F47C3C] hover:bg-[#e06829] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#F47C3C]/20 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  loading ? "cursor-not-allowed opacity-80" : "group"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </div>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-[#6B7280]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#F47C3C] font-bold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;