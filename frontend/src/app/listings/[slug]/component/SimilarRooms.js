import React, { useState, useEffect } from 'react';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// --- Skeleton Component ---
const SkeletonCard = () => (
  <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden w-[85%] md:w-full flex-shrink-0 md:shadow-sm">
    <div className="relative aspect-[1.38/1] bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse" />
      <div className="h-3 bg-gray-100 rounded-md w-1/2 animate-pulse" />
      <div className="pt-3 border-t border-gray-50 flex justify-between">
        <div className="h-3 bg-gray-100 rounded-md w-1/4 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded-md w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
);

const RoomCard = ({ room, index }) => {
  const formatDate = (dateObj) => {
    if (!dateObj) return 'Soon';
    const date = new Date(dateObj.$date || dateObj);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div 
      className="bg-white rounded-[16px] border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 snap-start animate-in fade-in slide-in-from-bottom-4 fill-mode-both md:shadow-sm"
      style={{ animationDelay: `${index * 100}ms`, animationDuration: '600ms' }}
    >
      <div className="relative aspect-[1.38/1]">
        <img 
          src={room.images?.[0] || "/api/placeholder/400/300"} 
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 bg-white/95 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
          <Heart size={16} className="text-[#1A1A1A] stroke-[2px]" />
        </button>
        <div className="absolute bottom-3 left-3 bg-[#0C1F33] text-white px-3 py-1.5 rounded-lg font-bold text-[13px]">
          £{room.monthlyPrice} pm
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-[16px] text-[#0C1F33] leading-tight truncate mb-1 capitalize">
          {room.title}
        </h3>
        
        <div className="flex items-center gap-1 text-[#9CA3AF] mb-3">
          <MapPin size={13} className="text-[#E5484D] shrink-0" />
          <span className="text-[12px] font-medium truncate">
            {room.location?.address}, {room.location?.postcode}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center">
            {room.availableImmediately ? (
              <span className="text-[#10B981] text-[12px] font-bold flex items-center gap-1">
                <span className="text-[10px]">●</span> Available Now
              </span>
            ) : (
              <span className="text-[#F27A3D] text-[12px] font-bold">
                From {formatDate(room.availableFrom)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-[#6B7280] text-[11px] font-bold uppercase tracking-wider">
            <span>{room.roomType} • {room.bathroomType === 'ensuite' ? 'Ensuite' : 'Shared'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimilarRooms = ({ currentRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyRooms = async () => {
      if (!currentRoom?.location?.coordinates) return;
      try {
        setLoading(true);
        const [lng, lat] = currentRoom.location.coordinates;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listings/nearby?lng=${lng}&lat=${lat}&currentId=${currentRoom._id}`
        );
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNearbyRooms();
  }, [currentRoom]);

  return (
    <section className="max-w-6xl mx-auto mt-6 md:bg-white md:border md:border-gray-100 md:rounded-[24px] md:shadow-sm overflow-hidden">
      {/* Header Section - Padding reduced for mobile to match screenshot */}
      <div className="px-1 py-4 md:px-8 md:py-6 md:border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
          {/* This part only shows on Desktop */}
          <span className="hidden md:inline">Similar </span>
          
          {/* This part shows on both, but because "Similar" is hidden on mobile, 
              it effectively becomes "Rooms Nearby" */}
          <span>Rooms Nearby</span>
        </h2>
        <Link
          href="/find-a-room"
          className="text-[#F27A3D] font-bold text-[14px] flex items-center gap-1 hover:underline"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Cards Area - Mobile: No padding, horizontal swipe. Desktop: Padding & Grid */}
      <div className="px-1 md:p-8">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x no-scrollbar">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </>
          ) : (
            rooms.map((room, index) => (
              <div key={room._id?.$oid || room._id} className="w-[85%] md:w-full flex-shrink-0">
                <RoomCard room={room} index={index} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SimilarRooms;