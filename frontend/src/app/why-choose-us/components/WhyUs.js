"use client";

import React, { useState } from "react";
import Image from "next/image";

const WhyUs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      id: "rentals",
      badge: "Tenant First",
      icon: "👥",
      title: "Stress-Free Room Rentals in London So You Can",
      highlight: "Enjoy City Life",
      description:
        "At LONDONROOMSRENT, we help professionals and students find affordable rooms to rent in London with ease. From personalised room matching to ongoing support, our multilingual team ensures every step of your move is smooth, secure, and hassle-free.",
      bullets: [
        "Personalised room matching based on lifestyle and budget",
        "Friendly multilingual support team available throughout your journey",
        "2,000+ well-maintained rooms and shared properties across London",
        "Excellent transport connections for easy daily commuting",
      ],
      stat: "2,000+",
      statLabel: "Managed Rooms Across London",
      image: "/woman-sitting.avif",
    },
    {
      id: "maintenance",
      badge: "24/7 Care",
      icon: "🔧",
      title: "Reliable Property Maintenance and Cleaning Services Available",
      highlight: "Around the Clock",
      description:
        "We provide professionally managed accommodation with trusted in-house maintenance engineers and cleaners available around the clock. Our goal is to keep every property clean, safe, and comfortable for tenants across London.",
      bullets: [
        "Dedicated in-house maintenance team for fast support",
        "24/7 emergency repair assistance for urgent issues",
        "Regular property inspections and professional cleaning",
        "Flexible move-in and move-out options for tenants",
      ],
      stat: "< 2 hrs",
      statLabel: "Average Maintenance Response Time",
      image: "/cleaner-window.avif",
    },
  ];

  const activeService = services[activeTab];

  return (
    <section
      className="py-16 px-4 md:py-28 md:px-8 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] overflow-hidden"
      aria-label="Why Choose LONDONROOMSRENT"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF7A45]/10 text-[#FF7A45] text-xs md:text-sm font-semibold tracking-wide uppercase">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#1A1A1A] leading-tight">
            Designed for Your Comfort & Peace of Mind
          </h2>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-[#F0ECE6] rounded-2xl gap-2 border border-[#E2DDD5]">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-white text-[#1A1A1A] shadow-md shadow-black/5"
                    : "text-[#6B7280] hover:text-[#1A1A1A]"
                }`}
              >
                <span>{service.icon}</span>
                <span>{service.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 md:p-12 border border-[#E8E4DF] shadow-xl shadow-black/[0.02]">
          
          {/* Left Column: Visual Content with Floating Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[320px] sm:h-[420px] lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-inner">
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating Glassmorphism Metric Card */}
            <div className="absolute -bottom-6 right-4 sm:right-6 bg-white/95 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl max-w-[240px] sm:max-w-[280px]">
              <p className="text-2xl sm:text-3xl font-bold text-[#FF7A45] font-sans">
                {activeService.stat}
              </p>
              <p className="text-xs sm:text-sm text-[#4B5563] font-medium mt-1">
                {activeService.statLabel}
              </p>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF7A45]/10 rounded-lg text-[#FF7A45] text-xs font-semibold">
              <span>{activeService.icon}</span>
              <span>{activeService.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-[#1A1A1A] leading-snug">
              {activeService.title}{" "}
              <span className="text-[#FF7A45] relative inline-block">
                {activeService.highlight}
                <svg
                  className="absolute left-0 -bottom-1 w-full h-2 text-[#FF7A45]/30 -z-10"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,15 Q50,5 100,15"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
            </h3>

            <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed font-sans">
              {activeService.description}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {activeService.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DF]/60 transition-colors hover:border-[#FF7A45]/40"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF7A45] text-white flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm text-[#374151] font-medium leading-snug">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;