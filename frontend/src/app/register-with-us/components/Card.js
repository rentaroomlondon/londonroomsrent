"use client";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/app/utils/useWishlist";

const Card = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggleWishlist, isLoaded } = useWishlist();

  const fetchFeatured = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/featured`
      );
      const data = await res.json();

      if (res.ok) {
        const listings = data.listings || data;
        setRooms(listings.slice(0, 4));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching featured listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-sm">Loading featured rooms...</div>
    );
  }

  const handleWishlist = (e, room) => {
    e.stopPropagation();
    e.preventDefault();

    toggleWishlist({
      id: room._id,
      title: room.title,
      price: room.monthlyPrice,
      image: room.images?.[0],
      address: room.location,
      slug: room.slug,
      listingId: room.listingId,
      availability: room.availableImmediately
        ? "Available Now"
        : "Check Availability",
      description: room.description,
    });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible">
      {rooms?.length > 0 ? (
        rooms.map((room) => (
          <Link
            key={room._id}
            href={`/listing/${room.slug}`} // ✅ slug link
            className="relative group rounded-xl overflow-hidden bg-gray-900 shadow-xl min-w-[140px] lg:min-w-0 block"
          >
            <img
              src={room.images?.[0] || "/placeholder.jpg"}
              alt={room.title || "Room"}
              className="w-full h-40 lg:h-56 object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
            />

            <div className="hidden lg:block absolute top-2 left-2 bg-[#0F253B] backdrop-blur-md px-2 py-1 text-[10px] md:text-[12px] font-bold rounded">
              AVAILABLE NOW
            </div>

            <div className="absolute top-2 right-2 bg-orange-500 p-2 text-right rounded">
              <p className="text-[10px] md:text-[14px] font-bold leading-none">
                £{room.monthlyPrice} PM
              </p>
              <p className="hidden lg:block text-[8px] md:tex-[12px] leading-none opacity-80">
                Tenancy Info
              </p>
            </div>

            {/* ❤️ Wishlist Button (prevents navigation) */}
            <button
              onClick={(e) => handleWishlist(e, room)}
              className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full  hover:text-black transition-colors z-10"
            >
              <Heart
                size={14}
                className={`${
                    isSaved(room._id)
                    ? "fill-white text-white"
                    : "text-white fill-transparent"
                }`}
                />
            </button>
          </Link>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No featured listings found.</p>
      )}
    </div>
  );
};

export default Card;