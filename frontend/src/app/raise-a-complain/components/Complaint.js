import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Building2,
  FileCheck2,
} from "lucide-react";

const stepsData = [
  {
    step: "01",
    title: "Stage 1 — Formal Complaint to Manager",
    icon: <MessageSquare className="w-5 h-5 text-[#F47C3C]" />,
    description:
      "Write directly to our Management team detailing your concerns. Once received, we acknowledge receipt within 3 working days and conduct a full internal review.",
    sla: "Acknowledgement in 3 days • Response in 15 days",
    action: {
      type: "email",
      label: "info@LONDONROOMSRENT.co.uk",
      href: "mailto:info@LONDONROOMSRENT.co.uk",
    },
  },
  {
    step: "02",
    title: "Stage 2 — Escalation to Managing Director",
    icon: <Building2 className="w-5 h-5 text-[#F47C3C]" />,
    description:
      "If you are unsatisfied with the initial outcome, your complaint can be escalated directly to the Managing Director for a final company assessment.",
    sla: "Final Viewpoint Letter issued",
    action: {
      type: "address",
      label: "118 Cricklewood Broadway, NW2 3EJ",
    },
  },
  {
    step: "03",
    title: "Stage 3 — Independent Redress (PRS)",
    icon: <ShieldCheck className="w-5 h-5 text-[#F47C3C]" />,
    description:
      "If you remain dissatisfied after our final viewpoint letter, you can refer your case to the Property Redress Scheme (PRS) for free, independent adjudication.",
    sla: "Referral within 12 months of final viewpoint",
    action: {
      type: "link",
      label: "Visit www.theprs.co.uk",
      href: "https://www.theprs.co.uk",
    },
  },
];

const Complaint = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#0F253B] to-[#1E3A5F] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#F47C3C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#F47C3C]/20 border border-[#F47C3C]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F47C3C] tracking-wide uppercase">
                <FileCheck2 className="w-3.5 h-3.5" />
                Customer Assurance Policy
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight leading-tight">
                Customer Complaint Procedure
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                We are committed to delivering exceptional service. If something isn't right, our structured 3-stage process ensures your voice is heard and resolved fairly.
              </p>
            </div>

            {/* Quick SLA Stat Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col justify-center shrink-0 min-w-[240px] text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                Resolution Commitment
              </span>
              <div className="text-2xl font-black text-white mt-1">
                15 Working Days
              </div>
              <span className="text-xs text-gray-300 mt-0.5">
                Target turnaround for full investigation
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar - Summary Card & Fast Contact */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Guarantee Box */}
            <div className="bg-white border border-[#E8E4DF] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F253B] font-bold text-sm uppercase tracking-wider border-b border-[#E8E4DF] pb-3">
                <Clock className="w-4 h-4 text-[#F47C3C]" />
                Our Service Standards
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                In compliance with the <strong className="text-[#0F253B]">PRS Code of Practice</strong>, all complaints are logged formally and reviewed by senior management to ensure transparent resolution.
              </p>
              
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DF] text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-[#0F253B]">
                  <span>Initial Acknowledgment:</span>
                  <span className="text-[#F47C3C]">3 Days</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[#0F253B]">
                  <span>Full Response Window:</span>
                  <span className="text-[#F47C3C]">15 Days</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[#0F253B]">
                  <span>PRS Referral Limit:</span>
                  <span className="text-[#F47C3C]">12 Months</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white border border-[#E8E4DF] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F253B]">
                Registered Office Address
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B7280]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F47C3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F253B] block">LONDONROOMSRENT</strong>
                    <span>118 Cricklewood Broadway, London, NW2 3EJ</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#E8E4DF]">
                  <Mail className="w-4 h-4 text-[#F47C3C] shrink-0" />
                  <a
                    href="mailto:info@LONDONROOMSRENT.co.uk"
                    className="text-[#F47C3C] font-semibold hover:underline truncate"
                  >
                    info@LONDONROOMSRENT.co.uk
                  </a>
                </div>
              </div>
            </div>

            {/* General Contact Direct CTA */}
            <Link
              href="/contact-us"
              className="w-full bg-[#F47C3C] hover:bg-[#e85e2f] text-white py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-md shadow-[#F47C3C]/20 group"
            >
              <span>Have Questions? Contact Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </aside>

          {/* Right Main Stepper Panel */}
          <main className="lg:col-span-8 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            
            <div className="space-y-2 border-b border-[#E8E4DF] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F253B]">
                The 3-Step Resolution Procedure
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                Please follow the sequential steps below so our team can process your complaint effectively.
              </p>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-[#E8E4DF] before:-z-0">
              {stepsData.map((stepItem, idx) => (
                <div key={idx} className="relative z-10 flex gap-4 sm:gap-6 items-start group">
                  
                  {/* Step Circle Badge */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF8F5] border-2 border-[#E8E4DF] group-hover:border-[#F47C3C] text-[#0F253B] font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs transition-colors">
                    {stepItem.step}
                  </div>

                  {/* Step Content Container */}
                  <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-5 sm:p-6 flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {stepItem.icon}
                        <h3 className="text-sm sm:text-base font-bold text-[#0F253B]">
                          {stepItem.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-[#F47C3C] bg-[#F47C3C]/10 border border-[#F47C3C]/20 px-2.5 py-1 rounded-md uppercase tracking-wider self-start sm:self-auto">
                        {stepItem.sla}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                      {stepItem.description}
                    </p>

                    {/* Stage Action Links/Details */}
                    <div className="pt-2 border-t border-[#E8E4DF]/60">
                      {stepItem.action.type === "email" && (
                        <a
                          href={stepItem.action.href}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#F47C3C] hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{stepItem.action.label}</span>
                        </a>
                      )}

                      {stepItem.action.type === "address" && (
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F253B]">
                          <MapPin className="w-3.5 h-3.5 text-[#F47C3C]" />
                          <span>{stepItem.action.label}</span>
                        </div>
                      )}

                      {stepItem.action.type === "link" && (
                        <a
                          href={stepItem.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#F47C3C] hover:underline"
                        >
                          <span>{stepItem.action.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Redress Scheme Footer Callout */}
            <div className="bg-[#0F253B] text-white rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#F47C3C]" />
                <h3 className="text-base sm:text-lg font-bold">
                  Property Redress Scheme (PRS) Notice
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                You have up to <strong>12 months</strong> from the date of our final viewpoint letter to refer the matter to The Property Redress Scheme. Their independent service comes at no cost to tenants or leaseholders.
              </p>
              <a
                href="https://www.theprs.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                <span>Learn more at www.theprs.co.uk</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F47C3C]" />
              </a>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};

export default Complaint;