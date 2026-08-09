"use client";
import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import ListingForm from "./listingForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();

      console.log("API RESPONSE:", data);

      setProperties(data?.listings || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (slug) => {
    const confirmDelete = confirm("Delete this property?");
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/listings/${slug}`, {
        method: "DELETE",
      });

      setProperties((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
    }
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
          className="mb-4 px-4 py-2 bg-slate-200 rounded-lg text-sm font-semibold"
        >
          ← Back
        </button>

        <ListingForm slug={selectedSlug} />
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Property Management
          </h1>

          <button
            onClick={() => {
              setSelectedSlug(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        ) : properties.length === 0 ? (
          <p className="text-center text-slate-500 mt-10">
            No properties found 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="w-full h-44 bg-gray-100">
                  <img
                    src={
                      item.images?.[0]
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  {/* TITLE */}
                  <h2 className="text-base font-semibold text-slate-800 line-clamp-1">
                    {item.title}
                  </h2>

                  {/* ROOM LABEL (badge) */}
                  <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md">
                    {item.roomLabel || "No Room"}
                  </span>

                  {/* ADDRESS */}
                  <p className="text-sm text-gray-500 line-clamp-1">
                    📍 {item.location?.address || "No address"},{" "}
                    {item.location?.city || ""}
                  </p>

                  {/* POSTCODE */}
                  <p className="text-xs text-gray-400">
                    Postcode: {item.location?.postcode || "N/A"}
                  </p>

                  {/* LISTING ID */}
                  <p className="text-xs text-gray-400">
                    ID: {item.listingId || "N/A"}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => {
                        setSelectedSlug(item.slug);
                        setShowForm(true);
                      }}
                      className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.slug)}
                      className="flex-1 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManager;