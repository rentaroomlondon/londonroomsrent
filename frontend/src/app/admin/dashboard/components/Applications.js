"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Download,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Applications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // ============================
  // FETCH USERS
  // ============================
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================
  // UPDATE DOCUMENT STATUS
  // ============================
  const updateStatus = async (userId, type, status) => {
    try {
      setUpdating(`${userId}-${type}`);

      await fetch(`${API_URL}/users/document/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type, status }),
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // ============================
  // STATUS STYLE
  // ============================
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-500";
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Applications</h1>

      {users.length === 0 ? (
        <p>No applications found</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-xl p-5 shadow-sm space-y-4"
          >
            {/* USER INFO */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {user.firstName} {user.surname}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

            {/* DOCUMENTS */}
            <div className="space-y-3">
              {Object.entries(user.documents || {}).map(
                ([type, doc]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    {/* LEFT */}
                    <div>
                      <p className="font-medium capitalize flex items-center gap-2">
                        <FileText size={16} />
                        {type}
                      </p>

                      {doc.fileUrl ? (
                        <div className="flex gap-4 text-sm mt-1 items-center">
                          {/* VIEW */}
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View
                          </a>

                          {/* DOWNLOAD */}
                          <a
                            href={doc.fileUrl}
                            download
                            className="text-green-600 flex items-center gap-1"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Not uploaded
                        </p>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>

                      {/* APPROVE */}
                      {doc.fileUrl &&
                        doc.status !== "approved" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                user._id,
                                type,
                                "approved"
                              )
                            }
                            disabled={
                              updating === `${user._id}-${type}`
                            }
                            className="bg-green-500 text-white p-1 rounded"
                          >
                            {updating ===
                            `${user._id}-${type}` ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                          </button>
                        )}

                      {/* REJECT */}
                      {doc.fileUrl &&
                        doc.status !== "rejected" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                user._id,
                                type,
                                "rejected"
                              )
                            }
                            disabled={
                              updating === `${user._id}-${type}`
                            }
                            className="bg-red-500 text-white p-1 rounded"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Applications;