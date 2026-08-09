"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const StaffAuthContext = createContext();

export const StaffAuthProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // 🔧 Fetch current staff
  const fetchStaff = async () => {
    setLoadingStaff(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/me`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        setStaff(null);
      } else {
        const data = await res.json();
        setStaff(data.staff || null);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff(null);
    } finally {
      setLoadingStaff(false);
    }
  };

  // 🔓 Staff logout
  const logoutStaff = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setStaff(null);
      window.location.href = "/staff/login"; // redirect to staff login
    } catch (error) {
      console.error("Staff logout error:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <StaffAuthContext.Provider
      value={{
        staff,
        setStaff,
        loadingStaff,
        fetchStaff,
        logoutStaff,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = () => useContext(StaffAuthContext);