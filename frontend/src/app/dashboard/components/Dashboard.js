"use client"
import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import PropertiesSection from './PropertiesSection';
import DocumentSection from './DocumentSection';
import Sidebar from './Sidebar';
import { FileText, Home, User } from 'lucide-react';
import { useAuth } from '@/app/Context/AuthContext';

const Dashboard = () => {

  const { user } = useAuth();
  // 1. Tab Shifting Logic State
  const [activeTab, setActiveTab] = useState('profile');

  // 2. Component Mapping
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'properties':
        return <PropertiesSection userId={user._id}/>;
      case 'documents':
        return <DocumentSection userId={user._id}/>;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 3. Pass state to Sidebar to handle clicks */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-sm text-slate-500">Manage your account and tenancy</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.firstName || "User"}</p>
              <p className="text-xs text-slate-500">{user?.email || ""}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {user?.firstName?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* 4. Dynamic Content Area */}
        <div className="max-w-4xl mx-auto lg:mx-0">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Tabs */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 md:hidden shadow-lg">
      
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center text-xs ${
          activeTab === "profile" ? "text-orange-500" : "text-gray-500"
        }`}
      >
        <User size={20} />
        Profile
      </button>

      <button
        onClick={() => setActiveTab("properties")}
        className={`flex flex-col items-center text-xs ${
          activeTab === "properties" ? "text-orange-500" : "text-gray-500"
        }`}
      >
        <Home size={20} />
        Properties
      </button>

      <button
        onClick={() => setActiveTab("documents")}
        className={`flex flex-col items-center text-xs ${
          activeTab === "documents" ? "text-orange-500" : "text-gray-500"
        }`}
      >
        <FileText size={20} />
        Documents
      </button>

    </div>
    </div>
  );
};

export default Dashboard;