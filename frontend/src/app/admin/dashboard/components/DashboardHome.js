import React, { useState, useEffect } from 'react';
import { 
  Home, Bed, Banknote, Wrench, MoreHorizontal, 
  ChevronRight, AlertCircle, Calendar, UserPlus, Loader2 
} from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    propertiesManaged: 0,
    roomsAvailable: 0,
    revenueThisMonth: 0,
    openMaintenance: 0
  });
  
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [todaySummary, setTodaySummary] = useState({
    paymentsToday: 0,
    newRegistrations: 0,
    viewingsScheduled: 0,
    urgentRepairs: 0
  });
  
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'occupied', 'available'

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch properties when tab changes
  useEffect(() => {
    fetchProperties();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all listings
      const listingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`);
      const listingsData = await listingsResponse.json();
      
      if (listingsData.success) {
        const listings = listingsData.data || listingsData.listings || [];
        
        // Calculate stats
        const totalProperties = listings.length;
        const availableRooms = listings.filter(listing => listing.status === 'available').length;
        
        // Calculate revenue (sum of monthly prices for rented properties)
        const totalRevenue = listings.reduce((sum, listing) => {
          return sum + (listing.status === 'rented' ? (listing.monthlyPrice || 0) : 0);
        }, 0);
        
        setStats({
          propertiesManaged: totalProperties,
          roomsAvailable: availableRooms,
          revenueThisMonth: totalRevenue,
          openMaintenance: 0 // Will be updated from maintenance API
        });

        // Calculate today's summary
        const today = new Date().toISOString().split('T')[0];
        const todayPayments = listings.filter(listing => 
          listing.lastPaymentDate === today
        ).reduce((sum, listing) => sum + (listing.monthlyPrice || 0), 0);
        
        const newRegistrations = listings.filter(listing => 
          new Date(listing.createdAt).toDateString() === new Date().toDateString()
        ).length;
        
        const viewingsScheduled = listings.filter(listing => 
          listing.viewings?.length > 0
        ).length;
        
        setTodaySummary({
          paymentsToday: todayPayments,
          newRegistrations: newRegistrations,
          viewingsScheduled: viewingsScheduled,
          urgentRepairs: 0 // Will be updated from maintenance API
        });
      }

      // Fetch maintenance requests
      await fetchMaintenanceRequests();

      // Fetch applications
      try {
        const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications?limit=5`);
        const applicationsData = await applicationsResponse.json();
        if (applicationsData.success) {
          setApplications(applicationsData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      // Fetch all maintenance requests
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance`);
      const data = await response.json();
      
      if (data.success) {
        const requests = data.data || data.maintenance || [];
        
        // Calculate open maintenance count (pending or in-progress)
        const openRequests = requests.filter(req => 
          req.status === 'pending' || req.status === 'in-progress'
        );
        
        // Calculate urgent repairs count
        const urgentRequests = openRequests.filter(req => 
          req.priority === 'urgent' || req.priority === 'high'
        );
        
        // Update stats with maintenance counts
        setStats(prev => ({
          ...prev,
          openMaintenance: openRequests.length
        }));
        
        // Update today's summary with urgent repairs
        setTodaySummary(prev => ({
          ...prev,
          urgentRepairs: urgentRequests.length
        }));
        
        // Store maintenance requests for display
        setMaintenanceRequests(openRequests.slice(0, 3)); // Show only top 3
      }
    } catch (error) {
      console.error('Failed to fetch maintenance requests:', error);
      // If maintenance API fails, set default values
      setStats(prev => ({ ...prev, openMaintenance: 0 }));
      setTodaySummary(prev => ({ ...prev, urgentRepairs: 0 }));
      setMaintenanceRequests([]);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`);
      const data = await response.json();
      
      if (data.success) {
        let listings = data.data || data.listings || [];
        
        // Filter based on active tab
        if (activeTab === 'occupied') {
          listings = listings.filter(listing => listing.status === 'rented');
        } else if (activeTab === 'available') {
          listings = listings.filter(listing => listing.status === 'available');
        }
        
        setProperties(listings);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  const updateMaintenanceStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh maintenance data
        await fetchMaintenanceRequests();
      }
    } catch (error) {
      console.error('Failed to update maintenance status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available':
        return 'bg-blue-50 text-blue-600';
      case 'rented':
        return 'bg-green-50 text-green-600';
      case 'reserved':
        return 'bg-amber-50 text-amber-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getMaintenancePriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-600';
      case 'in-progress':
        return 'bg-blue-50 text-blue-600';
      case 'completed':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'available':
        return 'Available';
      case 'rented':
        return 'Rented';
      case 'reserved':
        return 'Reserved';
      default:
        return status || 'Unknown';
    }
  };

  const getOccupancyText = (totalRooms, rentedRooms) => {
    if (!totalRooms && !rentedRooms) return '● 0/0';
    const occupied = rentedRooms || 0;
    const total = totalRooms || 1;
    return `● ${occupied}/${total}`;
  };

  const getApplicationStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'pending docs':
        return 'bg-amber-50 text-amber-600';
      case 'referencing':
        return 'bg-blue-50 text-blue-600';
      case 'approved':
        return 'bg-emerald-50 text-emerald-600';
      case 'active':
        return 'bg-emerald-50 text-emerald-600';
      case 'awaiting sign':
        return 'bg-amber-50 text-amber-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-orange-400', 'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-pink-400'];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatPrice = (price) => {
    if (!price) return '£0';
    return `£${price.toLocaleString()}`;
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000) {
      return `£${(amount / 1000).toFixed(1)}k`;
    }
    return `£${amount}`;
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="text-red-500" size={20} />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Top Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Home className="text-orange-500" />} 
          label="Properties Managed" 
          value={stats.propertiesManaged} 
          color="bg-orange-50" 
        />
        <StatCard 
          icon={<Bed className="text-emerald-500" />} 
          label="Rooms Available" 
          value={stats.roomsAvailable} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<Banknote className="text-amber-500" />} 
          label="Revenue This Month" 
          value={formatCurrency(stats.revenueThisMonth)} 
          color="bg-amber-50" 
        />
        <StatCard 
          icon={<Wrench className="text-slate-500" />} 
          label="Open Maintenance" 
          value={stats.openMaintenance} 
          color="bg-slate-100" 
        />
      </div>

      {/* --- Properties Overview Table --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-50 flex-wrap gap-4">
          <h2 className="text-lg font-bold">Properties Overview</h2>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 p-1 rounded-lg text-sm font-medium">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === 'all' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('rented')}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === 'rented' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Occupied
              </button>
              <button 
                onClick={() => setActiveTab('available')}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === 'available' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available
              </button>
            </div>
            <button className="text-orange-500 font-semibold px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-colors">
              + Add Property
            </button>
          </div>
        </div>
        
        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <Home size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                  <th className="px-6 py-4 font-semibold">Property</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Rooms</th>
                  <th className="px-6 py-4 font-semibold">Occupancy</th>
                  <th className="px-6 py-4 font-semibold">Monthly Revenue</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((property, index) => (
                  <tr key={property._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                          {property.images?.[0] ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Home size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{property.title || 'Unnamed Property'}</div>
                          <div className="text-[11px] text-gray-400">
                            {property.location?.address}, {property.location?.postcode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {property.location?.city || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {property.totalRooms || 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[11px] font-bold">
                        {getOccupancyText(property.totalRooms, property.rentedRooms)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      {formatPrice(property.monthlyPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusColor(property.status)}`}>
                        {getStatusText(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- New Tenant Applications --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Applications</h2>
            <button className="text-orange-500 text-sm font-bold flex items-center gap-1">
              View All ({applications.length}) <ChevronRight size={16} />
            </button>
          </div>
          <div className="px-6 pb-6 space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus size={40} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent applications</p>
              </div>
            ) : (
              applications.map((app, index) => (
                <TenantRow 
                  key={app._id || index}
                  name={app.applicantName || 'Unknown'}
                  loc={`${app.propertyTitle || 'Property'} • ${app.roomLabel || 'Room'}`}
                  price={formatPrice(app.weeklyPrice || app.monthlyPrice)}
                  status={app.status || 'Pending'}
                  statusColor={getApplicationStatusColor(app.status)}
                  avatar={getInitials(app.applicantName)}
                  avatarColor={getAvatarColor(app.applicantName)}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* --- Today's Summary --- */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold">Today's Summary</h2>
              <span className="text-[11px] text-gray-400">{getTodayDate()}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              <SummaryItem 
                label="Payments Today" 
                value={formatCurrency(todaySummary.paymentsToday)} 
                valueColor="text-orange-500" 
              />
              <SummaryItem 
                label="New Registrations" 
                value={todaySummary.newRegistrations} 
                valueColor="text-emerald-500" 
                icon={<UserPlus size={16}/>} 
              />
              <SummaryItem 
                label="Viewings Scheduled" 
                value={todaySummary.viewingsScheduled} 
                valueColor="text-blue-500" 
              />
              <SummaryItem 
                label="Urgent Repairs" 
                value={todaySummary.urgentRepairs} 
                valueColor="text-red-500" 
              />
            </div>
          </div>

          {/* --- Maintenance Requests --- */}
          {maintenanceRequests.length > 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Maintenance Requests</h2>
                <button 
                  onClick={() => window.location.href = '/dashboard/maintenance'}
                  className="text-orange-500 text-[11px] font-bold hover:underline"
                >
                  View All ({stats.openMaintenance})
                </button>
              </div>
              {maintenanceRequests.map((request, index) => (
                <div 
                  key={request._id || index}
                  className={`p-4 rounded-xl flex items-start justify-between cursor-pointer group hover:shadow-md transition-all mb-3 last:mb-0 border ${getMaintenancePriorityColor(request.priority)}`}
                  onClick={() => updateMaintenanceStatus(request._id, 'in-progress')}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      request.priority === 'urgent' ? 'bg-red-500 animate-pulse' : 
                      request.priority === 'high' ? 'bg-red-400' :
                      request.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-xs font-bold text-gray-800">
                          {request.title || 'Maintenance Request'}
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getMaintenanceStatusColor(request.status)}`}>
                          {request.status || 'pending'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1">
                        {request.description || 'No description provided'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-2">
                        Property: {request.propertyTitle || 'Unknown'} • 
                        Reported: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Maintenance</h2>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                <Wrench size={24} className="text-green-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-green-700">No pending maintenance</div>
                <div className="text-[11px] text-green-600 mt-1">All systems operational</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for cleaner code ---

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`${color} p-3 rounded-xl`}>{icon}</div>
    <div>
      <div className="text-2xl font-black text-gray-900 leading-none">{value}</div>
      <div className="text-xs font-medium text-gray-400 mt-1">{label}</div>
    </div>
  </div>
);

const TenantRow = ({ name, loc, price, status, statusColor, avatar, avatarColor }) => (
  <div className="flex items-center justify-between py-1 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
        {avatar}
      </div>
      <div>
        <div className="text-sm font-bold text-gray-800">{name}</div>
        <div className="text-[11px] text-gray-400">{loc}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-orange-500">{price}</div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${statusColor}`}>
        {status}
      </div>
    </div>
  </div>
);

const SummaryItem = ({ label, value, valueColor, icon }) => (
  <div className="border-l-2 border-gray-50 pl-4">
    <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
    <div className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-tight flex items-center gap-1">
      {icon}
      {label}
    </div>
  </div>
);

export default DashboardHome;