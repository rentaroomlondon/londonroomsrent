import React from 'react';
import { ArrowRight } from 'lucide-react'; // Optional: for the button icon

const steps = [
  {
    number: 1,
    title: "Register with Us",
    description: "When you register, a Letting Consultant will propose all suitable rooms based on budget, travel time and more. You'll receive personalised suggestions."
  },
  {
    number: 2,
    title: "Viewing",
    description: "View rooms you're interested in before booking. A holding deposit is required to proceed."
  },
  {
    number: 3,
    title: "Reference & Contract",
    description: "References needed within 3 days. Agreement formed within 14 days. We send all documents including the how-to-rent guide, gas certificate, EICR, EPC."
  },
  {
    number: 4,
    title: "Move In",
    description: "Our team prepares your room. An inventory clerk carries out a Check In shortly after. You receive a copy of the report and deposit protection information."
  },
  {
    number: 5,
    title: "During Your Stay",
    description: "Report all repairs through Fixflo. You have a dedicated property manager and are responsible for rent and utility split bills."
  },
  {
    number: 6,
    title: "Move Out",
    description: "We contact you 3 months before tenancy ends. After moving out, we're in touch within 10 days about your deposit."
  }
];

export default function MobileHowItWorks() {
  return (
    <section className="px-[18px] py-[36px]">
      <div className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.number}
            className="flex gap-4 p-5 border border-[#E8E4DF] rounded-[14px] bg-white"
          >
            {/* Circle Number */}
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#F47C3C] font-playfair flex items-center justify-center text-white font-extrabold text-lg">
                {step.number}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-[#0F253B] font-sans font-bold text-base leading-tight">
                {step.title}
              </h3>
              <p className="text-[#6B7280] text-[13px] font-sans font-normal leading-[20.8px] tracking-[0]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer & CTA */}
      <div className="mt-8 text-center space-y-6">
        <p className="text-gray-500 text-sm">
          For assistance: <a href="mailto:info@LONDONROOMSRENT.co.uk" className="text-[#f48142] underline">info@info@LONDONROOMSRENT.co.uk</a>
        </p>
        
        <button className="w-full bg-[#f48142] hover:bg-[#e06d2f] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wide text-sm">
          Search for your new room
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}