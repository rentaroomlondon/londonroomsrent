"use client";
import React, { useState } from "react";
import { Heart, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useWishlist } from "@/app/utils/useWishlist";
import Link from "next/link";

const PropertyCard = ({ data }) => {
  const { isSaved, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-generate feature tags dynamically
  const generatedTags = [
    data.roomType === "double" && "Double Room",
    data.roomType === "single" && "Single Room",
    data.roomType === "ensuite" && "Ensuite",
    data.roomType === "studio" && "Studio",
    data.roomType === "ensuite_double" && "Ensuite Double",
    data.occupancy === "single" && "Single Use",
    data.occupancy === "double" && "Double Use",
    data.furnished && "Furnished",
    data.bathroomType === "private" && "Private Bath",
    data.bathroomType === "shared" && "Shared Bath",
  ].filter(Boolean);

  const image = data.images?.[0] || "/placeholder.png";
  const isWishlisted = isSaved(data._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist({
      id: data._id,
      title: data.title,
      price: data.monthlyPrice,
      image: data.images?.[0],
      address: data.location,
      slug: data.slug,
      listingId: data.listingId,
      availability: data.availableImmediately
        ? "Available Now"
        : "Check Availability",
      description: data.description,
    });
  };

  return (
    <div className="group relative w-full max-w-sm mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col overflow-hidden">
      
      {/* 🖼️ Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        
        {/* Skeleton Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        {/* Main Image with Zoom Effect */}
        <img
          src={image}
          alt={data.title}
          loading="eager"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder.png";
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          }`}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 opacity-80" />

        {/* Availability Badge (Top Left - Glassmorphic) */}
        {data.availableImmediately && (
          <div className="absolute top-4 left-4 backdrop-blur-md bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available Now
          </div>
        )}

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlist}
          aria-label="Save to wishlist"
          className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md bg-white/70 hover:bg-white border border-white/40 shadow-lg text-slate-700 hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "text-rose-500 fill-rose-500"
                : "text-slate-700 group-hover/btn:text-rose-500"
            }`}
          />
        </button>

        {/* Price Floating Overlay Badge (Bottom Left of Image) */}
        {data.monthlyPrice && (
          <div className="absolute bottom-4 left-4 backdrop-blur-md bg-slate-900/80 border border-white/10 text-white px-3.5 py-1.5 rounded-2xl shadow-xl flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight">£{data.monthlyPrice}</span>
            <span className="text-[11px] text-slate-300 font-medium">/mo</span>
          </div>
        )}
      </div>

      {/* 📄 Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate text-slate-500">
              {data.listingId && (
                <span className="font-semibold text-slate-700 mr-1">
                  #{data.listingId} ·
                </span>
              )}
              {data.location?.address ? `${data.location.address}, ${data.location.city}` : "Location on request"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-slate-900 font-bold text-lg leading-snug mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">
            {data.title}
          </h3>

          {/* Description */}
          {data.description && (
            <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
              {data.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {generatedTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[11px] font-medium border border-slate-100/80 shadow-2xs"
              >
                {tag}
              </span>
            ))}
            {generatedTags.length > 3 && (
              <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-amber-100">
                +{generatedTags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* 💳 Footer CTA Button */}
        <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Verified Property
          </div>

          <Link
            href={`/listings/${data.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all shadow-md hover:shadow-xl hover:gap-3 active:scale-95"
          >
            <span>View Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;