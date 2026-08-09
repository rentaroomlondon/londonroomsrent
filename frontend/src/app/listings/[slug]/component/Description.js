import React, { useState } from 'react';

const Description = ({ text }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    /* Mobile: Full width, no rounded corners, border top and bottom only.
       Desktop: Rounded-xl, full border, and shadow.
    */
    <div className="bg-white border-y py-4 md:py-0 md:border md:rounded-[20px] border-gray-200 md:shadow-sm overflow-hidden transition-all">
      
      {/* Header with the specific border seen in desktop screenshot */}
      <div className="px-1 py-4 md:px-8 md:py-6 md:border-b md:border-gray-100">
        <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
          About This Room
        </h2>
      </div>

      {/* Content Area */}
      <div className="px-1 py-2 md:p-8">
        <div
          className={`text-[#5E6D7C] leading-[1.7] text-[15px] ${
            !showFull ? "line-clamp-6 md:line-clamp-none" : ""
          }`}
        >
          <p className="whitespace-pre-line">
            {text}
          </p>
        </div>

        {/* Toggle Button - hidden on desktop if you don't want line-clamping there */}
        <button
          onClick={() => setShowFull(!showFull)}
          className="group flex items-center text-[#F07D3D] font-bold mt-5 text-[14px] hover:opacity-80 transition-opacity"
        >
          {showFull ? "Show less" : "Read more"}
          <span className="ml-1 text-[8px] transform translate-y-[1px]">
             {showFull ? '▲' : '▼'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Description;