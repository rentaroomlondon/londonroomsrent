"use client";

import React, { useState } from "react";
import { Heart, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "../utils/useWishlist";

const PropertyCard = ({
  id,
  slug,
  listingId,
  title,
  location,
  price,
  availability,
  description = "",
  imageUrl,
}) => {
  const { isSaved, toggleWishlist, isLoaded } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id,
      slug,
      listingId,
      title,
      location,
      price,
      availability,
      description,
      imageUrl,
    });
  };

  const saved = isLoaded && isSaved(id);
  const isNow = availability?.toLowerCase().includes("now");

  return (
    <Link href={`/listings/${slug}`} className="block group h-full">
      <article className="relative h-full flex flex-col bg-[#fafafa] rounded-[28px] overflow-hidden border border-slate-200/60 transition-all duration-500 hover:border-slate-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)]">
        
        {/* IMAGE BLOCK */}
        <div className="relative m-3 mb-0 rounded-[22px] overflow-hidden aspect-[4/3] bg-slate-200">
          {/* Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
          )}

          <img
            src={imageUrl}
            alt={title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Dark gradient at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          {/* Availability pill */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide shadow-sm ${
                isNow
                  ? "bg-emerald-500 text-white"
                  : "bg-white/95 text-slate-800 backdrop-blur"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isNow ? "bg-white" : "bg-slate-400"
                }`}
              />
              {availability}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleSave}
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              saved
                ? "bg-white text-rose-500 shadow-md"
                : "bg-black/30 text-white backdrop-blur-md hover:bg-white hover:text-rose-500"
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={saved ? "fill-current" : ""}
            />
          </button>

          {/* Price floating on image (unique touch) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none mb-1">
                From
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {price}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  /mo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
          {/* Listing ID */}
          {listingId && (
            <p className="text-[10px] font-medium text-slate-400 tracking-[0.12em] uppercase mb-1.5">
              {listingId}
            </p>
          )}

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <MapPin
              size={13}
              className="shrink-0 text-orange-500"
              strokeWidth={2.5}
            />
            <p className="text-[13px] text-slate-500 leading-tight line-clamp-1">
              {location}
            </p>
          </div>

          {/* Bottom action row */}
          <div className="mt-auto pt-5 flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              View details
            </span>

            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;