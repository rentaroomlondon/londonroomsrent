"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/Context/AuthContext";

const ProfileSection = () => {

  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    roomType: "",
    homeNumber: "",
    workNumber: "",
    propertyType: "",
    budgetFrom: "",
    budgetTo: "",
    occupants: "",
    needFromDate: "",
    notes: "",
    address: {}
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        address: user.address || {}
      });
    }
  }, [user]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name.startsWith("address.")) {

      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value
        }
      }));

    } else {

      setFormData({
        ...formData,
        [name]: value
      });

    }
  };

  const handleSave = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/update`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (data.user) {
        setUser(data.user);
        alert("Profile updated");
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-8 pb-20">

      {/* Personal Details */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

        <h3 className="text-lg font-bold text-slate-800 mb-6">My Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <SelectField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            options={['Mr','Mrs','Ms','Miss','Dr','Prof','Other']}
          />

          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <InputField
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />

        </div>

        <h3 className="text-lg font-bold text-slate-800 mt-10 mb-6">
          Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InputField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Mobile Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputField
            label="Home Number"
            name="homeNumber"
            value={formData.homeNumber}
            onChange={handleChange}
          />

          <InputField
            label="Work Number"
            name="workNumber"
            value={formData.workNumber}
            onChange={handleChange}
          />

        </div>

      </section>


      {/* Address */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Address Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <InputField
            label="Flat Number"
            name="address.flatNumber"
            value={formData.address?.flatNumber || ""}
            onChange={handleChange}
          />

          <InputField
            label="Building Name"
            name="address.buildingName"
            value={formData.address?.buildingName || ""}
            onChange={handleChange}
          />

          <InputField
            label="House Number"
            name="address.houseNumber"
            value={formData.address?.houseNumber || ""}
            onChange={handleChange}
          />

          <InputField
            label="Street"
            name="address.street"
            value={formData.address?.street || ""}
            onChange={handleChange}
          />

          <InputField
            label="Town"
            name="address.town"
            value={formData.address?.town || ""}
            onChange={handleChange}
          />

          <InputField
            label="Area"
            name="address.area"
            value={formData.address?.area || ""}
            onChange={handleChange}
          />

          <InputField
            label="County"
            name="address.county"
            value={formData.address?.county || ""}
            onChange={handleChange}
          />

          <InputField
            label="Postcode"
            name="address.postcode"
            value={formData.address?.postcode || ""}
            onChange={handleChange}
          />

          <SelectField
            label="Country"
            name="address.country"
            value={formData.address?.country || ""}
            onChange={handleChange}
            options={['United Kingdom','United States','Pakistan','India']}
          />

        </div>

      </section>


      {/* Requirements */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

        <h3 className="text-lg font-bold text-slate-800 mb-6">
          My Requirements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <SelectField
            label="Property Type"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            options={["Flat","House","Studio","House Share"]}
          />

          <SelectField
            label="Room Type"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            options={[
                "Any",
                "Studio",
                "1 Bedroom",
                "Single Room",
                "Double Room",
                "Ensuit Room"
            ]}
          />

          <InputField
            label="Budget From"
            name="budgetFrom"
            value={formData.budgetFrom}
            onChange={handleChange}
          />

          <InputField
            label="Budget To"
            name="budgetTo"
            value={formData.budgetTo}
            onChange={handleChange}
          />

          <InputField
            label="Date Required From"
            type="date"
            name="needFromDate"
            value={formData.needFromDate?.split("T")[0] || ""}
            onChange={handleChange}
          />

        </div>

        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 mt-6"
          placeholder="Add any specific requirements..."
        />

      </section>


      <div className="flex justify-end gap-4">

        <button
          onClick={handleSave}
          className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
        >
          Save All Details
        </button>

      </div>

    </div>
  );
};


// reusable inputs

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
    >
      <option value="">Please select...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProfileSection;