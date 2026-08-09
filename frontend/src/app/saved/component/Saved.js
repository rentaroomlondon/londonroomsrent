"use client";
import React, { useEffect, useState } from "react";
import { useWishlist } from "@/app/utils/useWishlist";
import PropertyCardSkeleton from "@/app/Shared/PropertyCardSkeleton";
import PropertyCard from "@/app/Shared/PropertyCard";

const Saved = () => {
  const { wishlist, isLoaded } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) setLoading(false);
  }, [isLoaded]);

  return (
    <section className=" md:py-20 py-10 ">
      <div className="max-w-[1280px] mx-auto px-4">

        {/* 🔄 Loading */}
        {loading && (
          <>
            {/* 📱 Mobile (Column Skeleton) */}
            <div className="flex flex-col gap-4 lg:hidden">
              {Array(4).fill().map((_, i) => (  
                <PropertyCardSkeleton key={i} />
              ))}
            </div>

            {/* 💻 Desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {Array(3).fill().map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* ❌ Empty */}
        {!loading && wishlist?.length === 0 && (
          <div className="text-center text-gray-500">
            No saved listings yet 💔
          </div>
        )}

        {/* 📱 Mobile (Column List) */}
        {!loading && wishlist?.length > 0 && (
          <div className="flex flex-col gap-4 lg:hidden">
            {wishlist.map((item) => (
              <PropertyCard key={item.id} {...item} />
            ))}
          </div>
        )}

        {/* 💻 Desktop Grid */}
        {!loading && wishlist?.length > 0 && (
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <PropertyCard key={item.id} {...item} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Saved;