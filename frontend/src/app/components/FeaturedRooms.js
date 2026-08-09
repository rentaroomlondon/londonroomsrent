"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "../Shared/PropertyCard";
import PropertyCardSkeleton from "../Shared/PropertyCardSkeleton";

const FeaturedRooms = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const apiFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "API Error");
      }

      return data;
    } catch (err) {
      console.error("Fetch Error:", err.message);
      throw err;
    }
  };

  const fetchFeatured = async () => {
    try {
      setError(null);
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/featured`
      );

      const formatted = res.listings.map((item) => ({
        id: item._id,
        listingId: item.listingId,
        slug: item.slug,
        title: item.title,
        description: item.description || "No description available",
        location: `${item.location?.address || ""}, ${
          item.location?.postcode || ""
        }`,
        price: item.monthlyPrice ? `£${item.monthlyPrice}` : "N/A",
        availability: item.availableImmediately
          ? "Available NOW"
          : item.availableFrom
          ? `From ${new Date(item.availableFrom).toLocaleDateString()}`
          : "Check availability",
        imageUrl:
          item.images?.[0] ||
          "https://via.placeholder.com/400x300?text=No+Image",
      }));

      setProperties(formatted);
    } catch (err) {
      setError("Unable to load featured rooms right now.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const limitedProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  return (
    <section className="relative py-16 md:py-24 bg-slate-50 overflow-hidden">
      {/* subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-14">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-orange-500 mb-2">
              Hand-picked
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="text-orange-500">Rooms</span>
            </h2>
            <p className="mt-2 text-slate-500 text-base max-w-lg">
              A selection of our latest available properties across London
            </p>
          </div>

          {/* Optional "View all" link – keep or remove as needed */}
          {!loading && properties.length > 0 && (
            <a
              href="/find-a-room"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-slate-700 hover:text-orange-500 transition-colors"
            >
              View all rooms
              <svg
                className="ml-1.5 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <>
            {/* Mobile */}
            <div className="grid grid-cols-1 gap-5 lg:hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchFeatured}
              className="mt-4 text-sm font-semibold text-red-700 hover:text-red-800 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && limitedProperties.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-slate-500 text-lg">
              No featured rooms available at the moment.
            </p>
            <a
              href="/find-a-room"
              className="mt-4 inline-block text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              Browse all rooms →
            </a>
          </div>
        )}

        {/* Property Grid */}
        {!loading && !error && limitedProperties.length > 0 && (
          <>
            {/* Mobile – stacked cards */}
            <div className="grid grid-cols-1 gap-5 lg:hidden">
              {limitedProperties.map((prop) => (
                <PropertyCard key={prop.id} {...prop} />
              ))}
            </div>

            {/* Desktop – 3 column grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8">
              {limitedProperties.map((prop) => (
                <PropertyCard key={prop.id} {...prop} />
              ))}
            </div>
          </>
        )}

        {/* Show More */}
        {!loading && !error && hasMore && (
          <div className="flex justify-center mt-12 md:mt-14">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-800 font-semibold rounded-xl shadow-sm hover:border-orange-400 hover:text-orange-600 hover:shadow-md transition-all duration-300"
            >
              Show more rooms
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRooms;