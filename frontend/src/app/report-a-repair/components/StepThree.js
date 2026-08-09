"use client";

import uploadToCloudinary from "@/app/utils/uploadToCloudinary";
import React, { useState } from "react";

export default function StepThree({
  formData = {},
  setFormData,
  onBack,
  onSubmit,
  loading,
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Minimum required photos threshold
  const MIN_PHOTOS = 1;

  const priorityStyles = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Routine: "bg-amber-50 text-amber-700 border-amber-200",
    Urgent: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploaded = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file);
        uploaded.push(result.url);
      }

      setFormData({
        ...formData,
        photos: [...(formData.photos || []), ...uploaded],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index) => {
    const updated = (formData.photos || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photos: updated,
    });
  };

  const photoCount = (formData.photos || []).length;
  const isSubmitDisabled = loading || !isConfirmed || photoCount < MIN_PHOTOS;

  const InfoRow = ({ label, value, isBold = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-[#E8E4DF]/60 last:border-0 text-xs sm:text-sm">
      <span className="text-[#6B7280] font-medium">{label}</span>
      <span
        className={`text-right ${
          isBold ? "font-bold text-[#0F253B]" : "text-[#0F253B]/80"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );

  const SectionWrapper = ({ title, children }) => (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F253B]">
        {title}
      </h3>
      <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-4 sm:p-5">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47C3C] bg-[#F47C3C]/10 px-2.5 py-1 rounded-md">
              Step 3 of 3
            </span>
            <span className="text-xs text-[#6B7280]">Confirmation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#0F253B]">
            Review Your Repair Report
          </h2>
          <p className="text-[#6B7280] text-xs sm:text-sm">
            Please double-check all details below before submitting your request.
          </p>
        </div>
      </div>

      {/* 1. Problem Category & Urgency */}
      <SectionWrapper title="Problem Details">
        <div className="flex justify-between items-center py-3 border-b border-[#E8E4DF]/60">
          <span className="text-[#6B7280] text-xs sm:text-sm font-medium">Category</span>
          <span className="bg-[#F47C3C]/10 text-[#F47C3C] px-3 py-1 rounded-lg text-xs sm:text-sm font-bold border border-[#F47C3C]/20 flex items-center gap-1.5">
            <span>{formData.category || "🛠️ Maintenance"}</span>
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-[#E8E4DF]/60">
          <span className="text-[#6B7280] text-xs sm:text-sm font-medium">Priority Level</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
              priorityStyles[formData.priority] ||
              "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            ● {formData.priority || "Not specified"}
          </span>
        </div>

        <InfoRow label="Issue Started On" value={formData.issueStarted} />
      </SectionWrapper>

      {/* 2. Issue Description */}
      <SectionWrapper title="Problem Description">
        <p className="text-xs sm:text-sm text-[#0F253B] leading-relaxed whitespace-pre-line">
          {formData.description || "No description provided."}
        </p>
      </SectionWrapper>

      {/* 3. Your Contact & Property Info */}
      <SectionWrapper title="Your Information & Access">
        <InfoRow
          label="Full Name"
          value={`${formData.firstName || ""} ${formData.lastName || ""}`.trim()}
          isBold
        />
        <InfoRow label="Email Address" value={formData.email} isBold />
        <InfoRow label="Phone Number" value={formData.phone} isBold />
        <InfoRow label="Address / Room" value={formData.address} isBold />
        <InfoRow label="Preferred Contact Time" value={formData.contactTime} isBold />
        <InfoRow label="Access Permission" value={formData.access} isBold />
      </SectionWrapper>

      {/* 4. Attached Photos */}
      <SectionWrapper title="Attached Photos">
        <div className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {(formData.photos || []).map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden border border-[#E8E4DF] bg-white group"
              >
                <img
                  src={typeof photo === "string" ? photo : photo.url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Quick Upload Button */}
            <label className="aspect-square border-2 border-dashed border-[#E8E4DF] hover:border-[#F47C3C] bg-white rounded-xl flex flex-col items-center justify-center text-[#6B7280] hover:text-[#F47C3C] cursor-pointer transition-colors p-2 text-center">
              {uploading ? (
                <div className="w-4 h-4 border-2 border-[#F47C3C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-lg font-bold line-none">+</span>
                  <span className="text-[10px] font-medium hidden sm:inline">Add Photo</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddPhotos}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1">
            <span>{photoCount} photo(s) uploaded</span>
            {photoCount < MIN_PHOTOS && (
              <span className="text-amber-600 font-semibold">
                * Minimum {MIN_PHOTOS} photo required to submit
              </span>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Legal & Final Confirmation */}
      <div className="space-y-4 pt-2">
        <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-5 text-xs text-[#6B7280] leading-relaxed">
          <p>
            By submitting this repair request, you confirm that all provided details are accurate.
            <strong> LONDONROOMSRENT</strong> or authorized contractors may contact you to arrange entry access.
          </p>
          <p className="mt-2">
            For critical emergencies (e.g. active gas leak, major water burst), please reach our emergency hotline immediately. Read our{" "}
            <span className="text-[#F47C3C] font-semibold underline cursor-pointer">
              Repairs Policy
            </span>{" "}
            and{" "}
            <span className="text-[#F47C3C] font-semibold underline cursor-pointer">
              Privacy Notice
            </span>.
          </p>
        </div>

        {/* Checkbox agreement */}
        <label className="flex items-start gap-3 p-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#F47C3C] focus:ring-[#F47C3C] cursor-pointer"
          />
          <span className="text-xs font-medium text-[#0F253B]">
            I confirm that the details provided are accurate and agree to allow property access for necessary repairs.
          </span>
        </label>
      </div>

      {/* Submit Action */}
      <div className="space-y-4 pt-4 border-t border-[#E8E4DF]">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-4 px-6 rounded-xl text-xs sm:text-sm font-bold text-white uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
            isSubmitDisabled
              ? "bg-gray-300 cursor-not-allowed shadow-none"
              : "bg-[#F47C3C] hover:bg-[#e85e2f] active:bg-[#d65225] shadow-[#F47C3C]/20"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>🔧 Submit Repair Request</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        {/* Universal Back Button Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-[#E8E4DF] bg-white hover:bg-gray-50 text-[#0F253B] text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Details
          </button>
          <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">
            Step 3 of 3
          </span>
        </div>
      </div>
    </div>
  );
}