"use client";
import React from "react";

// 🔥 LABEL MAPS
const ROOM_TYPE_MAP = {
  single: "Single Room",
  double: "Double Room",
  ensuite: "Ensuite Room",
  ensuite_double: "Ensuite Double Room",
  studio: "Studio",
};

const OCCUPANCY_MAP = {
  single: "Single Occupancy",
  double: "Double Occupancy",
};

// 🎨 TAG STYLE SYSTEM (scalable)
const TAG_STYLES = {
  default: "bg-[#FEF0E8] text-[#F47C3C]",
  green: "bg-[#E3F9EE] text-[#0F9455]",
  blue: "bg-[#0C1F3312] text-[#162E48]",
  purple: "bg-[#EBF3FF] text-[#2B7FFF]",
  orange: "bg-[#FEF5DC] text-[#F0A500]",
};

// ✅ COMPONENT
const Tags = ({ listing }) => {
  if (!listing) return null;

  const bills = listing.billsIncluded || {};

  // ✅ Bills Logic (wifi optional)
  const isBillsIncluded =
    bills.electricity && bills.gas && bills.water;

  const hasWifi = bills.wifi === true;

  // 🔥 TAG LIST (ALL LOGIC HERE)
  const tags = [
    {
      label: ROOM_TYPE_MAP[listing.roomType] || "Room",
      style: "default",
    },
    {
      label: OCCUPANCY_MAP[listing.occupancy],
      style: "blue",
    },
    {
      label: isBillsIncluded ? "Bills Included" : null,
      style: "green",
    },
    {
      label: hasWifi
        ? `WiFi`
        : null,
      style: "purple",
    },
    {
      label: listing.furnished ? "Furnished" : "Unfurnished",
      style: listing.furnished ? "orange" : "default",
    },
  ].filter((tag) => tag.label); // remove nulls

  return (
    <div className="flex gap-2 mb-4 mt-4 md:mt-0 overflow-x-auto no-scrollbar whitespace-nowrap md:flex-wrap md:overflow-visible">
        {tags.map((tag, index) => (
        <span
            key={index}
            className={`inline-block px-3 py-1 rounded-full md:text-[12px] text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[tag.style]}`}
        >
            {tag.label}
        </span>
        ))}
    </div>
  );
};

export default Tags;