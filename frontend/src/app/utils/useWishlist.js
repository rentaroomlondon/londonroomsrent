"use client";
import { useEffect, useState } from "react";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // 👈 NEW

  // Load once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
    setIsLoaded(true); // 👈 mark loaded
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Check saved
  const isSaved = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // Toggle
  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  return { wishlist, isSaved, toggleWishlist, isLoaded };
};