"use client";

import { useState } from "react";

const categories = [
  { id: "bathroom", label: "Bathroom & Toilet", icon: "🚿" },
  { id: "kitchen", label: "Kitchen Appliances", icon: "🍳" },
  { id: "heating", label: "Heating & Boiler", icon: "🔥" },
  { id: "water", label: "Water & Leaks", icon: "💧" },
  { id: "doors", label: "Doors, Garages & Locks", icon: "🚪" },
  { id: "floors", label: "Walls, Floors & Ceilings", icon: "🧱" },

  { id: "lighting", label: "Lighting Fixtures", icon: "💡" },
  { id: "window", label: "Windows & Glazing", icon: "🖼️" },
  { id: "garden", label: "Exterior & Garden", icon: "🌿" },
  { id: "laundry", label: "Laundry Appliances", icon: "🧺" },
  { id: "furniture", label: "Furniture & Fittings", icon: "🪑" },
  { id: "electricity", label: "Electrical Supply", icon: "⚡" },

  { id: "internet", label: "Wi-Fi & Broadband", icon: "📶" },
  { id: "alarm", label: "Alarms & Detectors", icon: "🔔" },
  { id: "pests", label: "Pests & Vermin", icon: "🐀" },
  { id: "roof", label: "Roof & Guttering", icon: "🏠" },
  { id: "shared", label: "Communal Areas", icon: "🏢" },
  { id: "meters", label: "Utility Meters", icon: "📊" },

  { id: "stairs", label: "Stairs & Handrails", icon: "🪜" },
  { id: "services", label: "Property Services", icon: "🏡" },
  { id: "gas", label: "Smell Gas?", icon: "⚠️", isUrgent: true },
  { id: "oil", label: "Smell Oil?", icon: "🛢️", isUrgent: true },
  { id: "fire", label: "Fire Hazard", icon: "🧯", isUrgent: true },
  { id: "other", label: "Other Issue", icon: "❓" },
];

export default function StepOne({ formData, setFormData, onNext }) {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F47C3C] bg-[#F47C3C]/10 px-2.5 py-1 rounded-md">
            Step 1 of 3
          </span>
          <span className="text-xs text-[#6B7280]">Select category</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#0F253B]">
          What needs fixing?
        </h2>
        <p className="text-[#6B7280] text-xs sm:text-sm">
          Select the option that best describes the issue in your property.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search issue (e.g. leak, heater, key, lock)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl pl-11 pr-10 py-3.5 text-xs sm:text-sm text-[#0F253B] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#F47C3C] focus:ring-4 focus:ring-[#F47C3C]/10 transition-all duration-200"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => {
            const isSelected = formData.category === cat.label;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    category: cat.label,
                  }))
                }
                className={`relative p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 group ${
                  isSelected
                    ? "border-[#F47C3C] bg-[#F47C3C]/5 ring-2 ring-[#F47C3C]/20 shadow-sm"
                    : cat.isUrgent
                    ? "border-amber-200 bg-amber-50/40 hover:border-amber-400"
                    : "border-[#E8E4DF] bg-white hover:border-[#F47C3C]/40 hover:shadow-sm"
                }`}
              >
                {/* Active Selection Badge Icon */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl p-2 rounded-lg bg-[#FAF8F5] group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#F47C3C] text-white scale-100"
                        : "border border-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Label Title */}
                <span
                  className={`text-xs sm:text-sm font-semibold leading-tight transition-colors ${
                    isSelected ? "text-[#F47C3C]" : "text-[#0F253B]"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No categories found matching "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-xs font-semibold text-[#F47C3C] underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="pt-4 border-t border-[#E8E4DF] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#6B7280] text-center sm:text-left">
          {formData.category ? (
            <span className="flex items-center gap-1.5 font-medium text-[#0F253B]">
              <span className="w-2 h-2 rounded-full bg-[#18B26A]" />
              Selected: <strong className="text-[#F47C3C]">{formData.category}</strong>
            </span>
          ) : (
            <span>Please select one category to continue.</span>
          )}
        </div>

        <button
          type="button"
          disabled={!formData.category}
          onClick={onNext}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#F47C3C] hover:bg-[#e85e2f] active:bg-[#d65225] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#F47C3C]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          <span>Next: Add Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  );
}