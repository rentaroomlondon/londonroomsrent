import React from "react";

const Testimonial = ({
  text = "My experience has been very positive. The staff working at The LONDONROOMSRENT have proved to be honest, reliable and the team ensured a stress-free rent.",
  name = "Maria Ibañez",
  source = "Madrid via Trustpilot",
  rating = 5,
}) => {
  return (
    <section className="relative bg-[#0D131F] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Accent Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF7A45]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="bg-[#162032]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Orange Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF7A45] to-transparent" />

          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Header Badge & Rating */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Review
              </span>

              {/* Star Rating */}
              <div className="flex items-center gap-1 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800 text-[#FF7A45] text-sm">
                {[...Array(rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>

            {/* Main Review Quote */}
            <blockquote className="text-slate-100 font-serif text-lg sm:text-2xl leading-relaxed italic max-w-2xl">
              &ldquo;{text}&rdquo;
            </blockquote>

            {/* Author Profile */}
            <div className="pt-4 border-t border-slate-800/80 w-full flex flex-col items-center">
              {/* Avatar Initial Ring */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF7A45] to-amber-400 p-0.5 mb-3 shadow-lg shadow-[#FF7A45]/10">
                <div className="w-full h-full rounded-full bg-[#162032] flex items-center justify-center text-white font-bold text-lg font-serif">
                  {name.charAt(0)}
                </div>
              </div>

              <h3 className="text-white font-semibold text-base sm:text-lg">
                {name}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-medium">
                {source}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;