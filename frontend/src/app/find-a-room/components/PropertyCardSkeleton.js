"use client";
import React from "react";

const PropertyCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden animate-pulse">
      
      {/* 🖼️ Image Section Skeleton */}
      <div className="relative w-full aspect-[4/3] bg-slate-200">
        
        {/* Availability Badge Skeleton (Top Left) */}
        <div className="absolute top-4 left-4 h-7 w-28 bg-slate-300/80 rounded-full" />

        {/* Wishlist Button Skeleton (Top Right) */}
        <div className="absolute top-4 right-4 h-9 w-9 bg-slate-300/80 rounded-full" />

        {/* Price Floating Overlay Badge Skeleton (Bottom Left) */}
        <div className="absolute bottom-4 left-4 h-9 w-24 bg-slate-300/80 rounded-2xl" />
      </div>

      {/* 📄 Content Section Skeleton */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3.5 w-3.5 bg-slate-200 rounded-full flex-shrink-0" />
            <div className="h-3.5 w-3/4 bg-slate-200 rounded-md" />
          </div>

          {/* Title */}
          <div className="h-5 w-4/5 bg-slate-200 rounded-lg mb-3" />

          {/* Description (2 Lines) */}
          <div className="space-y-1.5 mb-4">
            <div className="h-3 w-full bg-slate-200 rounded-md" />
            <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* 💳 Footer CTA Button Skeleton */}
        <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
          {/* Verified Badge */}
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 bg-slate-200 rounded-full" />
            <div className="h-3 w-24 bg-slate-200 rounded-md" />
          </div>

          {/* View Room Button */}
          <div className="h-9 w-28 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;