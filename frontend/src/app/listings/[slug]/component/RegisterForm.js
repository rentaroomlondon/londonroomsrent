"use client"
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    budgetFrom: "",
    budgetTo: "",
    occupants: 1,
    roomType: "Any",
    needFromDate: "",
    notes: "",
    isVerified: true,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1️⃣ Register
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // 2️⃣ Auto Login immediately
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT
        body: JSON.stringify({
            email: formData.email,
            password: formData.password
        })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);

        toast.success("Account created & logged in!");

        onRegisterSuccess && onRegisterSuccess(loginData);

    } catch (err) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
      
      {/* SAME DESIGN START */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
          <select name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm">
            <option>Mr</option><option>Mrs</option><option>Ms</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">First Name*</label>
          <input name="firstName" value={formData.firstName} required onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Surname*</label>
        <input name="surname" value={formData.surname} required onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Email*</label>
        <input name="email" type="email" value={formData.email} required onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      {/* 🔥 ADDED PHONE (same design style) */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Phone*</label>
        <input name="phone" type="tel" value={formData.phone} required onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Password*</label>
        <input name="password" type="password" value={formData.password} required onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      {/* 🔥 SAME GRID — just added budgetFrom */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Budget From</label>
          <input name="budgetFrom" type="number" value={formData.budgetFrom} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Budget (Weekly)</label>
          <input name="budgetTo" type="number" value={formData.budgetTo} placeholder="Max £" onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
        </div>
      </div>

      {/* 🔥 SAME STYLE CONTINUE */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Occupants</label>
          <input name="occupants" type="number" min={1} value={formData.occupants} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Room Type</label>
          <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm">
            <option>Any</option>
            <option>Studio</option>
            <option>Single Room</option>
            <option>Double Room</option>
            <option>Ensuit Room</option>
            <option>1 Bedroom</option>
          </select>
        </div>
      </div>

      {/* 🔥 DATE */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Need From Date</label>
        <input name="needFromDate" type="date" value={formData.needFromDate} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      {/* 🔥 NOTES */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Additional Notes</label>
        <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-sm" />
      </div>

      {/* BUTTON SAME */}
      <button 
        disabled={loading}
        className="w-full bg-[#0a192f] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        {loading ? "Creating Account..." : "Create My Account"}
      </button>

      <div className="text-center">
        <button type="button" onClick={onSwitchToLogin} className="text-xs text-gray-500 hover:text-orange-500 font-medium">
          Already have an account? <span className="text-orange-500 font-bold">Login</span>
        </button>
      </div>
    </form>
  );
}