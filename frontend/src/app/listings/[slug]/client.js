"use client";
import React, { useState } from "react";
import Gallery from "./component/Gallery";
import PricingCard from "./component/PricingCard";
import InfoCard from "./component/InfoCard";
import { MapPin } from "lucide-react";
import Tags from "./component/Tags";
import Description from "./component/Description";
import Amenities from "./component/Amenities";
import Bills from "./component/Bills";
import Details from "./component/Details";
import ConsultantCard from "./component/ConsultantCard";
import MobileStickyCTA from "./component/MobileStickyCTA";
import SimilarRooms from "./component/SimilarRooms";
import LocationTransport from "./component/LocationTransports";
import BookingModal from "./component/BookingModal";
import NearbyAmenities from "./component/NearbyAmenities";

const Client = ({ listing }) => {

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const monthlyPrice = listing?.monthlyPrice || 0;
  const deposit = listing?.deposit;

  // 🔥 ROOM TYPE MAP
  const ROOM_TYPE_MAP = {
    single: "Single",
    double: "Double",
    ensuite: "Ensuite",
    ensuite_double: "Ensuite Double",
    studio: "Studio",
  };

  const ROOM_SIZE_MAP = {
    "Small (up to 100 sq ft)": "9 m²",
    "Medium (100-150 sq ft)": "14 m²",
    "Large (150-200 sq ft)": "18 m²",
    "Extra Large (200+ sq ft)": "22+ m²",
  };

  // Update your stats array to include Occupancy for mobile matching
    const stats = [
        { 
            label: "ROOM TYPE", 
            value: ROOM_TYPE_MAP[listing?.roomType] || "Double", 
            type: "double" 
        },
        { 
            label: "ROOM SIZE", 
            // This finds the meter value based on the string stored in listing.roomSize
            value: ROOM_SIZE_MAP[listing?.roomSize] || "14 m²", 
            type: "size" 
        },
        { label: "PROPERTY", value: listing?.propertySharing || "Shared", type: "shared" },
        { label: "BATHROOM", value: listing?.bathroomType || "Shared", type: "bath" },
        { label: "MIN TENANCY", value: `${listing?.minTenancy || ""} Months`, type: "calendar" },
        { label: "Energy Rating", value: `EPC: ${listing?.epcRating || ""}`, type: "rating" }, 
    ];

    const getBillsText = (bills) => {
        if (!bills) return "Check details";

        const essentials =
            bills.electricity &&
            bills.gas &&
            bills.water;

        if (essentials && bills.wifi === false) {
            return "All Included";
        }

        return essentials ? "All Bills Included" : "Not Bills Included";
    };

    const formatAddress = (address) => {
      if (!address) return "";

      // Remove starting number + optional letter (e.g. 92, 118A, 129b)
      return address.replace(/^\s*\d+[a-zA-Z]?\s*/, "");
    };

  return (
    <>
    <div className="relative pb-6 md:pb-0">

      {/* 🔥 FULL WIDTH GALLERY */}
      <Gallery
        images={listing?.images || []}
        available={listing?.availableImmediately}
      />

      <div className="max-w-300 mx-auto px-4 md:px-6 py-2">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT */}
          <div className="flex-1">

            {/* ✅ TAGS */}
            <Tags listing={listing} />
            

            {/* TITLE */}
            <h1 className="text-xl md:text-5xl font-extrabold text-[#0C1F33] mb-2 leading-tight">
              {listing?.title}
            </h1>

            {/* LOCATION */}
            <div className="flex items-center gap-1 text-gray-400 mb-8">
              <MapPin size={16} className="text-red-500" />
              <p className="text-sm font-medium">
                {formatAddress(listing?.location?.address)}, {listing?.location?.postcode}, {listing?.location?.city}
              </p>
            </div>

            {/* Price Section (Previous fix) */}
            <div className="md:hidden border-y border-gray-100 py-6 my-4">
            
                {/* Price & Availability Row */}
                <div className="flex justify-between items-start mb-6 ">
                    <div className="flex-1">
                    <div className="flex items-baseline leading-none">
                        <span className="text-[#F27A3D] text-[38px] font-black tracking-tight">
                        £{monthlyPrice}
                        </span>
                        <span className="text-gray-500 text-sm ml-2 font-medium">/ month</span>
                    </div>
                    <p className="text-gray-400 text-[12px] mt-1 font-medium">
                     £{listing?.monthlyPrice} / month · {getBillsText(listing?.billsIncluded)}
                    </p>
                    </div>

                    <div className="flex flex-col items-end">
                    <div className="bg-[#E9F9F0] text-[#10B981] px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center">
                        <span className="mr-1.5 text-[8px] leading-none">●</span>
                        {listing?.availableImmediately ? "Available Now" : "Available"}
                    </div>
                    <p className="text-gray-400 text-[11px] mt-2">
                        Move in: <span className="text-gray-500">{
                            listing?.availableImmediately
                            ? "Immediately"
                            : listing?.availableFrom
                            ? new Date(listing.availableFrom).toLocaleDateString()
                            : "Check availability"
                        }</span>
                    </p>
                    </div>
                </div>

                {/* Button Row */}
                <div className="flex gap-3 ">
                    {/* Orange Button with Shadow */}
                    <button onClick={() => setIsBookingOpen(true)} className="flex-1 bg-[#F27A3D] text-white py-2 rounded-[10px] font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(242,122,61,0.3)] hover:opacity-90 transition-opacity">
                    <span className="text-lg">📅</span>
                    <span className="text-[15px]">Book Viewing</span>
                    </button>
                    
                    {/* Dark Navy Button */}
                    <button
                      onClick={() => window.open("https://wa.me/447950309760", "_blank")}
                      className="flex-1 bg-[#101D2D] text-white py-2 rounded-[10px] font-bold flex items-center justify-center gap-2 hover:bg-[#1a2b40] transition-colors"
                    >
                      <span className="text-lg">📞</span>
                      <span className="text-[10px]">Whatsapp Agent</span>
                    </button>
                </div>
            </div>

            {/* INFO GRID */}
            <div className="mb-10">
                {/* Mobile View: 3x2 Grid of separate cards */}
                <div className="grid grid-cols-3 gap-2 md:hidden">
                    {stats.map((item, idx) => (
                    <div key={idx} className="bg-[#F2F4F7] border border-[#E4E8EE] rounded-2xl shadow-sm">
                        <InfoCard {...item} isLast={true} />
                    </div>
                    ))}
                </div>

                {/* Desktop View: Single unified horizontal bar */}
                <div className="hidden md:flex bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                    {stats.map((item, idx) => (
                    <InfoCard 
                        key={idx} 
                        {...item} 
                        isLast={idx === stats.length - 1} 
                    />
                    ))}
                </div>
            </div>

            {/* DESCRIPTION */}
            <Description text={listing?.description} />

            <Amenities
                roomAmenities={listing?.roomAmenities} 
                propertyAmenities={listing?.propertyAmenities}
            />

            {/* ✅ BILLS SECTION */}
            <Bills 
                billsIncluded={listing?.billsIncluded} 
                wifiSpeed={listing?.wifiSpeed}
                councilTaxBand={listing?.councilTaxBand}
            />

            <LocationTransport listing={listing} />

            <NearbyAmenities listing={listing} />

            <Details listing={listing} />

            <ConsultantCard />

            <SimilarRooms currentRoom={listing} />
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block w-95">
            <PricingCard
              listing={listing}
              monthlyPrice={monthlyPrice}
              deposit={deposit}
            />
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE STICKY CTA */}
      <div className="md:hidden">
        <MobileStickyCTA
          price={monthlyPrice} 
          billsText={getBillsText(listing?.billsIncluded)} 
          listing={listing}
        />
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

export default Client;