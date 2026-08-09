import React, { useState } from 'react';
import { Search, Bell, Mail, LogOut } from 'lucide-react';
import { IconButton } from './IconButton';
import { useAdminAuth } from '@/app/Context/AdminAuthContext';

export const Header = ({ title = "Dashboard", breadcrumb = "Overview" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { admin, loadingAdmin, logoutAdmin } = useAdminAuth();

  // 🔤 Get initials from admin name
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-100 mb-8">
      
      {/* Dynamic Title & Breadcrumb */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1e293b] leading-tight">
          {title}
        </h1>
        <p className="text-[11px] font-medium text-gray-400 mt-0.5">
          LONDONROOMSRENT <span className="mx-1">›</span>{" "}
          <span className="text-orange-500">{breadcrumb}</span>
        </p>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tenants, properties, refs..."
            className="pl-11 pr-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-xl w-[350px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <IconButton icon={<Bell size={20} className="text-gray-500" />} badge />
          <IconButton icon={<Mail size={20} className="text-gray-500" />} badge />
          
          {/* User Profile & Logout Dropdown */}
          <div className="relative ml-2">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              {loadingAdmin ? "..." : getInitials(admin?.name)}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2">
                
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {admin?.name || "Admin User"}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    logoutAdmin();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};