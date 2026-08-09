"use client";

import { useState } from "react";
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import DashboardHome from "./DashboardHome";
import Registrations from "./Registrations";
import Maintenance from "./Maintenance";
import PropertyManager from "./PropertyManager";
import Listings from "./Listings";
import ViewingRequests from "./ViewingRequests";
import Applications from "./Applications";
import Attendance from "./Attendance";
import Staff from "./Staff";
import TaskBoard from "./TaskBoard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔥 Header mapping
  const headerMap = {
    dashboard: { title: "Dashboard", breadcrumb: "Overview" },
    analytics: { title: "Analytics", breadcrumb: "Reports" },
    properties: { title: "Properties", breadcrumb: "All Properties" },
    listings: { title: "Listings", breadcrumb: "Search Listings" },
    viewings: { title: "Viewing Requests", breadcrumb: "All Requests" },
    tenants: { title: "Tenants", breadcrumb: "All Tenants" },
    applications: { title: "Applications", breadcrumb: "Tenant Applications" },
    agreements: { title: "Agreements", breadcrumb: "Contracts" },
    registrations: { title: "Registrations", breadcrumb: "New Users" },
    maintenance: { title: "Maintenance", breadcrumb: "Requests" },
    payments: { title: "Payments", breadcrumb: "Transactions" },
    attendance: { title: "Staff Attendance", breadcrumb: "Daily Records" }, // ✅ added
    staff: { title: "Staff", breadcrumb: "Team Members" },
    tasks: { title: "Task Board", breadcrumb: "Assign & Track Tasks" },
  };

  // 🔥 Component mapping
  const componentMap = {
    dashboard: <DashboardHome />,
    analytics: <div className="bg-white p-6 rounded-xl">Analytics Section</div>,
    properties: <PropertyManager />,
    listings: <Listings />,
    viewings: <ViewingRequests />,
    tenants: <div className="bg-white p-6 rounded-xl">All Tenants</div>,
    applications: <Applications />,
    agreements: <div className="bg-white p-6 rounded-xl">Agreements</div>,
    registrations: <Registrations />,
    maintenance: <Maintenance />,
    payments: <div className="bg-white p-6 rounded-xl">Payments</div>,
    attendance: <Attendance />, // ✅ added
    staff: <Staff />,
    tasks: <TaskBoard />,
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans text-gray-800">

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8">
        <Header {...headerMap[activeTab]} />
        {componentMap[activeTab]}
      </main>

    </div>
  );
};

export default Dashboard;