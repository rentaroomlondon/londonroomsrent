import React from "react";

const PropertyCardSkeleton = () => {
  return (
    <div className="relative h-full flex flex-col bg-[#fafafa] rounded-[28px] overflow-hidden border border-slate-200/60 animate-pulse">
      
      {/* IMAGE BLOCK SKELETON */}
      <div className="relative m-3 mb-0 rounded-[22px] overflow-hidden aspect-[4/3] bg-slate-200">
        
        {/* Availability Pill Skeleton (Top Left) */}
        <div className="absolute top-3 left-3 w-24 h-7 rounded-full bg-slate-300/80" />

        {/* Wishlist Button Skeleton (Top Right) */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-300/80" />

        {/* Price Floating Box Skeleton (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-slate-300/80 rounded-2xl w-28 h-12" />
      </div>

      {/* CONTENT SKELETON */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
        
        {/* Listing ID Skeleton */}
        <div className="h-3 w-16 bg-slate-200 rounded mb-1.5" />

        {/* Title Skeleton (2 lines) */}
        <div className="space-y-2">
          <div className="h-4 w-11/12 bg-slate-200 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
        </div>

        {/* Location Skeleton */}
        <div className="mt-3 flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-200 shrink-0" />
          <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
        </div>

        {/* Bottom Action Row Skeleton */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="h-3.5 w-20 bg-slate-200 rounded" />
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
        </div>

      </div>
    </div>
  );
};

export default PropertyCardSkeleton;