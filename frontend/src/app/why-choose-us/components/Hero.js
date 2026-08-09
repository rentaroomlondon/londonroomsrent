import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0B1524]">
        
        {/* Premium Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1524] via-[#111E30] to-[#0B1524]" />
          
          {/* Soft warm glow (top right) */}
          <div className="absolute -top-32 -right-20 w-[480px] h-[480px] 
            bg-[radial-gradient(circle,rgba(255,107,53,0.13)_0%,transparent_70%)] 
            blur-2xl" />
          
          {/* Soft cool glow (bottom left) */}
          <div className="absolute -bottom-24 -left-16 w-[420px] h-[420px] 
            bg-[radial-gradient(circle,rgba(59,130,246,0.09)_0%,transparent_70%)] 
            blur-2xl" />

          {/* Very subtle noise for premium texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 
          py-16 md:py-24 lg:py-28">
          
          <div className="max-w-xl">

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2.5 mb-7 
              px-4 py-1.5 rounded-full 
              bg-white/[0.04] border border-white/[0.09]
              backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/65">
                Our Promise
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-white font-serif font-bold 
              text-[34px] leading-[1.15] 
              sm:text-4xl 
              md:text-[48px] md:leading-[1.1] 
              lg:text-[56px] lg:leading-[1.08]
              tracking-[-0.02em] mb-5">
              Why <span className="italic text-[#FF6B35] font-normal">Choose</span> Us
            </h1>

            {/* Description */}
            <p className="text-white/55 font-light 
              text-[15px] leading-[1.7] 
              md:text-[16.5px] md:leading-[1.75]
              max-w-md mb-9">
              Receive up-to-date available rooms to rent in London, with every detail of your move carefully managed.
            </p>

            {/* Desktop CTA */}
            <a
              href="/register-with-us"
              className="hidden md:inline-flex items-center gap-2.5 
                bg-[#FF6B35] hover:bg-[#ff7d4d] 
                text-white font-semibold 
                px-7 py-3.5 rounded-xl 
                shadow-[0_8px_24px_-4px_rgba(255,107,53,0.35)]
                hover:shadow-[0_12px_28px_-4px_rgba(255,107,53,0.45)]
                transition-all duration-300 
                active:scale-[0.98] 
                text-[13px] tracking-wide uppercase 
                no-underline group"
            >
              <span>Register Now</span>
              <ArrowRight 
                size={17} 
                className="group-hover:translate-x-1 transition-transform duration-300" 
              />
            </a>
          </div>
        </div>

        {/* Elegant bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px 
          bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden sticky bottom-0 z-50 w-full 
        bg-[#FFF8F4]/95 backdrop-blur-md 
        border-t border-[#FF6B35]/10 
        px-4 py-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <a
          href="/register-with-us"
          className="w-full flex items-center justify-center gap-2 
            bg-[#FF6B35] active:bg-[#e55a28] 
            text-white font-semibold 
            text-[13px] tracking-wide uppercase 
            py-3.5 rounded-xl 
            shadow-md shadow-[#FF6B35]/20
            transition-all active:scale-[0.98] 
            no-underline"
        >
          <span>Register Now</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </>
  );
};

export default Hero;