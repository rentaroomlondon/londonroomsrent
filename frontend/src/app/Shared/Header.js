"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../Context/AuthContext";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  AlertCircle,
  PhoneCall,
  ShieldAlert,
  ArrowRight,
  Building2,
} from "lucide-react";

const navLinks = [
  {
    label: "Search",
    href: "/find-a-room",
    icon: Search,
  },
  {
    label: "Tenants",
    dropdown: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Why Choose Us", href: "/why-choose-us" },
      { label: "FAQ's", href: "/faqs" },
      { label: "Report a Repair", href: "/report-a-repair" },
      { label: "Make a Payment", href: "/make-a-payment" },
      { label: "Out of Office Emergencies", href: "/out-of-office-emergencies", highlight: true },
      { label: "Raise a Complaint", href: "/raise-a-complain" },
      { label: "Register with Us", href: "/register-with-us" },
    ],
  },
  {
    label: "About Us",
    dropdown: [
      { label: "About Us", href: "/about-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    label: "Contact",
    href: "/contact-us",
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  
  const { user, loadingUser, logout } = useAuth();
  const profileRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  const toggleMobileAccordion = (label) => {
    setExpandedMobileCategory(expandedMobileCategory === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F253B] shadow-md border-b border-white/10 select-none">
      <nav className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#F47C3C] flex items-center justify-center p-1.5 shadow-md shadow-[#F47C3C]/20 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/logo.png"
              alt="London Rooms Rent"
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm sm:text-lg font-black tracking-wider uppercase leading-none">
              LONDON<span className="text-[#F47C3C]">ROOMS</span>RENT
            </span>
            
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              {link.href ? (
                <Link
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-[#F47C3C] py-2 transition-colors flex items-center gap-1.5"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  className="text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-[#F47C3C] py-2 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              )}

              {/* DROPDOWN MENU */}
              {link.dropdown && (
                <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          item.highlight
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#0F253B]"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.highlight && <ShieldAlert size={14} className="text-rose-500" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/saved"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-rose-400 transition-colors"
            title="Saved Rooms"
          >
            <Heart size={18} />
          </Link>

          {!loadingUser && (
            user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F47C3C] text-white font-black text-xs flex items-center justify-center uppercase shadow-sm">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {user.firstName}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* PROFILE MENU */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-slate-400" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-[#F47C3C] hover:bg-[#e06b2d] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-lg shadow-[#F47C3C]/20 flex items-center gap-2"
              >
                <span>Login</span>
                <ArrowRight size={14} />
              </Link>
            )
          )}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/saved"
            className="p-2 rounded-xl bg-white/5 text-white hover:text-rose-400"
            aria-label="Saved Rooms"
          >
            <Heart size={20} />
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </div>

      </nav>

      {/* MOBILE OVERLAY & DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Box */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0F253B] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 size={20} className="text-[#F47C3C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Menu</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Accordion Links */}
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.label} className="border-b border-white/5 pb-2">
                    {link.href ? (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-2.5 text-sm font-bold text-slate-200 hover:text-[#F47C3C]"
                      >
                        <span>{link.label}</span>
                        <ChevronRight size={16} className="text-slate-500" />
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleMobileAccordion(link.label)}
                          className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-slate-200 hover:text-[#F47C3C]"
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            size={16}
                            className={`text-slate-500 transition-transform ${
                              expandedMobileCategory === link.label ? "rotate-180 text-[#F47C3C]" : ""
                            }`}
                          />
                        </button>

                        {/* Accordion Items */}
                        {expandedMobileCategory === link.label && link.dropdown && (
                          <div className="mt-1 ml-3 space-y-1 pl-3 border-l-2 border-white/10">
                            {link.dropdown.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block py-2 text-xs font-semibold ${
                                  sub.highlight
                                    ? "text-rose-400 font-bold flex items-center justify-between"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <span>{sub.label}</span>
                                {sub.highlight && <ShieldAlert size={14} className="text-rose-400" />}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer / Profile Card */}
            <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
              {!loadingUser && (
                user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F47C3C] text-white font-bold flex items-center justify-center">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">
                          {user.firstName} {user.lastName || ""}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 rounded-xl bg-[#F47C3C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <span>Login or Register</span>
                    <ArrowRight size={14} />
                  </Link>
                )
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}