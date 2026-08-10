"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // 👑 Fetch current admin
  const fetchAdmin = async () => {
    setLoadingAdmin(true);

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/me`, {
        credentials: "include",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!res.ok) {
        setAdmin(null);
        localStorage.removeItem("adminToken");
      } else {
        const data = await res.json();
        setAdmin(data.admin || null);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      setAdmin(null);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // 🔐 Admin logout
  const logoutAdmin = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("adminToken");
      setAdmin(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        setAdmin,
        loadingAdmin,
        fetchAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);