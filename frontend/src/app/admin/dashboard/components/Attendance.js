"use client";
import React, { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    startDate: "",
    endDate: "",
    month: "",
    year: "",
  });

  const openImage = (img) => setPreviewImage(img);
  const closeImage = () => setPreviewImage(null);

  const fetchToday = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/attendance/staff/today`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchFiltered = async () => {
    setLoading(true);
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    const query = new URLSearchParams(cleanFilters).toString();
    try {
      const res = await fetch(`${API}/attendance/staff?${query}`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Attendance <span className="text-orange-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Verified staff presence with GPS & Photo logs</p>
          </div>
          <button
            onClick={fetchToday}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-900/20"
          >
            Reset to Today
          </button>
        </div>

        {/* --- FILTERS --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Specific Date</label>
              <input type="date" className="border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-500" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Start Date</label>
              <input type="date" className="border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-500" onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">End Date</label>
              <input type="date" className="border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-500" onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Month</label>
              <input type="number" placeholder="MM" className="border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-500" onChange={(e) => setFilters({ ...filters, month: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Year</label>
              <input type="number" placeholder="YYYY" className="border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-500" onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
            </div>
          </div>
          <button
            onClick={fetchFiltered}
            className="w-full mt-4 bg-slate-900 text-orange-500 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors border border-slate-700"
          >
            Search Records
          </button>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Staff Member</th>
                  <th className="p-4 font-bold text-center">Check In</th>
                  <th className="p-4 font-bold text-center">Check Out</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Work</th>
                  <th className="p-4 font-bold text-right">Location</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-500 font-medium">Updating logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center text-slate-400">No logs found for selected criteria.</td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item._id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.staff?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500">{item.staff?.role || "Staff"}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                            {item.checkIn?.time ? new Date(item.checkIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </span>
                          {item.checkIn?.image && (
                            <img
                              src={item.checkIn.image}
                              onClick={() => openImage(item.checkIn.image)}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
                              alt="Check-in"
                            />
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                            {item.checkOut?.time ? new Date(item.checkOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </span>
                          {item.checkOut?.image && (
                            <img
                              src={item.checkOut.image}
                              onClick={() => openImage(item.checkOut.image)}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
                              alt="Check-out"
                            />
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {item.isLate && <span className="w-fit text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">Late</span>}
                          {item.earlyCheckout && <span className="w-fit text-[10px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase">Early</span>}
                          {!item.isLate && !item.earlyCheckout && <span className="w-fit text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">On Time</span>}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-sm font-bold text-slate-700">
                          {item.totalMinutes ? `${Math.floor(item.totalMinutes / 60)}h ${item.totalMinutes % 60}m` : "—"}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {(item.checkIn?.location?.address || item.checkOut?.location?.address) ? (
                          <div className="group relative inline-block">
                            <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors">
                              📍 View Address
                            </button>
                            {/* Tooltip on Hover */}
                            <div className="invisible group-hover:visible absolute right-0 bottom-full mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-xl z-10 whitespace-normal text-left leading-tight">
                              {item.checkIn?.location?.address || item.checkOut?.location?.address}
                              <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- IMAGE LIGHTBOX --- */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeImage}>
          <div className="relative max-w-2xl w-full animate-in zoom-in-95 duration-200">
            <img src={previewImage} className="w-full rounded-2xl shadow-2xl border-4 border-slate-800" alt="Full Preview" />
            <button className="absolute -top-4 -right-4 bg-orange-600 text-white w-10 h-10 rounded-full font-bold shadow-lg">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;