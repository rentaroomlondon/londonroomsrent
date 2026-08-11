"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Building,
} from "lucide-react";

export default function OfficeSection() {
  const address = "118 Cricklewood Broadway, NW2 3EJ, London";
  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  return (
    <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Tag & Title */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F47C3C]/10 border border-[#F47C3C]/20 text-[#F47C3C] text-xs font-bold tracking-widest uppercase">
            <Building size={14} />
            <span>Visit Us</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0F253B] tracking-tight">
            Our Head <span className="text-[#F47C3C]">Office</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">
            Drop by for a coffee and discuss your room requirements directly with our team.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE: Contact & Information Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between space-y-8">
            
            {/* Address Header */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F47C3C]/10 text-[#F47C3C] flex items-center justify-center shrink-0">
                  <MapPin size={24} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Location
                  </h3>
                  <p className="text-lg font-bold text-[#0F253B] leading-snug">
                    118 Cricklewood Broadway
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    London, NW2 3EJ
                  </p>
                </div>
              </div>

              {/* Action Buttons: Call & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+447950309760"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-[#F47C3C] hover:border-[#F47C3C] hover:text-white group transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#0F253B] flex items-center justify-center group-hover:border-transparent shrink-0">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white/80">
                      Call Us
                    </span>
                    <span className="text-xs font-bold text-[#0F253B] group-hover:text-white">
                      +447950309760
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:info@LONDONROOMSRENT.co.uk"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-[#0F253B] hover:border-[#0F253B] hover:text-white group transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#0F253B] flex items-center justify-center group-hover:border-transparent shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white/80">
                      Email Us
                    </span>
                    <span className="text-xs font-bold text-[#0F253B] group-hover:text-white truncate block">
                      Email Team
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Opening Hours Schedule */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0F253B] font-bold text-sm">
                  <Clock size={16} className="text-[#F47C3C]" />
                  <span>Opening Hours</span>
                </div>
                
                {/* Live Status Tag */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open Today
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span>Monday – Friday</span>
                  <span className="font-bold text-[#0F253B]">10:00 – 18:00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span>Saturday</span>
                  <span className="font-bold text-[#0F253B]">11:00 – 17:00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 opacity-60">
                  <span>Sunday</span>
                  <span className="font-bold text-rose-500">Closed</span>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0F253B] hover:bg-[#F47C3C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300 shadow-md"
            >
              <Navigation size={15} />
              <span>Get Directions</span>
              <ExternalLink size={14} className="opacity-60" />
            </a>

          </div>

          {/* RIGHT SIDE: Interactive Google Map */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-200/50 group">
            <iframe
              title="Cricklewood Office Location Map"
              src="https://www.google.com/maps?q=118+Cricklewood+Broadway,+NW2+3EJ,+London&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />

            {/* Floating Office Badge */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto bg-[#0F253B]/90 backdrop-blur-md border border-white/20 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F47C3C] flex items-center justify-center text-white shrink-0 font-bold">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">LONDONROOMSRENT</p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Cricklewood Broadway Office
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}