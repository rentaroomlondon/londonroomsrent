import React from "react";
import { ShieldCheck, CheckCircle2, Building2, Star, Award } from "lucide-react";

const CREDENTIALS = [
  {
    id: "cmp",
    label: "Client Money Protect",
    mobileLabel: "Client Money Protect",
    subLabel: "Regulated Financial Safety",
    icon: <ShieldCheck className="w-5 h-5 text-[#F47C3C]" />,
  },
  {
    id: "deposits",
    label: "My Deposits — Tenancy Deposit Protection",
    mobileLabel: "My Deposits",
    subLabel: "Government Backed Scheme",
    icon: <CheckCircle2 className="w-5 h-5 text-[#F47C3C]" />,
  },
  {
    id: "prs",
    label: "PRS — Property Redress Scheme",
    mobileLabel: "PRS Scheme",
    subLabel: "Independent Consumer Redress",
    icon: <Building2 className="w-5 h-5 text-[#F47C3C]" />,
  },
  {
    id: "trustpilot",
    label: "Trustpilot Rated 4.9/5",
    mobileLabel: "Trustpilot 4.9/5",
    subLabel: "Based on 1,200+ Reviews",
    icon: <Star className="w-5 h-5 text-[#F47C3C] fill-[#F47C3C]" />,
  },
];

const CredentialCard = ({ label, mobileLabel, subLabel, icon }) => (
  <li className="group relative flex items-center gap-3.5 bg-white border border-[#E8E4DF] hover:border-[#F47C3C]/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 w-[240px] sm:w-[280px] md:w-auto md:flex-1">
    
    {/* Icon Container */}
    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E4DF] group-hover:border-[#F47C3C]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
      {icon}
    </div>

    {/* Text Info */}
    <div className="flex flex-col min-w-0">
      <span className="text-xs font-bold font-sans text-[#0F253B] leading-tight truncate">
        <span className={mobileLabel ? "hidden md:inline" : ""}>{label}</span>
        {mobileLabel && <span className="md:hidden">{mobileLabel}</span>}
      </span>
      {subLabel && (
        <span className="text-[10px] text-[#6B7280] font-medium tracking-wide mt-0.5 truncate">
          {subLabel}
        </span>
      )}
    </div>

  </li>
);

export default function CredentialStrip() {
  return (
    <section
      aria-label="Company credentials and accreditations"
      className="bg-[#FAF8F5] py-8 border-y border-[#E8E4DF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4">
        
        {/* Section Tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold font-sans uppercase tracking-widest text-[#0F253B]">
            <Award className="w-4 h-4 text-[#F47C3C]" />
            <span>Accredited & Protected</span>
          </div>
          <span className="hidden sm:block text-xs text-[#6B7280] font-medium">
            100% Compliant Lettings Standards
          </span>
        </div>

        {/* Credentials Grid / Scroll Container */}
        <ul className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {CREDENTIALS.map((item) => (
            <CredentialCard
              key={item.id}
              label={item.label}
              mobileLabel={item.mobileLabel}
              subLabel={item.subLabel}
              icon={item.icon}
            />
          ))}
        </ul>

      </div>
    </section>
  );
}