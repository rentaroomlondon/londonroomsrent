import React from 'react';
import { User, Home, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'profile', icon: <User size={20} />, label: 'My Profile' },
    { id: 'properties', icon: <Home size={20} />, label: 'Booked Properties' },
    { id: 'documents', icon: <FileText size={20} />, label: 'My Documents' },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-3">
        <img src="/logo.png" alt="Logo" className="h-14" />
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)} // Updates the active state
            className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            {item.icon} <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;