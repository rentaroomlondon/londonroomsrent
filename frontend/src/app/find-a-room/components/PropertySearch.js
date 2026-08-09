"use client";

import React, { useEffect, useState } from "react";
import PropertyHeader from "./PropertyHeader";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

export default function PropertySearchPage() {
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    lat: "",
    lng: "",
    radius: 5,
    roomType: "",
    date: "",
    minPrice: "",
    maxPrice: "",
    start: "",
    travelLat: "",
    travelLng: "",
    maxTime: "",
    transport: "",
  });

  // ===============================
  // LOAD FROM URL
  // ===============================
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    const newFilters = {
      search: params.search || "",
      lat: params.lat || "",
      lng: params.lng || "",
      radius: params.radius || 5,
      roomType: params.roomType || "",
      date: params.date || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
      start: params.start || "",
      travelLat: params.travelLat || "",
      travelLng: params.travelLng || "",
      maxTime: params.maxTime || "",
      transport: params.transport || "",
    };

    setFilters(newFilters);
    fetchListings(newFilters);
  }, [searchParams]);

  // ===============================
  // FETCH FUNCTION
  // ===============================
  const fetchListings = async (customFilters = filters) => {
    try {
      setLoading(true);

      let queryObj = { ...customFilters };

      // remove empty fields
      Object.keys(queryObj).forEach(
        (key) =>
          (queryObj[key] === "" || queryObj[key] === null) &&
          delete queryObj[key]
      );

      // remove geo if missing
      if (!queryObj.lat || !queryObj.lng) {
        delete queryObj.lat;
        delete queryObj.lng;
      }

      const query = new URLSearchParams(queryObj).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/search?${query}`
      );

      const data = await res.json();
      setRooms(data.listings || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const locationLabel =
    filters.search?.split(",")[0]?.trim() || "London";

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-slate-900 antialiased">
      {/* Sticky Header */}
      <PropertyHeader
        filters={filters}
        setFilters={setFilters}
        onSearch={() => fetchListings()}
      />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* ─────────────────────────────────────────
            LEFT: Listings Panel
        ───────────────────────────────────────── */}
        <div className="w-full lg:w-[58%] xl:w-[60%] 2xl:w-[62%]">
          <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">
            {/* Results Header */}
            <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400 mb-1.5">
                  Available now
                </p>
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
                  <span className="text-[#E85D04]">{rooms.length}</span>
                  <span className="text-slate-400 font-normal mx-1.5">·</span>
                  Rooms in{" "}
                  <span className="capitalize">{locationLabel}</span>
                </h1>
              </div>

              {!loading && rooms.length > 0 && (
                <p className="text-sm text-slate-500">
                  Showing all matching results
                </p>
              )}
            </div>

            {/* Mobile Map */}
            <div className="lg:hidden mb-7">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <MapView listings={rooms} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>
            </div>

            {/* Content States */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-16 sm:py-20 text-center shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-amber-50/80 to-transparent rounded-full blur-3xl -z-0" />
                <div className="relative z-10 max-w-sm mx-auto">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    No rooms found
                  </h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-500">
                    Try widening your search radius, adjusting the price range,
                    or changing the location.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                {rooms.map((room) => (
                  <PropertyCard key={room._id} data={room} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────
            RIGHT: Sticky Map Panel (Desktop)
        ───────────────────────────────────────── */}
        <div className="hidden lg:block lg:flex-1 relative">
          <div className="sticky top-[88px] h-[calc(100vh-88px)] border-l border-slate-200/60">
            <div className="absolute inset-0 bg-[#F8F7F4]">
              <MapView listings={rooms} />
            </div>

            {/* Soft edge overlay */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#F8F7F4]/80 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}