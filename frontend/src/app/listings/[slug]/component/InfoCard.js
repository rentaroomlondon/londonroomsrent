import React from 'react';

const InfoCard = ({ label, value, type, isLast }) => {
  const icons = {
    double: "🛌",
    size: "📏",
    shared: "🏡",
    bath: "🚿",
    calendar: "📆",
    zap: "⚡",
    rating: "⚡",
  };

  const renderValue = () => {
    if (typeof value === 'string' && value.includes('m²')) {
      const number = value.replace('m²', '').trim();
      return (
        <span className="flex items-start justify-center">
          {number} m
          <sup className="text-[10px] mt-0.5 ml-0.5 font-bold">2</sup>
        </span>
      );
    }
    return value;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-3 md:p-5 flex-1 ${
        !isLast ? 'border-r border-gray-100 md:border-gray-200' : ''
      }`}
    >
      {/* ✅ ICON FIXED */}
      <div className="mb-2.5 text-[20px]">
        {icons[type] || "❓"}
      </div>

      <div className="font-[900] text-[#0C1F33] text-[14px] md:text-[16px] leading-tight text-center">
        {renderValue()}
      </div>

      <div className="text-[9px] md:text-[10px] text-[#7A8FA0] mt-1 font-bold uppercase tracking-tight text-center">
        {label}
      </div>
    </div>
  );
};

export default InfoCard;