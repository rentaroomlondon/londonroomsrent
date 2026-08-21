'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Check, 
  Share2, 
  Mail, 
  MessageCircle, 
  Heart, 
  Lock, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { useWishlist } from '@/app/utils/useWishlist';
import BookingModal from './BookingModal';
import { analytics } from '@/app/utils/analytics';

const PricingCard = ({ listing, monthlyPrice }) => {
  const { isSaved, toggleWishlist, isLoaded } = useWishlist();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const propertyId = listing?._id || listing?.id;
  const listingRef = listing?.listingId;
  const propertyName = listing?.title || listing?.name || "Unknown Property";

  // Fire property_view once when the component mounts
  useEffect(() => {
    if (propertyId) {
      analytics.propertyView({
        property_id: propertyId,
        listing_ref: listingRef,
        room_type: listing?.roomType,
        price: monthlyPrice,
      });
    }
  }, [propertyId, listingRef, listing?.roomType, monthlyPrice]);

  const handleSave = () => {
    const currentlySaved = isLoaded && isSaved(propertyId);

    toggleWishlist({
      id: propertyId,
      slug: listing?.slug,
      title: listing?.title,
      price: monthlyPrice,
      location: listing?.location?.address,
      imageUrl: listing?.images?.[0],
      listingId: listing?.listingId,
      availability: listing?.availableImmediately
        ? "Available NOW"
        : listing?.availableFrom
        ? `From ${new Date(listing.availableFrom).toLocaleDateString()}`
        : "Check availability",
      description: listing?.description || "",
    });

    analytics.wishlistToggle(propertyId, currentlySaved ? 'remove' : 'add');
  };

  const ROOM_TYPE_OPTIONS = [
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "ensuite", label: "Ensuite Room" },
    { value: "ensuite_double", label: "Ensuite Double Room" },
    { value: "studio", label: "Studio" }
  ];

  const getRoomTypeLabel = (value) => {
    const found = ROOM_TYPE_OPTIONS.find((item) => item.value === value);
    return found ? found.label : value;
  };

  const getBillsText = (bills) => {
    if (!bills) return "Check details";
    const essentials = bills.electricity && bills.gas && bills.water;
    if (essentials && bills.wifi === false) return "All Included";
    return essentials ? "All Included" : "Not Included";
  };

  const getUrl = () => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  // SHARE
  const handleShare = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
      analytics.propertyShare(propertyName, 'copy_link');
    } catch {
      alert("Failed to copy");
    }
  };

  // EMAIL
  const handleEmail = () => {
    const url = getUrl();
    const subject = `Check this property: ${listing?.title || ""}`;
    const body = `
🏡 ${listing?.title || ""}
💷 £${monthlyPrice} per month
📍 ${listing?.location?.address || ""}

👉 ${url}
    `;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    analytics.emailClick(propertyName);
  };

  // WhatsApp (share)
  const handleWhatsApp = () => {
    const url = getUrl();
    const message = `
🏡 ${listing?.title || ""}
💷 £${monthlyPrice} per month
📍 ${listing?.location?.address || ""}

👉 ${url}
    `;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    analytics.whatsappClick(propertyName, 'pricing_card_share');
  };

  // WhatsApp Agent button
  const handleWhatsAppAgent = () => {
    analytics.whatsappClick(propertyName, 'pricing_card_agent');
  };

  // Book a Viewing button
  const handleBookViewingClick = () => {
    analytics.bookViewingClick(propertyId);
    setIsBookingOpen(true);
  };

  return (
    <>
      <div className="sticky top-10 bg-white rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-[#E2E7EE] w-full max-w-95">
        
        {/* Dark Header Section */}
        <div className="bg-[#11273C] p-8 text-white relative overflow-hidden">
          <div className="bg-[#1B3D36] text-[#4ADE80] text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-4 flex items-center gap-2 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full"></span>
            Available {
              listing?.availableImmediately
                ? "Immediately"
                : listing?.availableFrom
                ? new Date(listing.availableFrom).toLocaleDateString()
                : "Check availability"
            }
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold tracking-tight">£{monthlyPrice}</span>
          </div>
          <div className="text-gray-400 text-sm mt-1 font-medium">
            per month · all bills included
          </div>
          <div className="text-gray-500 text-[13px] mt-1 italic">
            £{monthlyPrice} per month
          </div>
          
          <div className="mt-6 bg-[#F47C3C33] text-[#F9A370] text-[12px] font-semibold py-2.5 px-4 rounded-xl w-fit flex items-center gap-2 border border-[#F47C3C33]">
            🔐 Deposit: £{listing?.deposit || '590'}
          </div>

          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/3 rounded-full"></div>
        </div>

        {/* Details List Section */}
        <div className="p-7 px-8 space-y-4">
          <div className="space-y-4 pb-2">
            <DetailRow label="Room Type" value={getRoomTypeLabel(listing?.roomType) || "Double Room"} />
            <div className="h-px bg-[#E2E7EE] w-full"></div>
            <DetailRow label="Min Tenancy" value={`${listing?.minTenancy || ''} months`} />
            <div className="h-px bg-[#E2E7EE] w-full"></div>
            <DetailRow
              label="Move In"
              value={
                listing?.availableImmediately
                  ? "Immediately"
                  : listing?.availableFrom
                  ? new Date(listing.availableFrom).toLocaleDateString()
                  : "Check availability"
              }
              color="text-[#0F9455]"
            />
            <div className="h-px bg-[#E2E7EE] w-full"></div>
            <DetailRow
              label="Bills"
              value={getBillsText(listing?.billsIncluded)}
              check={getBillsText(listing?.billsIncluded) === "All Included"}
              color="text-[#0F9455]"
            />
            <div className="h-px bg-[#E2E7EE] w-full"></div>
            <DetailRow label="Property Ref" value={listing?.listingId || "THECI_010073"} />
            <div className="h-px bg-[#E2E7EE] w-full"></div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleBookViewingClick}
              className="w-full bg-linear-to-r from-[#F28241] to-[#EB6B2A] text-white py-4 rounded-2xl font-semibold font-sans text-base shadow-[0_10px_20px_rgba(235,107,42,0.3)] flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <span className="text-lg">🗓️</span> Book a Viewing
            </button>
            
            <a
              href="https://wa.me/447950309760"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppAgent}
              className="w-full border border-[#0C1F33] text-[#0F172A] py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors bg-white"
            >
              <Phone size={16} className="fill-current" />
              WhatsApp Agent
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            <TrustBadge icon={<Lock size={18} className="text-[#88d343]"/>} label="SECURE" subLabel="BOOKING" />
            <TrustBadge icon={<ShieldCheck size={18} className="text-[#334155]"/>} label="VERIFIED" subLabel="PROPERTY" />
            <TrustBadge icon={<Zap size={18} className="text-[#FBBF24]"/>} label="FAST" subLabel="RESPONSE" />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col items-center pt-4">
            <button
              onClick={handleSave}
              className={`text-[13px] flex items-center gap-1.5 transition-all
                ${
                  isLoaded && isSaved(propertyId)
                    ? "text-red-500"
                    : "text-[#7A8FA0] hover:text-red-500"
                }`}
            >
              <Heart
                size={16}
                className={`transition-all ${
                  isLoaded && isSaved(propertyId)
                    ? "fill-red-500 text-red-500 scale-110"
                    : "fill-transparent"
                }`}
              />
              {isLoaded && isSaved(propertyId)
                ? "Saved to Wishlist"
                : "Save to Wishlist"}
            </button>
            
            <div className="flex justify-between w-full gap-2 mt-6">
              <SocialIcon
                icon={<Share2 size={18} />}
                label="Share"
                onClick={handleShare}
              />
              <SocialIcon
                icon={<Mail size={18} />}
                label="Email"
                onClick={handleEmail}
              />
              <SocialIcon
                icon={<MessageCircle size={18} />}
                label="WhatsApp"
                onClick={handleWhatsApp}
              />
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        listing={listing}
      />
    </>
  );
};

// Sub-components
const DetailRow = ({ label, value, color = "text-[#0F172A]", check }) => (
  <div className="flex justify-between items-center text-[13px]">
    <span className="text-[#7A8FA0] font-medium font-sans">{label}</span>
    <span className={`font-semibold ${color} flex items-center gap-1.5 tracking-tight font-sans`}>
      {value} {check && <Check size={16} strokeWidth={3} className="text-[#0F9455]" />}
    </span>
  </div>
);

const TrustBadge = ({ icon, label, subLabel }) => (
  <div className="bg-[#F1F4F7] rounded-2xl border border-[#E2E7EE] p-3 flex flex-col items-center justify-center text-center">
    <div className="mb-2">{icon}</div>
    <span className="text-[10px] font-black text-[#7A8FA0] uppercase leading-none tracking-wider">{label}</span>
    <span className="text-[10px] font-black text-[#7A8FA0] uppercase leading-none tracking-wider mt-0.5">{subLabel}</span>
  </div>
);

const SocialIcon = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 flex-1 border border-gray-200 rounded-xl py-2.5 px-2 hover:bg-gray-50 transition-all"
  >
    <span className="text-[#334155]">{icon}</span>
    <span className="text-[12px] font-bold text-[#1E293B]">{label}</span>
  </button>
);

export default PricingCard;