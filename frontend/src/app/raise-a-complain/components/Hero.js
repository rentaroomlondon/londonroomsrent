import React from "react";

const Hero = ({
  badge = "Help Centre",
  title = "Tenant",
  highlight = "FAQs",
  description = "",
  linkText,
}) => {
  return (
    <section className="relative w-full flex items-center overflow-hidden px-5 py-12 md:px-16 md:py-20 bg-[linear-gradient(115.54deg,#7B1654_0%,#9A1E68_100%)] md:bg-[linear-gradient(102.2deg,#8B1A5A_0%,#A0215C_100%)]">
      
      {/* Decorative Glows & Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Desktop Ambient Background Glow */}
        <div className="hidden md:block absolute -right-20 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F47C3C]/15 rounded-full blur-3xl" />
        
        {/* Desktop Structural Accent Ring */}
        <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Mobile Ambient Glow */}
        <div className="md:hidden absolute -right-10 -top-10 w-64 h-64 bg-[#F47C3C]/20 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl space-y-4">
          
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F47C3C] animate-pulse" />
              <span className="uppercase text-white font-sans font-bold text-[10px] md:text-[11px] tracking-[1.5px]">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-white font-playfair text-[36px] leading-[1.15] md:text-[56px] md:leading-[1.15] font-bold tracking-tight">
            {title}{" "}
            {highlight && (
              <span className="text-[#FFB3D4] italic font-playfair font-normal drop-shadow-sm">
                {highlight}
              </span>
            )}
          </h1>

          {/* Description */}
          <p className="text-white/80 font-sans font-normal text-[14px] leading-relaxed md:text-[16px] md:leading-relaxed max-w-xl">
            {description}
            {linkText && (
              <>
                {" "}
                <a
                  href="#"
                  className="text-[#FF7A45] hover:text-[#ff8f61] font-semibold underline underline-offset-4 decoration-[#FF7A45]/60 hover:decoration-[#FF7A45] transition-colors cursor-pointer"
                >
                  {linkText}
                </a>
              </>
            )}
          </p>

        </div>
      </div>
    </section>
  );
};

export default Hero;