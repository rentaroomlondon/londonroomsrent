"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/app/Context/AdminAuthContext";
import Dashboard from "./components/Dashboard";

const Page = () => {
  const { admin, loadingAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // 🚨 ONLY redirect when loading is finished
    if (loadingAdmin) return;

    if (!admin) {
      router.replace("/admin/login");
    }
  }, [admin, loadingAdmin]);

  // ⏳ Always wait for loading to finish
  if (loadingAdmin) {
    return <p>Checking admin...</p>;
  }

  // 🚫 Still null after loading → don't render
  if (!admin) return null;

  return <Dashboard />;
};

export default Page;