"use client";

import { useEffect, useState } from "react";

const Registrations = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50">

      {/* 🔥 Header */}
      <div className="p-6 flex justify-between items-center border-b border-gray-50">
        <h2 className="font-bold text-lg">New Registrations</h2>
        <span className="text-sm text-gray-400">
          {users.length} Users
        </span>
      </div>

      {/* 🔥 Table Header */}
      <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 border-b">
        <span>User</span>
        <span>Phone</span>
        <span>Budget</span>
        <span>Property</span>
        <span>Need Room Date</span>
        <span>Registered</span>
      </div>

      {/* 🔥 Table Body */}
      <div className="divide-y">
        {loading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            No registrations found
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-6 items-center px-6 py-4 hover:bg-gray-50 transition"
            >
              {/* User */}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.firstName} {user.surname}
                </p>
                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>

              {/* Phone */}
              <div className="text-sm text-gray-500">
                {user.phone || "-"}
              </div>

              {/* Budget */}
              <div className="text-sm text-gray-500">
                £{user.budgetFrom || 0} - £{user.budgetTo || 0}
              </div>

              {/* Property Type */}
              <div className="text-sm text-gray-500">
                {user.propertyType || "Any"}
              </div>

              {/* Need From Date */}
              <div className="text-sm text-gray-500">
                {user.needFromDate
                  ? new Date(user.needFromDate).toLocaleDateString()
                  : "-"}
              </div>

              {/* Registered Date + Status */}
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>

                {user.isVerified ? (
                  <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold">
                    Verified
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Registrations;