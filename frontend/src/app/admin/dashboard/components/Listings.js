"use client";
import React, { useEffect, useState } from "react";
import { Plus, Loader2, Search, X } from "lucide-react";
import ListingForm from "./listingForm";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'available', 'rented', 'reserved'

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();

      console.log("API RESPONSE:", data);

      const listings = data?.listings || data?.data || [];
      setProperties(listings);
      setFilteredProperties(listings);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= SEARCH & FILTER =================
  useEffect(() => {
    let filtered = properties;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.postcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.roomLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.listingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, statusFilter, properties]);


  // ================= CLEAR SEARCH =================
  const clearSearch = () => {
    setSearchTerm("");
  };

  // ================= STATUS COUNT =================
  const getStatusCount = (status) => {
    if (status === "all") return properties.length;
    return properties.filter(p => p.status === status).length;
  };

  // ================= FORM VIEW =================
  if (showForm) {
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setShowForm(false);
            setSelectedSlug(null);
            fetchProperties();
          }}
          className="mb-4 px-4 py-2 bg-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-300 transition"
        >
          ← Back to Properties
        </button>

        <ListingForm slug={selectedSlug} />
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Property Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all your properties, rooms, and listings
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedSlug(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition shadow-sm"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, address, city, postcode, room label, or listing ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "all"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({getStatusCount("all")})
              </button>
              <button
                onClick={() => setStatusFilter("available")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "available"
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Available ({getStatusCount("available")})
              </button>
              <button
                onClick={() => setStatusFilter("rented")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "rented"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Rented ({getStatusCount("rented")})
              </button>
              <button
                onClick={() => setStatusFilter("reserved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === "reserved"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Reserved ({getStatusCount("reserved")})
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS COUNT */}
        {!loading && (
          <div className="mb-4 text-sm text-gray-500">
            Found {filteredProperties.length} property{filteredProperties.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== "all" && ` with status ${statusFilter}`}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <Search size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No properties found</p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href={`/listings/${item.slug}`}>
                {/* IMAGE */}
                <div className="relative w-full h-48 bg-gray-100">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
                    item.status === 'available' ? 'bg-green-500 text-white' :
                    item.status === 'rented' ? 'bg-blue-500 text-white' :
                    item.status === 'reserved' ? 'bg-amber-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {item.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  {/* TITLE */}
                  <h2 className="text-base font-semibold text-slate-800 line-clamp-1">
                    {item.title || 'Untitled Property'}
                  </h2>

                  {/* ROOM LABEL & PRICE */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md">
                      {item.roomLabel || "No Room"}
                    </span>
                    <span className="text-orange-500 font-bold text-sm">
                      £{item.monthlyPrice?.toLocaleString() || '0'}/mo
                    </span>
                  </div>

                  {/* ADDRESS */}
                  <p className="text-sm text-gray-500 line-clamp-1">
                    📍 {item.location?.address || "No address"},{" "}
                    {item.location?.city || ""}
                  </p>

                  {/* POSTCODE */}
                  <p className="text-xs text-gray-400">
                    {item.location?.postcode || "N/A"}
                  </p>

                  {/* LISTING ID */}
                  <p className="text-xs text-gray-400 font-mono">
                    ID: {item.listingId || "N/A"}
                  </p>
                  
                </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;