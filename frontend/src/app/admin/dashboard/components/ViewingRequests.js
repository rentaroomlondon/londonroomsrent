"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ViewingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Store confirm date & time per booking
  const [confirmData, setConfirmData] = useState({});

  // ============================
  // FETCH BOOKINGS
  // ============================
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ============================
  // HANDLE INPUT CHANGE
  // ============================
  const handleConfirmChange = (id, field, value) => {
    setConfirmData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // ============================
  // UPDATE STATUS
  // ============================
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      let body = { status };

      if (status === "Confirmed") {
        const selected = confirmData[id];

        if (!selected?.date || !selected?.time) {
          alert("Please select confirm date & time");
          setUpdatingId(null);
          return;
        }

        body = {
          status,
          confirmedDate: selected.date,
          confirmedTime: selected.time,
        };
      }

      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updated : b))
      );
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================
  // STATUS STYLES
  // ============================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ============================
  // UI
  // ============================
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Viewing Requests</h2>

      {bookings.length === 0 ? (
        <p>No viewing requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* LEFT */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {booking.listing?.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {booking.listing?.location?.address},{" "}
                  {booking.listing?.location?.postcode},{" "}
                  {booking.listing?.location?.city}
                </p>

                <div className="mt-2 text-sm">
                  <p>
                    <strong>User:</strong>{" "}
                    {booking.user?.firstName} {booking.user?.surname}
                  </p>
                  <p>
                    <strong>Email:</strong> {booking.user?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {booking.user?.phone}
                  </p>
                </div>

                <div className="mt-2 text-sm">
                  <p>
                    📅 {new Date(booking.viewingDate).toDateString()}
                  </p>
                  <p>⏰ {booking.viewingSlot}</p>
                </div>

                {/* SHOW CONFIRMED INFO */}
                {booking.status === "Confirmed" && (
                  <div className="mt-2 text-sm text-green-600">
                    <p>
                      ✅ Confirmed Date:{" "}
                      {new Date(
                        booking.confirmedDate
                      ).toDateString()}
                    </p>
                    <p>⏰ Confirmed Time: {booking.confirmedTime}</p>
                  </div>
                )}

                {booking.message && (
                  <p className="mt-2 text-sm italic text-gray-600">
                    "{booking.message}"
                  </p>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-3">
                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status || "Pending"}
                </span>

                {/* CONFIRM INPUTS */}
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    className="border px-2 py-1 rounded text-sm"
                    onChange={(e) =>
                      handleConfirmChange(
                        booking._id,
                        "date",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="time"
                    className="border px-2 py-1 rounded text-sm"
                    onChange={(e) =>
                      handleConfirmChange(
                        booking._id,
                        "time",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  {/* ✅ ONLY THIS BUTTON DISABLES */}
                  <button
                    onClick={() =>
                      updateStatus(booking._id, "Confirmed")
                    }
                    disabled={
                      updatingId === booking._id ||
                      booking.status === "Confirmed"
                    }
                    className={`px-3 py-1 rounded flex items-center gap-1 text-white ${
                      booking.status === "Confirmed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500"
                    }`}
                  >
                    {updatingId === booking._id ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {booking.status === "Confirmed"
                      ? "Confirmed"
                      : "Confirm"}
                  </button>

                  {/* ❌ STILL ACTIVE */}
                  <button
                    onClick={() =>
                      updateStatus(booking._id, "Cancelled")
                    }
                    disabled={updatingId === booking._id}
                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>

                  {/* ✅ STILL ACTIVE */}
                  <button
                    onClick={() =>
                      updateStatus(booking._id, "Completed")
                    }
                    disabled={updatingId === booking._id}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Clock size={16} />
                    Done
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewingRequests;