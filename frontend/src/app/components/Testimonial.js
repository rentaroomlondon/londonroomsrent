"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Ibañez",
    origin: "Madrid",
    verified: true,
    rating: 5,
    tag: "Stress-free Rent",
    text: "My experience has been very positive. The staff working at LONDONROOMSRENT have proved to be honest, reliable and the team ensured a stress-free rent. Good communication during the whole process and a fast response when problems arise.",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "David Smith",
    origin: "Barcelona",
    verified: true,
    rating: 5,
    tag: "Fast & Professional",
    text: "The process of finding a new apartment was incredibly smooth. They understood my requirements perfectly and found me a place that exceeded my expectations within a week. Highly professional service.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Elena Gomez",
    origin: "Valencia",
    verified: true,
    rating: 5,
    tag: "Transparent Service",
    text: "Reliable, transparent, and very helpful. I was worried about moving to a new city, but the team made the rental process feel effortless. I highly recommend their services to anyone looking for a home.",
    date: "2 weeks ago"
  },
  {
    id: 4,
    name: "Lucas Meyer",
    origin: "Madrid",
    verified: true,
    rating: 5,
    tag: "Great Communication",
    text: "Quick responses and a very friendly team. They managed everything from viewings to contract signing professionally. Best real estate experience I have had so far.",
    date: "3 weeks ago"
  }
];

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);

  // Cycle through testimonials
  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get currently visible items (3 on desktop)
  const visibleTestimonials = [
    testimonials[startIndex],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <section className="bg-[#0F253B] py-20 sm:py-28 text-white select-none overflow-hidden relative">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F47C3C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* TOP SECTION: Trust Badge & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3">
            {/* Trustpilot Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-0.5 text-[#00B67A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#00B67A]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                Rated Excellent on <strong className="text-white">Trustpilot</strong>
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
              Loved By <span className="text-[#F47C3C]">Tenants</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-lg font-medium">
              Real stories from international professionals and students who found their London home with us.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#F47C3C] hover:border-[#F47C3C] text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#F47C3C] hover:border-[#F47C3C] text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
              aria-label="Next review"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* REVIEWS GRID (3 visible on desktop, 1-2 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-[#18324B]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#F47C3C]/50 transition-all duration-300 hover:-translate-y-1 group shadow-xl"
            >
              <div>
                {/* Card Header: Tag & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#F47C3C]/10 border border-[#F47C3C]/20 text-[#F47C3C] text-xs font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <Quote size={28} className="text-white/10 group-hover:text-[#F47C3C]/30 transition-colors" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#F47C3C]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#F47C3C]" />
                  ))}
                </div>

                {/* Review Content */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  "{item.text}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle with Initial */}
                  <div className="w-10 h-10 rounded-full bg-[#F47C3C] text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      from {item.origin}
                    </p>
                  </div>
                </div>

                {/* Trustpilot Verified Icon */}
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#00B67A] bg-[#00B67A]/10 px-2.5 py-1 rounded-md">
                  <CheckCircle2 size={12} />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Read all our 500+ verified tenant reviews on{" "}
            <a
              href="https://www.trustpilot.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#F47C3C] font-bold hover:underline"
            >
              Trustpilot.com →
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}