import { 
  LayoutDashboard, BarChart3, Building2, Search, 
  Users, FileText, ClipboardList, Bell, Wrench, 
  CreditCard, User, Settings, BookImageIcon,
  CalendarDays, // ✅ add this icon
  ListTodo
} from 'lucide-react';
import { SidebarLink } from './SidebarLink';

export const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-64 bg-[#0B1727] text-[#64748B] flex flex-col h-screen sticky top-0 font-sans">

    <div className="p-5 pb-2">
      <img src="/logo.png" className="w-18 h-auto mb-2" />
      <div className="inline-block px-3 py-0.5 rounded-full border border-[#F47C3C33] bg-[#F47C3C2E]">
        <span className="text-[10px] text-[#F9A370] font-bold tracking-widest uppercase">
          Admin Portal
        </span>
      </div>
    </div>

    <nav className="flex-1 px-3 mt-5 space-y-5 overflow-y-auto">

      <div>
        <p className="text-[10px] text-[#475569] font-bold mb-3 px-3">Overview</p>
        <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard"
          active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
        <SidebarLink icon={<BarChart3 size={20} />} label="Analytics"
          active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
      </div>

      <div>
        <p className="text-[10px] text-[#475569] font-bold mb-3 px-3">Properties</p>
        <SidebarLink icon={<Building2 size={20} />} label="All Properties"
          active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
        <SidebarLink icon={<Search size={20} />} label="Listings"
          active={activeTab === "listings"} onClick={() => setActiveTab("listings")} />
        <SidebarLink
          icon={<BookImageIcon size={20} />}
          label="Viewing Requests"
          active={activeTab === "viewings"}
          onClick={() => setActiveTab("viewings")}
        />
      </div>

      <div>
        <p className="text-[10px] text-[#475569] font-bold mb-3 px-3">Tenants</p>
        <SidebarLink icon={<Users size={20} />} label="All Tenants"
          active={activeTab === "tenants"} onClick={() => setActiveTab("tenants")} />
        <SidebarLink icon={<FileText size={20} />} label="Applications"
          active={activeTab === "applications"} onClick={() => setActiveTab("applications")} />
        <SidebarLink icon={<ClipboardList size={20} />} label="Agreements"
          active={activeTab === "agreements"} onClick={() => setActiveTab("agreements")} />
        <SidebarLink icon={<Bell size={20} />} label="Registrations"
          active={activeTab === "registrations"} onClick={() => setActiveTab("registrations")} />
      </div>

      <div>
        <p className="text-[10px] text-[#475569] font-bold mb-3 px-3">Operations</p>
        <SidebarLink icon={<Wrench size={20} />} label="Maintenance"
          active={activeTab === "maintenance"} onClick={() => setActiveTab("maintenance")} />
        <SidebarLink icon={<CreditCard size={20} />} label="Payments"
          active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />

        {/* ✅ Added Attendance */}
        <SidebarLink icon={<CalendarDays size={20} />} label="Attendance"
          active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} />
      </div>

      <div className="pb-8">
        <p className="text-[10px] text-[#475569] font-bold mb-3 px-3">System</p>
        <SidebarLink icon={<User size={20} />} label="Staff"
          active={activeTab === "staff"} onClick={() => setActiveTab("staff")} />
        <SidebarLink icon={<ListTodo size={20} />} label="Task Board"
          active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
      </div>

    </nav>
  </aside>
);