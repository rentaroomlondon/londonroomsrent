"use client";

import React from "react";

const stats = [
  {
    value: "4,150",
    label: "Happy Tenants",
    highlight: false,
  },
  {
    value: "2,490",
    label: "Rooms Available",
    highlight: true,
  },
  {
    value: "83",
    label: "Areas Covered",
    highlight: false,
  },
  {
    value: "332",
    label: "Properties Managed",
    highlight: true,
  },
];

export default function Stats() {
  return (
    <section className="w-full bg-[#0F253B] border-y border-white/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 select-none relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,124,60,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center text-center px-4 ${
                index !== 0 ? "pt-6 md:pt-0" : ""
              }`}
            >
              {/* Subtle Live Indicator Pill */}
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    stat.highlight ? "bg-[#F47C3C] animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Verified
                </span>
              </div>

              {/* Number Value */}
              <h2
                className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-2 ${
                  stat.highlight ? "text-[#F47C3C]" : "text-white"
                }`}
              >
                {stat.value}
              </h2>

              {/* Label */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}