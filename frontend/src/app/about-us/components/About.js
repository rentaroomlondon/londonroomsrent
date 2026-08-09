import React from "react";
import Image from "next/image";
import { Sparkles, HeartHandshake, Building2, Quote } from "lucide-react";

const About = () => {
  const sections = [
    {
      step: "01",
      badge: "HOW WE STARTED",
      title: "How we started",
      text: [
        "London is an incredible place to live. It is about energy, innovation, aiming high and having a fantastic time.",
        "I will never forget arriving in Whitechapel in 2002. My cool, new London loft turned out to be the width of a single bed and so dirty it took me four days to get it clean.",
        "My friends said, 'Go on Jason, do it – and we will move in.' And two properties came my way.",
      ],
      image: "/About.avif",
      icon: <Sparkles className="w-5 h-5 text-[#F9A370]" />,
      quote: "It started with a single bed-width room in Whitechapel.",
      reverse: false,
    },
    {
      step: "02",
      badge: "OUR VALUES",
      title: "Why we genuinely care",
      text: [
        "It is very exciting to create something completely different and those first six months of LONDONROOMSRENT were some of the best of my life.",
        "I had met the amazing woman who became my wife and together we shaped LONDONROOMSRENT around values we believed in and wanted to live.",
        "We focused on trust, reliability, quality for money and being genuinely caring.",
        "By 2010 LONDONROOMSRENT was bigger than I could ever imagine. We invested again and we grew… and grew.",
      ],
      image: "/cleaner-window.avif",
      icon: <HeartHandshake className="w-5 h-5 text-[#F9A370]" />,
      quote: "Built around trust, reliability, and genuine care.",
      reverse: true,
    },
    {
      step: "03",
      badge: "TODAY",
      title: "We're friendly and easy to deal with",
      text: [
        "LONDONROOMSRENT is a big, friendly office in the heart of London's cutting-edge property scene.",
        "When I look around me, I am incredibly proud to be surrounded by a dream team who care deeply about our tenants and landlords.",
        "We focused on trust, reliability, quality for money and being genuinely caring.",
        "By 2010 LONDONROOMSRENT was bigger than I could ever imagine. We invested again and we grew… and grew.",
      ],
      image: "/woman-sitting.avif",
      icon: <Building2 className="w-5 h-5 text-[#F9A370]" />,
      quote: "Surrounded by a dream team in the heart of London.",
      reverse: false,
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-16 md:py-28 px-5 md:px-12 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#F9A370]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0A192F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F9A370]/15 border border-[#F9A370]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#e87d46] uppercase tracking-wider">
            <span>Our Journey</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            The Story Behind <br className="hidden sm:inline" />
            <span className="text-[#F9A370]">LONDONROOMSRENT</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            From humble beginnings in East London to one of the city's most trusted tenant-first property managers.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-20 md:space-y-32">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 lg:gap-16 relative ${
                section.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Container with Floating Card Elements */}
              <div className="w-full md:w-1/2 relative group">
                {/* Decorative Layer Background */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#F9A370]/20 to-[#0A192F]/10 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity opacity-70" />

                <div className="relative h-[320px] sm:h-[400px] md:h-[460px] w-full rounded-3xl overflow-hidden border border-[#E8E4DF] bg-white shadow-xl">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 via-transparent to-transparent" />

                  {/* Floating Quote Badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="p-2.5 bg-[#0A192F] rounded-xl text-[#F9A370] shrink-0">
                      <Quote className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-[#0A192F] leading-snug">
                      "{section.quote}"
                    </p>
                  </div>
                </div>

                {/* Step Number Stamp */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0A192F] text-[#F9A370] border-2 border-white font-black text-sm rounded-2xl flex items-center justify-center shadow-lg">
                  {section.step}
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 space-y-6">
                
                {/* Badge Header */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F9A370]/15 border border-[#F9A370]/30 shrink-0">
                    {section.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-[#F9A370] uppercase">
                    {section.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A192F] leading-tight">
                  {section.title}
                </h2>

                {/* Body Paragraphs */}
                <div className="space-y-3.5 border-l-2 border-[#E8E4DF] pl-4 sm:pl-6">
                  {section.text.map((p, i) => (
                    <p
                      key={i}
                      className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;