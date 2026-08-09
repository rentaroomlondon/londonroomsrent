import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/app/utils/useWishlist';
import BookingModal from './BookingModal';

const MobileStickyCTA = ({price, billsText, listing}) => {
  const { isSaved, toggleWishlist, isLoaded } = useWishlist();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
    const listingId = listing?._id || listing?.id;
  const saved = isSaved(listingId);

  const handleSave = () => {
    if (!listing) return;

    toggleWishlist({
      id: listingId,
      slug: listing?.slug,
      title: listing?.title,
      price: price, // ✅ FIXED (was monthlyPrice)
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
  };

  return (
    <>
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
      <div className="flex items-center gap-3">
        {/* Wishlist Button */}
        <button
          onClick={handleSave}
          disabled={!isLoaded}
          className={`w-[48px] h-[48px] rounded-[16px] border flex items-center justify-center transition-all
            ${saved 
              ? "bg-gray-50 border-[#E9EDF2]" 
              : "border-[#E9EDF2] active:bg-gray-50"
            }
          `}
        >
          <Heart
            size={22}
            strokeWidth={2}
            className={`transition-all ${
              saved ? "fill-[#0D1B2E] text-[#0D1B2E]" : "text-[#0D1B2E]"
            }`}
          />
        </button>


        {/* Pricing Info */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-bold text-[#F47C3C]">£{price}</span>
            <span className="text-[#6B7C8E] text-[13px] font-light">/month</span>
          </div>
          <span className="text-[#6B7C8E] text-[13px] font-light leading-tight">
            {billsText}
          </span>
        </div>
      </div>

      {/* Primary CTA Button */}
      <button onClick={() => setIsBookingOpen(true)} className="bg-[#F58444] text-white h-[47px] text-[14px] font-semibold px-5 rounded-[12px] flex items-center justify-center gap-2 shadow-[0_12px_24px_-8px_rgba(245,132,68,0.5)] active:scale-[0.98] transition-all">
        <span role="img" aria-label="calendar" className="text-[16px]">📅</span>
        Book a Viewing
      </button>
    </div>
    <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        listing={listing}
    />
    </>
  );
};

export default MobileStickyCTA;