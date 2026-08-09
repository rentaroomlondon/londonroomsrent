"use client";

import uploadToCloudinary from "@/app/utils/uploadToCloudinary";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function StepTwo({ formData, setFormData, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Minimum required photos threshold (adjust if 10 was intentional)
  const MIN_PHOTOS = 1; 

  const priorities = [
    {
      label: "Low",
      color: "bg-emerald-500",
      activeBg: "bg-emerald-50 border-emerald-500 ring-emerald-500/20",
      sub: "Minor issue, daily life unaffected",
    },
    {
      label: "Routine",
      color: "bg-amber-500",
      activeBg: "bg-amber-50 border-amber-500 ring-amber-500/20",
      sub: "Needs attention soon",
    },
    {
      label: "Urgent",
      color: "bg-rose-500",
      activeBg: "bg-rose-50 border-rose-500 ring-rose-500/20",
      sub: "Safety or living conditions impacted",
    },
  ];

  const handleNext = () => {
    if (!formData.description?.trim()) {
      toast.error("Please describe the problem before proceeding.");
      return;
    }
    if ((formData.photos || []).length < MIN_PHOTOS) {
      toast.info(`Please upload at least ${MIN_PHOTOS} photo(s) of the issue.`);
      return;
    }
    onNext();
  };

  const uploadFiles = async (files) => {
    try {
      setUploading(true);
      for (const file of files) {
        const tempUrl = URL.createObjectURL(file);
        const tempId = Date.now() + Math.random();

        setFormData((prev) => ({
          ...prev,
          photos: [
            ...(prev.photos || []),
            { url: tempUrl, loading: true, id: tempId },
          ],
        }));

        const result = await uploadToCloudinary(file);

        setFormData((prev) => ({
          ...prev,
          photos: (prev.photos || []).map((p) =>
            p.id === tempId
              ? { url: result.url, loading: false, id: tempId }
              : p
          ),
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    const updated = [...(formData.photos || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, photos: updated });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Bar & Selected Category Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47C3C] bg-[#F47C3C]/10 px-2.5 py-1 rounded-md">
              Step 2 of 3
            </span>
            <span className="text-xs text-[#6B7280]">Issue Details</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#0F253B]">
            Describe the Issue
          </h2>
          <p className="text-[#6B7280] text-xs sm:text-sm">
            Provide key details so our team can dispatch the right assistance.
          </p>
        </div>

        {/* Selected Category Pill */}
        <div className="flex items-center justify-between sm:justify-end gap-3 bg-[#FAF8F5] border border-[#E8E4DF] px-4 py-2.5 rounded-xl shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F253B]">
            <span className="text-xs text-[#6B7280]">Category:</span>
            <span className="text-[#F47C3C] font-bold">{formData.category || "Not selected"}</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#0F253B] underline transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* 1. Urgency Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#0F253B] uppercase tracking-wider block">
          How urgent is this issue? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {priorities.map((p) => {
            const isSelected = formData.priority === p.label;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setFormData({ ...formData, priority: p.label })}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 ${
                  isSelected
                    ? `${p.activeBg} ring-2 border-transparent shadow-sm`
                    : "border-[#E8E4DF] bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <span className="font-bold text-sm text-[#0F253B]">
                      {p.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[#F47C3C] text-xs font-bold">✓ Selected</span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">{p.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Problem Description & Date */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#0F253B] uppercase tracking-wider mb-2 block">
            What is wrong? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl p-4 text-xs sm:text-sm text-[#0F253B] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#F47C3C] focus:ring-4 focus:ring-[#F47C3C]/10 transition-all duration-200 resize-y"
            placeholder="Please detail the location, severity, and specific symptoms (e.g., Leaking pipe under main kitchen sink when tap runs)..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="max-w-xs">
          <label className="text-xs font-bold text-[#0F253B] uppercase tracking-wider mb-2 block">
            When did the issue start?
          </label>
          <input
            type="date"
            className="w-full bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:bg-white focus:border-[#F47C3C] focus:ring-4 focus:ring-[#F47C3C]/10 transition-all duration-200"
            value={formData.issueStarted}
            onChange={(e) =>
              setFormData({ ...formData, issueStarted: e.target.value })
            }
          />
        </div>
      </div>

      {/* 3. Contact & Access Details */}
      <div className="bg-[#FAF8F5] border border-[#E8E4DF] p-5 sm:p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-[#0F253B] uppercase tracking-wider border-b border-[#E8E4DF] pb-3">
          Contact & Property Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              First Name
            </label>
            <input
              type="text"
              className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              Last Name
            </label>
            <input
              type="text"
              className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              Phone Number
            </label>
            <PhoneInput
              country={"gb"}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              containerClass="!w-full"
              inputClass="!w-full !h-[44px] !bg-white !border !border-[#E8E4DF] !rounded-xl !pl-12 !text-xs sm:!text-sm"
              buttonClass="!border-none !bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
            Room / Property Address
          </label>
          <input
            type="text"
            className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              Preferred Contact Time
            </label>
            <input
              type="text"
              placeholder="e.g. Mornings before 11 AM"
              className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
              value={formData.contactTime}
              onChange={(e) =>
                setFormData({ ...formData, contactTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase mb-1 block">
              Access Permission
            </label>
            <input
              type="text"
              placeholder="e.g. Master key authorized / Someone home"
              className="w-full bg-white border border-[#E8E4DF] rounded-xl p-3 text-xs sm:text-sm text-[#0F253B] focus:outline-none focus:border-[#F47C3C]"
              value={formData.access}
              onChange={(e) =>
                setFormData({ ...formData, access: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* 4. Photo Upload Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#0F253B] uppercase tracking-wider">
            Attach Photos
          </label>
          <span className="text-xs text-[#6B7280]">
            {(formData.photos || []).length} file(s) attached
          </span>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-[#F47C3C] bg-[#F47C3C]/5"
              : "border-[#E8E4DF] bg-[#FAF8F5] hover:border-[#F47C3C]/50"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length) uploadFiles(files);
            }}
            className="hidden"
            id="photoUpload"
          />

          <label htmlFor="photoUpload" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E8E4DF] mx-auto flex items-center justify-center text-xl shadow-sm">
              📷
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#0F253B]">
              {uploading ? "Uploading photos..." : "Click or drag photos here"}
            </p>
            <p className="text-[11px] text-[#6B7280]">
              JPG, PNG or HEIC files (up to 10MB each)
            </p>
          </label>
        </div>

        {/* Photo Gallery Grid */}
        {(formData.photos || []).length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
            {formData.photos.map((photo, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border border-[#E8E4DF] bg-gray-100"
              >
                <img
                  src={typeof photo === "string" ? photo : photo.url}
                  alt={`Attachment ${index + 1}`}
                  className={`w-full h-full object-cover transition-opacity ${
                    photo.loading ? "opacity-40 blur-xs" : "opacity-100"
                  }`}
                />

                {photo.loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!photo.loading && (
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-[#E8E4DF] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 border border-[#E8E4DF] bg-white hover:bg-gray-50 text-[#0F253B] text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3.5 bg-[#F47C3C] hover:bg-[#e85e2f] active:bg-[#d65225] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#F47C3C]/20 transition-all duration-200 flex items-center gap-2"
        >
          <span>Next: Review & Confirm</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  );
}