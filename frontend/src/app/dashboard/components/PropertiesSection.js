"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import BookingSkeleton from '@/app/Shared/BookingSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PropertiesSection = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/my/${userId}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">My Properties</h3>
        <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
          {bookings.length} Active Booking
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && bookings.length === 0 && (
        <p className="text-sm text-gray-400">No bookings yet</p>
      )}

      {/* BOOKINGS */}
      {bookings.map((booking) => {
        const listing = booking.listing;

        return (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row gap-6 p-4 border border-slate-100 rounded-2xl hover:border-blue-100 transition mb-4"
          >
            <img
              src={listing?.images?.[0] || "/placeholder.jpg"}
              alt="Property"
              className="w-full md:w-40 h-32 object-cover rounded-xl"
            />

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {listing?.title}
                  </h4>

                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin size={12} />
                    {listing?.location?.city} {listing?.location?.postcode}
                  </p>
                </div>

                <p className="text-orange-500 font-bold text-lg">
                  £{listing?.monthlyPrice}
                  <span className="text-xs font-normal text-slate-400">
                    /month
                  </span>
                </p>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                
                {/* DATE */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={14} className="text-slate-400" />
                  <div className="leading-tight">
                    <p className="text-[10px] text-slate-400 font-bold">
                      VIEWING DATE
                    </p>
                    <p className="text-xs font-bold">
                      {new Date(booking.viewingDate).toDateString()}
                    </p>
                  </div>
                </div>

                {/* SLOT */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  <div className="leading-tight">
                    <p className="text-[10px] text-slate-400 font-bold">
                      TIME SLOT
                    </p>
                    <p className="text-xs font-bold">
                      {booking.viewingSlot}
                    </p>
                  </div>
                </div>

              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span className={`px-3 py-1 text-xs font-bold rounded-full 
                  ${booking.status === "Confirmed" ? "bg-green-100 text-green-600" : 
                    booking.status === "Cancelled" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"}
                `}>
                  {booking.status || "Pending"}
                </span>
              </div>

            </div>
          </div>
        );
      })}
    </section>
  );
};

export default PropertiesSection;