"use client";

import { useEffect, useState } from "react";

const Maintenance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);

  // For deadline + staff selection
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState("");

  // Fetch all maintenance
  const fetchMaintenance = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) setData(result.maintenance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all staff
  const fetchStaff = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) setStaffList(result.staff);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaintenance();
    fetchStaff();
  }, []);

  // Mark maintenance complete
  const markComplete = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed", sendEmail: true }),
      });
      fetchMaintenance();
    } catch (err) {
      console.error(err);
    }
  };

  // Assign staff + deadline
  const assignStaff = async (id) => {
    if (!selectedStaffId) return alert("Select a staff member!");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/assign/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: selectedStaffId, deadline: selectedDeadline }),
      });
      setSelectedStaffId("");
      setSelectedDeadline("");
      fetchMaintenance();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="overflow-x-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 min-w-[900px]">

          {/* Header */}
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-50 gap-2 md:gap-0">
            <h2 className="font-bold text-lg">All Maintenance Requests</h2>
            <span className="text-sm text-gray-400">{data.length} Requests</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-10 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <div>Tenant</div>
            <div>Category</div>
            <div>Priority</div>
            <div>Status</div>
            <div>Dates</div>
            <div>Description</div>
            <div>Address</div>
            <div>Access</div>
            <div>Photos</div>
            <div>Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {loading ? (
              <p className="p-6 text-sm text-gray-400">Loading...</p>
            ) : data.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No requests</p>
            ) : (
              data.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-10 gap-3 items-start px-6 py-4 text-sm hover:bg-gray-50 transition"
                >

                  {/* Tenant */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-900">{item.firstName || "User"} {item.lastName || ""}</p>
                    <p className="text-xs text-gray-400">{item.email || "-"}</p>
                    <p className="text-xs text-gray-400">{item.phone || "-"}</p>
                  </div>

                  {/* Category */}
                  <div>{item.category || "-"}</div>

                  {/* Priority */}
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      item.priority === "Urgent" ? "bg-red-100 text-red-600" :
                      item.priority === "Routine" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {item.priority}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      item.status === "Completed" ? "bg-green-100 text-green-600" :
                      item.status === "Assigned" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 flex flex-col gap-1">
                    <p><span className="font-medium">Issue:</span> {item.issueStarted ? new Date(item.issueStarted).toLocaleDateString() : "-"}</p>
                    <p><span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleDateString()}</p>
                    <p>
                      <span className="font-medium">Deadline:</span>{" "}
                      {item.deadline ? (
                        <span className={`px-1 rounded ${new Date(item.deadline) < new Date() ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                          {new Date(item.deadline).toLocaleDateString()}
                        </span>
                      ) : "-"}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-xs text-gray-500 max-w-[180px]">
                    <p className="line-clamp-2">{item.description || "-"}</p>
                    {item.description && item.description.length > 60 && (
                      <button
                        onClick={() => setSelectedDescription(item.description)}
                        className="text-blue-500 text-xs mt-1"
                      >
                        View more
                      </button>
                    )}
                  </div>

                  {/* Address */}
                  <div className="text-xs text-gray-500 max-w-[150px]">{item.address || "-"}</div>

                  {/* Access */}
                  <div className="text-xs flex flex-col gap-1">
                    <p>{item.contactTime || "-"}</p>
                    <p className="text-gray-400">{item.access || "-"}</p>
                  </div>

                  {/* Photos */}
                  <div className="flex gap-2 overflow-x-auto max-w-[140px]">
                    {item.photos && item.photos.length > 0 ? item.photos.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="photo"
                        onClick={() => setSelectedImage(img)}
                        className="w-12 h-12 object-cover rounded-md shrink-0 cursor-pointer hover:scale-105 transition"
                      />
                    )) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-1">
                    {item.status !== "Completed" && (
                      <>
                        {item.status === "Pending" && (
                          <div className="flex flex-col gap-1">
                            <select
                              className="text-xs px-2 py-1 rounded-lg border border-gray-300"
                              value={selectedStaffId}
                              onChange={(e) => setSelectedStaffId(e.target.value)}
                            >
                              <option value="">Assign Staff</option>
                              {staffList.map((staff) => (
                                <option key={staff._id} value={staff._id}>{staff.name} ({staff.role})</option>
                              ))}
                            </select>

                            <input
                              type="date"
                              className="text-xs px-2 py-1 rounded-lg border border-gray-300"
                              value={selectedDeadline}
                              onChange={(e) => setSelectedDeadline(e.target.value)}
                            />

                            <button
                              className="text-xs px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => assignStaff(item._id)}
                            >
                              Assign
                            </button>
                          </div>
                        )}

                        {item.status === "Assigned" && (
                          <span className="text-xs px-2 py-1 rounded-full font-semibold bg-blue-100 text-blue-600">
                            {item.assignedStaff?.name || "Assigned"}
                          </span>
                        )}

                        <button
                          onClick={() => markComplete(item._id)}
                          className="text-xs px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 mt-1"
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <img src={selectedImage} alt="preview" className="max-w-[90%] max-h-[90%] rounded-xl shadow-xl" />
        </div>
      )}

      {/* Description Modal */}
      {selectedDescription && (
        <div
          onClick={() => setSelectedDescription(null)}
          className="fixed inset-0 flex items-center justify-center z-50 p-6 bg-black/50"
        >
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-bold mb-3">Full Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{selectedDescription}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Maintenance;