import Link from 'next/link';
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Tell us what you need",
      description:
        "Share your budget, preferred areas, commute needs and lifestyle. We’ll match you with rooms that actually fit.",
      accent: "bg-teal-500",
      ring: "ring-teal-500/30",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      id: 2,
      title: "View your shortlist",
      description:
        "Book viewings for the rooms you like. A small holding deposit locks the room in while you decide.",
      accent: "bg-orange-500",
      ring: "ring-orange-500/30",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      id: 3,
      title: "References & paperwork",
      description:
        "We handle referencing (usually within 3 days) and issue the tenancy agreement. All compliance documents are provided.",
      accent: "bg-pink-500",
      ring: "ring-pink-500/30",
      image:
        "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      title: "Move in with confidence",
      description:
        "Your room is cleaned and prepared. We complete a full check-in inventory and give you deposit protection details.",
      accent: "bg-green-500",
      ring: "ring-green-500/30",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      id: 5,
      title: "Settled & supported",
      description:
        "Pay rent easily, report repairs online, and stay in touch with your dedicated property manager throughout the tenancy.",
      accent: "bg-purple-500",
      ring: "ring-purple-500/30",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
      id: 6,
      title: "Smooth move-out",
      description:
        "We’ll contact you three months before the end of your contract. Deposits are returned within 10 days of a clean exit.",
      accent: "bg-amber-400",
      ring: "ring-amber-400/30",
      image:
        "https://images.pexels.com/photos/8293654/pexels-photo-8293654.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <section className="relative py-20 md:py-20 px-4 overflow-hidden">
      {/* subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 via-transparent to-teal-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-sm font-semibold tracking-widest uppercase text-orange-500 mb-3">
            Simple process
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            How it <span className="text-orange-500">works</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base md:text-lg leading-relaxed">
            From first enquiry to moving out — six clear steps, no surprises.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Number badge */}
                <div
                  className={`absolute top-4 left-4 w-10 h-10 rounded-full ${step.accent} text-white font-bold text-lg flex items-center justify-center shadow-lg ring-4 ${step.ring}`}
                >
                  {step.id}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-sm text-slate-500 mb-6">
            Questions? We’re here to help —{" "}
            <a
              href="mailto:info@LONDONROOMSRENT.co.uk"
              className="font-medium text-slate-700 hover:text-orange-500 transition-colors"
            >
              info@LONDONROOMSRENT.co.uk
            </a>
          </p>

          <Link
            href="/find-a-room"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white text-sm font-bold tracking-wide uppercase rounded-xl hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
          >
            Search for your new room
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;