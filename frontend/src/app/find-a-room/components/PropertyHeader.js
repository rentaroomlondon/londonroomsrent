"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Bus,
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Building,
} from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

const ROOM_OPTIONS = [
  { value: "", label: "Any Room Type" },
  { value: "single", label: "Single Room" },
  { value: "double", label: "Double Room" },
  { value: "ensuite", label: "Ensuite Room" },
  { value: "studio", label: "Studio Apartment" },
];

export default function PropertyHeader({ filters, setFilters, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Custom dropdown states
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const debounceRef = useRef(null);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const roomRef = useRef(null);

  // Helper function for postcode prefixes
  const getPostcodePrefix = (postcode) => {
    if (!postcode) return null;
    return postcode.split(" ")[0]; // NW2 1LX → NW2
  };

  // Helper function for formatting locations
  const formatLocation = (place) => {
    const a = place.address || {};
    const prefix = getPostcodePrefix(a.postcode);

    if (prefix) return prefix;
    if (a.suburb && a.city) return `${a.suburb}, ${a.city}`;
    if (a.city) return a.city;

    return place.display_name ? place.display_name.split(",")[0] : "";
  };

  // Debounced Location Handler
  const handleLocationChange = (e) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      search: value,
      lat: "",
      lng: "",
    }));

    clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setShowHint(true);
      setShowLocationDropdown(true);
      return;
    }

    setShowHint(false);
    setShowLocationDropdown(true);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${encodeURIComponent(
            value
          )}&format=json&limit=10&countrycodes=gb`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          const seen = new Set();
          const unique = [];

          data.forEach((place) => {
            const formatted = formatLocation(place);

            if (formatted && !seen.has(formatted)) {
              seen.add(formatted);
              unique.push({
                ...place,
                formatted,
              });
            }
          });

          setSuggestions(unique);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);
  };

  // Select Location Item
  const handleSelect = (place) => {
    const a = place.address || {};
    const prefix = getPostcodePrefix(a.postcode);

    setFilters((prev) => ({
      ...prev,
      search: prefix || a.city || a.town || place.formatted || "",
      lat: prefix ? place.lat : "",
      lng: prefix ? place.lon : "",
    }));

    setSuggestions([]);
    setShowHint(false);
    setShowLocationDropdown(false);
  };

  // Reset Filters / Fetch All
  const handleAllProperties = () => {
    const resetState = {
      search: "",
      lat: "",
      lng: "",
      minPrice: "",
      maxPrice: "",
      roomType: "",
      occupancy: "",
      furnished: "",
      date: "",
    };

    setFilters(resetState);
    setSuggestions([]);
    setShowHint(false);
    setShowLocationDropdown(false);

    onSearch(resetState);
  };

  // Outside Click Listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setShowPriceDropdown(false);
      }
      if (roomRef.current && !roomRef.current.contains(e.target)) {
        setShowRoomDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFiltersCount = [
    filters.search,
    filters.date,
    filters.roomType,
    filters.minPrice || filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <header className="w-full font-sans bg-slate-950 text-slate-100 border-b border-slate-800 shadow-2xl">
      {/* Top Banner (Desktop & Tablet) */}
      <div className="hidden lg:block bg-slate-900/80 border-b border-slate-800/60 py-2.5 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-400">
          <div className="flex items-center gap-6">
            <button
              onClick={handleAllProperties}
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <span className="p-1 rounded-md bg-red-500/10 group-hover:bg-red-500/20 text-red-400 transition">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span>All Properties</span>
            </button>

            {/* Static Badge 1: Travel Range */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>30 min travel range</span>
            </div>

            {/* Static Badge 2: Public Transport */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>Public transport routes</span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            UK Property Search Tool
          </div>
        </div>
      </div>

      {/* Main Bar (Desktop) */}
      <div className="hidden lg:block py-5 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-inner">
            {/* Location Input */}
            <div className="relative flex-[1.4]" ref={locationRef}>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-red-400 pointer-events-none" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={handleLocationChange}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Enter Postcode (e.g. NW2)..."
                  className="w-full bg-slate-800/80 border border-slate-700/60 focus:border-orange-500 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                {filters.search && (
                  <button
                    onClick={() =>
                      setFilters((p) => ({ ...p, search: "", lat: "", lng: "" }))
                    }
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showLocationDropdown &&
                filters.search.length > 0 &&
                (showHint || loadingSuggestions || suggestions.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    {showHint && (
                      <div className="p-3 text-xs text-slate-400">
                        Type at least 2 characters to search...
                      </div>
                    )}

                    {loadingSuggestions && (
                      <div className="p-3 flex items-center gap-2 text-xs text-slate-400">
                        <span className="animate-spin w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full"></span>
                        Finding locations...
                      </div>
                    )}

                    {!loadingSuggestions &&
                      suggestions.map((place, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelect(place)}
                          className="w-full text-left p-3 hover:bg-slate-800/80 transition flex items-center justify-between group border-b border-slate-800/50 last:border-0"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 shrink-0 transition" />
                            <span className="text-xs text-slate-200 truncate">
                              {place.formatted}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                            Location
                          </span>
                        </button>
                      ))}
                  </div>
                )}
            </div>

            {/* Date Input */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 w-4 h-4 text-orange-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.date || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full bg-slate-800/80 border border-slate-700/60 focus:border-orange-500 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Room Type Custom Select */}
            <div className="relative flex-1" ref={roomRef}>
              <button
                type="button"
                onClick={() => setShowRoomDropdown(!showRoomDropdown)}
                className="w-full bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-xl py-2.5 px-3.5 text-sm text-white flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {ROOM_OPTIONS.find((r) => r.value === filters.roomType)
                      ?.label || "Room Type"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showRoomDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50">
                  {ROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          roomType: opt.value,
                        }));
                        setShowRoomDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center justify-between transition"
                    >
                      <span>{opt.label}</span>
                      {filters.roomType === opt.value && (
                        <Check className="w-3.5 h-3.5 text-orange-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative flex-1" ref={priceRef}>
              <button
                type="button"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="w-full bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-xl py-2.5 px-3.5 text-sm text-white flex items-center justify-between transition-all"
              >
                <span className="truncate">
                  {filters.minPrice || filters.maxPrice
                    ? `£${filters.minPrice || 0} - £${
                        filters.maxPrice || "∞"
                      }`
                    : "Price Range"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showPriceDropdown && (
                <div className="absolute top-full left-0 w-72 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl mt-2 z-50 space-y-3">
                  <div className="text-xs font-semibold text-slate-400">
                    Monthly Rent Range (£)
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min £"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-slate-600">-</span>
                    <input
                      type="number"
                      placeholder="Max £"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPriceDropdown(false);
                      onSearch();
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg text-xs transition shadow-lg shadow-orange-500/20"
                  >
                    Apply Price
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={onSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center font-medium shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Top Header Bar */}
      <div className="lg:hidden p-4 space-y-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Mobile Postcode Input */}
          <div className="relative flex-1" ref={locationRef}>
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={handleLocationChange}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Enter postcode (e.g. NW2)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />

            {/* Mobile Location Suggestions */}
            {showLocationDropdown &&
              filters.search.length > 0 &&
              (showHint || loadingSuggestions || suggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {showHint && (
                    <div className="p-3 text-xs text-slate-400">
                      Enter at least 2 characters...
                    </div>
                  )}

                  {loadingSuggestions && (
                    <div className="p-3 flex items-center gap-2 text-xs text-slate-400">
                      <span className="animate-spin w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full"></span>
                      Searching...
                    </div>
                  )}

                  {!loadingSuggestions &&
                    suggestions.map((place, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(place)}
                        className="w-full text-left p-3 hover:bg-slate-800 transition text-xs border-b border-slate-800/60 last:border-0 flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-200">{place.formatted}</span>
                      </button>
                    ))}
                </div>
              )}
          </div>

          {/* Filter Toggle Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 hover:text-white relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Direct Search Trigger */}
          <button
            type="button"
            onClick={onSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={handleAllProperties}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {filters.roomType && (
            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 flex items-center gap-1">
              Room: {filters.roomType}
            </span>
          )}

          {(filters.minPrice || filters.maxPrice) && (
            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
              £{filters.minPrice || 0} - £{filters.maxPrice || "∞"}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-slate-900 h-full p-5 flex flex-col justify-between border-l border-slate-800">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                  Filter Options
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Date Filter */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Available From
                </label>
                <input
                  type="date"
                  value={filters.date || ""}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, date: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 [color-scheme:dark]"
                />
              </div>

              {/* Room Selection */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, roomType: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {ROOM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Inputs */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Price Limits (£)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, minPrice: e.target.value }))
                    }
                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                    }
                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileFilterOpen(false);
                  onSearch();
                }}
                className="w-full bg-orange-500 text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-orange-500/20"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleAllProperties}
                className="w-full bg-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl text-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}