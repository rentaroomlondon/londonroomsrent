"use client";

import React from "react";
import { MapPin, ArrowUpRight, Sparkles, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

// 10 Unique London Neighbourhoods
const areas = [
  {
    name: "Shoreditch",
    postcode: "E1",
    rooms: 34,
    zone: "East",
    featured: true, // Bento wide card
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Marylebone",
    postcode: "W1",
    rooms: 28,
    zone: "Central",
    image:
      "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Canary Wharf",
    postcode: "E14",
    rooms: 41,
    zone: "East",
    image:
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Dalston",
    postcode: "E8",
    rooms: 19,
    zone: "East",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Greenwich",
    postcode: "SE10",
    rooms: 22,
    zone: "South",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Stratford",
    postcode: "E15",
    rooms: 37,
    zone: "East",
    featured: true, // Bento wide card
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Hoxton",
    postcode: "N1",
    rooms: 15,
    zone: "North",
    image:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mile End",
    postcode: "E3",
    rooms: 26,
    zone: "East",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Kensington",
    postcode: "W8",
    rooms: 31,
    zone: "West",
    tag: "Hotspot",
    image:
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Islington",
    postcode: "N1",
    rooms: 24,
    zone: "North",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function AreaGuides() {
  const router = useRouter();

  const handleAreaClick = (area) => {
    const query = new URLSearchParams({
      search: area.postcode, // ✅ Retained logic
      label: area.name,      // ✅ Retained logic
    }).toString();

    router.push(`/find-a-room?${query}`);
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-24 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER SECTION */}
        <div className="text-left sm:text-center max-w-2xl sm:mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F47C3C]/10 border border-[#F47C3C]/20 text-[#F47C3C] text-xs font-bold tracking-widest uppercase">
            <Compass size={14} />
            <span>Neighbourhood Explorer</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0F253B] tracking-tight leading-none">
            Explore By <span className="text-[#F47C3C]">Area</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Click any neighbourhood to find available rooms nearby.
          </p>
        </div>

        {/* BENTO GRID - 10 CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[280px]">
          {areas.map((area, index) => (
            <div
              key={index}
              onClick={() => handleAreaClick(area)}
              className={`relative group rounded-[28px] overflow-hidden cursor-pointer bg-slate-900 border border-slate-200/60 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(15,37,59,0.25)] ${
                area.featured ? "col-span-2 md:col-span-2" : "col-span-1"
              }`}
            >
              {/* Background Image */}
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F253B]/90 via-[#0F253B]/30 to-transparent transition-opacity duration-300 group-hover:opacity-85" />

              {/* Top Bar: Tag & Postcode Badge */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                {area.tag ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F47C3C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    <Sparkles size={11} />
                    {area.tag}
                  </span>
                ) : (
                  <div />
                )}

                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase shadow-sm">
                  {area.postcode}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 inset-x-4 z-10 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#F47C3C]">
                    <MapPin size={13} strokeWidth={2.5} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {area.zone} London
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    {area.name}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium">
                    {area.rooms} rooms available
                  </p>
                </div>

                {/* Action Icon */}
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#F47C3C] group-hover:border-[#F47C3C] group-hover:rotate-45 shrink-0">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}