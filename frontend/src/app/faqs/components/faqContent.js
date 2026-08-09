"use client";

import React, { useState } from "react";

export const faqContent = {
  All: [
    {
      question: "How do I rent a room?",
      answer:
        "Simply browse available rooms on LONDONROOMSRENT and follow the booking steps. You can also contact our team for guidance through the process.",
    },
    {
      question: "Can I book without viewing the room?",
      answer:
        "We strongly recommend viewing the room before making any payment. If you're not in the UK, we can arrange a virtual viewing.",
    },
    {
      question: "Are reference checks required?",
      answer:
        "Yes, all tenants must complete reference checks within 3 days of booking.",
    },
    {
      question: "Are there extra costs besides rent?",
      answer:
        "Yes. This may include a holding deposit (one week's rent), a security deposit (five weeks' rent), and other potential charges such as lost keys or contract changes. Full details are provided before booking.",
    },
    {
      question: "Which bills are included in rent?",
      answer:
        "Your rent includes council tax, water, Wi-Fi, and cleaning of shared areas.",
    },
    {
      question: "Which bills are not included?",
      answer:
        "Gas, electricity, and heating are not included. These are shared among tenants based on usage.",
    },
    {
      question: "Is Wi-Fi available?",
      answer:
        "Yes, high-speed Wi-Fi is included in all LONDONROOMSRENT properties.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can email us anytime at info@LONDONROOMSRENT.co.uk for help or questions.",
    },
  ],

  Booking: [
    {
      question: "Can I book without seeing the room in person?",
      answer:
        "We recommend viewing first, but if you're abroad, we can arrange a live virtual tour.",
    },
    {
      question: "Do you run background or reference checks?",
      answer:
        "Yes, all tenants must complete referencing within 3 days of confirming a booking.",
    },
    {
      question: "What is a holding deposit?",
      answer:
        "A holding deposit equals one week's rent and is deducted from your first rent payment.",
    },
    {
      question: "What is a security deposit?",
      answer:
        "A security deposit equals five weeks' rent and is held to cover damages or unpaid rent.",
    },
  ],

  "Moving In": [
    {
      question: "What should I do before collecting keys?",
      answer:
        "Ensure your agreement is signed, payments are completed, and bring a valid photo ID when collecting your keys.",
    },
    {
      question: "Do you provide cleaning?",
      answer:
        "Yes, shared areas are cleaned regularly, and tenants are expected to maintain their own rooms.",
    },
    {
      question: "Are there house rules?",
      answer:
        "Yes, all tenants must agree to LONDONROOMSRENT house rules as part of their booking.",
    },
    {
      question: "Are pets or children allowed?",
      answer:
        "Unfortunately, pets and children are not permitted in shared properties.",
    },
  ],

  "During Stay": [
    {
      question: "How do I report maintenance issues?",
      answer:
        "You can report repairs through our website or by contacting our support team with full details.",
    },
    {
      question: "What happens if I lose my keys?",
      answer:
        "You will be responsible for replacement costs. If locks need changing, additional charges may apply.",
    },
    {
      question: "What if I get locked out?",
      answer:
        "During working hours, contact support. After hours, you may need to call a locksmith at your own expense.",
    },
    {
      question: "Can I move to another property?",
      answer:
        "Yes, depending on availability, LONDONROOMSRENT can help you relocate to another room.",
    },
  ],

  "Moving Out": [
    {
      question: "When does my rent responsibility end?",
      answer:
        "Your responsibility continues until your tenancy ends and all keys are returned.",
    },
    {
      question: "How should I leave my room?",
      answer:
        "Remove all belongings and leave the room and shared areas clean to avoid extra charges.",
    },
    {
      question: "What do I do with my keys?",
      answer:
        "All keys must be returned to us. Rent may still apply until keys are received.",
    },
    {
      question: "When is the property inspected?",
      answer:
        "Inspections are carried out within one working day after keys are returned.",
    },
    {
      question: "When will I get my deposit back?",
      answer:
        "Deposits are usually returned within 10 days after move-out, subject to inspection.",
    },
  ],

  Payments: [
    {
      question: "How can I pay rent?",
      answer:
        "Rent is usually paid monthly via standing order. Alternative secure payment methods are also available.",
    },
    {
      question: "Are there penalties for late rent?",
      answer:
        "Late payments may incur interest charges based on applicable rates.",
    },
    {
      question: "Can I end my contract early?",
      answer:
        "Yes, but you may be responsible for re-letting costs and rent until a replacement tenant is found.",
    },
    {
      question: "Can I change my contract?",
      answer:
        "Yes, contract changes can be made for a small administrative fee.",
    },
  ],
};

const categories = [
  "All",
  "Booking",
  "Moving In",
  "During Stay",
  "Moving Out",
  "Payments",
];

export default function DynamicFaq() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  const activeFaqs = faqContent[activeCategory] || [];

  return (
    <section className="w-full bg-[#FAF8F5] py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid: Perfectly Aligned 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Category Navigation (4 Columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="space-y-2 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FF7A45]/10 text-[#FF7A45] text-xs font-semibold uppercase tracking-wider">
                Support Centre
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#1A1A1A] leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">
                Click on a category below to explore topics regarding your room rental.
              </p>
            </div>

            {/* Category Button List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = faqContent[cat]?.length || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border text-left ${
                      isActive
                        ? "bg-[#1A2332] text-white border-[#1A2332] shadow-md"
                        : "bg-white text-[#4B5563] border-[#E8E4DF] hover:border-[#FF7A45]/50 hover:text-[#FF7A45]"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-mono shrink-0 ${
                        isActive
                          ? "bg-[#FF7A45] text-white"
                          : "bg-[#F3EFEA] text-[#6B7280]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Direct Support Card */}
            <div className="hidden lg:block p-5 rounded-xl bg-white border border-[#E8E4DF] space-y-2 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF7A45]">
                Need Direct Assistance?
              </p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Can't find what you're looking for? Email our support team anytime.
              </p>
              <a
                href="mailto:info@LONDONROOMSRENT.co.uk"
                className="inline-block text-xs font-semibold text-[#1A1A1A] underline hover:text-[#FF7A45] transition-colors"
              >
                info@LONDONROOMSRENT.co.uk
              </a>
            </div>
          </div>

          {/* Right Column: FAQ Accordion Stack (8 Columns) */}
          <div className="lg:col-span-8 space-y-3">
            {activeFaqs.map((item, index) => {
              const isOpen = openIndex === index;
              const formattedNumber = index < 9 ? `0${index + 1}` : index + 1;

              return (
                <div
                  key={`${activeCategory}-${index}`}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#FF7A45] shadow-sm"
                      : "border-[#E8E4DF] hover:border-[#FF7A45]/40"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Fixed Index Numbering for Perfect Vertical Alignment */}
                      <span
                        className={`w-6 sm:w-8 text-xs sm:text-sm font-mono font-bold shrink-0 transition-colors ${
                          isOpen ? "text-[#FF7A45]" : "text-[#9CA3AF]"
                        }`}
                      >
                        {formattedNumber}
                      </span>

                      {/* Question Text */}
                      <span className="text-xs sm:text-sm md:text-base font-semibold text-[#1A1A1A] leading-snug">
                        {item.question}
                      </span>
                    </div>

                    {/* Toggle Icon */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-[#FF7A45] text-white rotate-45"
                          : "bg-[#FAF8F5] text-[#6B7280]"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Body with Smooth Expansion */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-5 px-4 sm:px-5 pl-13 sm:pl-17"
                        : "grid-rows-[0fr] opacity-0 pb-0 px-4 sm:px-5"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-2 border-t border-[#E8E4DF]/60">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}