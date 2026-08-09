"use client"
import { Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import Image from 'next/image';

const HeroSection = () => {
  const [currentBg, setCurrentBg] = useState(0);

  // Background images for the auto-slider
  const bgImages = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop',      // Ensure these exist in your /public folder
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'
  ];

  

  // Auto-play logic for background slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(timer);
  }, [bgImages.length]);

  return (
    <>
      <section 
        className="relative min-h-200 md:min-h-150 h-200 md:h-162.5 w-full flex flex-col items-center justify-start pt-10 md:pt-20 mb-20 md:mb:0 bg-cover bg-center transition-all duration-1000 ease-in-out" 
        // style={{ backgroundImage: `url('${bgImages[currentBg]}')` }}
      >
        <Image
          src={bgImages[currentBg]}
          alt="Room rental in London"
          fill
          priority={currentBg === 0} // only first image preload
          sizes="100vw"
          className="object-cover transition-opacity duration-1000"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-285 mx-auto text-center text-white px-6">
          <div className="flex flex-col items-center">
            
            {/* Trophy Icon */}
            <div className="mb-3">
              <img src="/trophy.avif" alt="Trophy" className="w-12 h-10 " />
            </div>
            
            <p className="uppercase tracking-[0.2em] text-[11px] font-sans md:text-[14px] font-normal mb-2 opacity-90">
              London's #1 Room Rental Agency
            </p>

            {/* Stars Rating */}
            <div className="flex items-center gap-1.5 mb-4">
                <span className="text-xl font-thin text-white">(</span>

                <div className="flex items-center text-white gap-1">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                </div>

                <span className="text-xl font-thin text-white">)</span>
            </div>

            <h1 className="text-[34px] md:text-[55px] font-sans font-bold leading-[1.1] mb-5">
              Best <span className="text-[#F47C3C]">Rooms to Rent</span> for Students <br className="hidden md:block" />
               & Professionals in London
            </h1>
            
            {/* Description Text */}
            <p className="text-[14px] md:text-lg font-light font-sans opacity-90 max-w-82 md:max-w-lg mx-auto leading-relaxed">
              Browse affordable ensuite, single, and double rooms across London with flexible move-in options and all bills included.
            </p>
            
            {/* Slider Dots */}
            <div className="flex gap-2.5 mt-8">
              {bgImages.map((_, idx) => (
                <span 
                  key={idx}
                  className={`transition-all duration-300 rounded-full ${
                    currentBg === idx ? 'w-2.5 h-2.5 bg-[#F68B51]' : 'w-2 h-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FLOATING SEARCH BAR */}
        <Searchbar />
      </section>
      
      <div className="hidden md:block h-37.5 bg-white"></div>
    </>
  );
};

export default HeroSection;