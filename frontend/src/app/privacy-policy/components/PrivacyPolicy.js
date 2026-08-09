"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Home,
  PoundSterling,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect or trigger search filter logic
    console.log("Searching for:", { location, roomType, maxPrice });
  };

  return (
    <section className="relative bg-[#0A192F] text-white pt-12 pb-20 md:pt-20 md:pb-32 px-5 md:px-12 overflow-hidden font-sans">
      
      {/* BACKGROUND ACCENT GLOWS */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#F9A370]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#F9A370]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Main Headline & Search Bar */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Verified Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-[#F9A370] backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-[#F9A370]" />
              <span>London's #1 Verified Room Rental Portal</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Find your perfect <br />
              <span className="text-[#F9A370] underline decoration-wavy decoration-[#F9A370]/40 underline-offset-8">
                London room
              </span>{" "}
              with all bills included.
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Explore thousands of premium, fully-furnished rooms across 16+ London boroughs. Zero hidden fees, fast booking, and guaranteed peace of mind.
            </p>

            {/* SEARCH CONTROLS CARD */}
            <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-[#0A192F]">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Location Input */}
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-[#E8E4DF] px-3.5 py-3 rounded-2xl focus-within:ring-2 focus-within:ring-[#F9A370]/50 transition-all">
                  <MapPin className="w-4 h-4 text-[#F9A370] shrink-0" />
                  <div className="w-full text-left">
                    <label className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Camden, Shoreditch"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0A192F] outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Room Type Selector */}
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-[#E8E4DF] px-3.5 py-3 rounded-2xl focus-within:ring-2 focus-within:ring-[#F9A370]/50 transition-all">
                  <Home className="w-4 h-4 text-[#F9A370] shrink-0" />
                  <div className="w-full text-left">
                    <label className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                      Room Type
                    </label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0A192F] outline-none cursor-pointer"
                    >
                      <option value="all">Any Room Type</option>
                      <option value="double">En-suite Double</option>
                      <option value="single">Single Room</option>
                      <option value="studio">Studio Flat</option>
                    </select>
                  </div>
                </div>

                {/* Max Budget Input */}
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-[#E8E4DF] px-3.5 py-3 rounded-2xl focus-within:ring-2 focus-within:ring-[#F9A370]/50 transition-all">
                  <PoundSterling className="w-4 h-4 text-[#F9A370] shrink-0" />
                  <div className="w-full text-left">
                    <label className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                      Max Budget
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. £950/mo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#0A192F] outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Submit Search Button */}
                <div className="sm:col-span-3 pt-1">
                  <button
                    type="submit"
                    className="w-full bg-[#F9A370] hover:bg-[#e38d5b] text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-[#F9A370]/30 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider group"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Available Rooms</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Location Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-gray-400 font-medium">Popular:</span>
              {["West Hampstead", "Shoreditch", "Camden", "Angel", "Clapham"].map((area) => (
                <button
                  key={area}
                  onClick={() => setLocation(area)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-gray-300 transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Trust Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">4,150+</div>
                <div className="text-[11px] text-gray-400">Tenants Housed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#F9A370]">332+</div>
                <div className="text-[11px] text-gray-400">Active Properties</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">4.9 ★</div>
                <div className="text-[11px] text-gray-400">Trustpilot Rating</div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Visual Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src="/About.avif"
                  alt="Modern London Living Space"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-80" />

                {/* Floating Badge - Top Right */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-white/40 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F9A370]" />
                  <span className="text-xs font-extrabold text-[#0A192F]">All Bills Included</span>
                </div>

                {/* Floating Testimonial Card - Bottom */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-[#F9A370]">
                        <img src="https://i.pravatar.cc/150?u=sarah" alt="Tenant" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0A192F]">Sarah M.</div>
                        <div className="text-[10px] text-gray-500">Tenant in Camden</div>
                      </div>
                    </div>
                    <div className="flex text-[#F9A370] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-700 italic leading-tight">
                    "Found an incredible room in Camden with all bills included. Move-in was super quick!"
                  </p>
                </div>
              </div>

              {/* Decorative Accent Frame Behind Card */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#F9A370]/30 rounded-3xl pointer-events-none -z-10 hidden sm:block" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}