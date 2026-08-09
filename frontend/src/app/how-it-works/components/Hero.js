import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A1628]">
      
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0F2137] to-[#0A1628]" />
        
        {/* Warm glow - top right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,107,53,0.14)_0%,transparent_70%)]" />
        
        {/* Cool glow - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]" />

        {/* Subtle noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/80">
              Step by Step
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6">
            How It{" "}
            <span className="italic font-normal text-[#FF6B35]">Works</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300/80 font-light text-base md:text-lg leading-relaxed max-w-lg">
            Your complete guide from first search to moving day and beyond. We make renting in London simple.
          </p>

        </div>
      </div>

      {/* Bottom border gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
};

export default Hero;