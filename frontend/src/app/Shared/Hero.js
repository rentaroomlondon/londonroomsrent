import React from "react";

const Hero = ({
  badge = "Help Centre",
  title = "Tenant",
  highlight = "FAQs",
  description = "Find clear answers to everyday questions about renting, maintenance, deposits, and hassle-free living in London.",
  linkText = "Contact Support",
  linkHref = "/contact-us",
}) => {
  return (
    <section className="relative w-full bg-[#0F172A] py-16 md:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden font-sans border-b border-slate-800/80">
      
      {/* Ambient Background Glows & Technical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF7A45]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        
        {/* Category Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF7A45]/10 border border-[#FF7A45]/25 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF7A45] animate-pulse" />
          <span className="text-[#FF7A45] text-xs font-bold uppercase tracking-widest">
            {badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-slate-100 leading-tight">
          {title}{" "}
          <span className="relative inline-block text-[#FF7A45] italic font-playfair font-medium">
            {highlight}
            <svg
              className="absolute left-0 -bottom-2 w-full h-3 text-[#FF7A45]/40 pointer-events-none"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,15 Q50,3 100,15"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed font-light">
          {description}
        </p>

        {/* Action CTA Button */}
        {linkText && linkHref && (
          <div className="pt-2">
            <a
              href={linkHref}
              className="inline-flex items-center gap-3 bg-[#FF7A45] hover:bg-[#ff6a30] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-[#FF7A45]/20 hover:shadow-[#FF7A45]/40 hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base tracking-wide"
            >
              <span>{linkText}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Quick Highlights / Trust Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <p className="text-[#FF7A45] font-bold text-lg">24/7 Support</p>
            <p className="text-slate-400 text-xs mt-1">Maintenance & Urgent Enquiries</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <p className="text-[#FF7A45] font-bold text-lg">Instant Help</p>
            <p className="text-slate-400 text-xs mt-1">Comprehensive Renting Guides</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <p className="text-[#FF7A45] font-bold text-lg">Verified Rooms</p>
            <p className="text-slate-400 text-xs mt-1">Managed Across London</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;