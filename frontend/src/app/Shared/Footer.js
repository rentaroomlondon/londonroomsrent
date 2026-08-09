"use client";

import Link from "next/link";
import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ShieldCheck,
} from "lucide-react";

const tenantLinks = [
  { label: "Find a Room", href: "/find-a-room" },
  { label: "Report a Repair", href: "/report-a-repair" },
  { label: "Make a Payment", href: "/make-a-payment" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "FAQs", href: "/faqs" },
  { label: "Register With Us", href: "/register-with-us" },
];

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Raise a Complaint", href: "/raise-a-complain" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-and-conditions" },
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "YouTube", href: "#", icon: Youtube },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F253B] text-slate-300 select-none border-t border-white/10">

      {/* MAIN NAVIGATION GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href="/" className="inline-block text-2xl font-black text-white tracking-tight">
                LONDON<span className="text-[#F47C3C]">ROOMS</span>RENT
              </Link>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                Providing verified, fully-furnished rooms and managed properties across London. Fast booking, transparent pricing, and professional support.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
              <ShieldCheck size={16} className="text-[#F47C3C]" />
              <span>CMP Protected & PRS Registered</span>
            </div>
          </div>

          {/* Tenants Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              For Tenants
            </h4>
            <ul className="space-y-2.5">
              {tenantLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-400 hover:text-[#F47C3C] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-400 hover:text-[#F47C3C] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Contact Us
            </h4>

            <div className="space-y-3.5 text-sm font-medium text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F47C3C] shrink-0 mt-0.5" />
                <span>118 Cricklewood Broadway, London, NW2 3EJ</span>
              </div>

              <a
                href="tel:02077905577"
                className="flex items-center gap-3 hover:text-[#F47C3C] transition-colors"
              >
                <Phone size={18} className="text-[#F47C3C] shrink-0" />
                <span>+44 (0) 20 7790 5577</span>
              </a>

              <a
                href="mailto:info@LONDONROOMSRENT.co.uk"
                className="flex items-center gap-3 hover:text-[#F47C3C] transition-colors truncate"
              >
                <Mail size={18} className="text-[#F47C3C] shrink-0" />
                <span className="truncate">info@LONDONROOMSRENT.co.uk</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#F47C3C] hover:border-[#F47C3C] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-12 text-xs font-medium text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} LONDONROOMSRENT. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}