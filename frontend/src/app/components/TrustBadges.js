"use client";

import React from "react";
import { ShieldCheck, Landmark, Home, Star, CheckCircle2 } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Client Money Protect",
    subtitle: "Full CMP Cover",
    verified: true,
  },
  {
    icon: Landmark,
    title: "My Deposits",
    subtitle: "Government Scheme",
    verified: true,
  },
  {
    icon: Home,
    title: "Property Redress",
    subtitle: "PRS Ombudsman Member",
    verified: true,
  },
  {
    icon: Star,
    title: "Trustpilot Rated",
    subtitle: "5-Star Excellent",
    isTrustpilot: true,
  },
];

export default function TrustBadges() {
  return (
    <section className="w-full bg-slate-50 border-y border-slate-200/80 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#F47C3C]/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                      badge.isTrustpilot
                        ? "bg-[#00B67A]/10 text-[#00B67A]"
                        : "bg-[#0F253B]/5 text-[#0F253B] group-hover:bg-[#F47C3C]/10 group-hover:text-[#F47C3C]"
                    }`}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  {/* Text Details */}
                  <div>
                    <h3 className="text-sm font-black text-[#0F253B] leading-snug">
                      {badge.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                {badge.isTrustpilot ? (
                  <div className="flex items-center gap-0.5 text-[#00B67A] shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-[#00B67A]" />
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-emerald-500 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Verified Accreditation"
                  >
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}