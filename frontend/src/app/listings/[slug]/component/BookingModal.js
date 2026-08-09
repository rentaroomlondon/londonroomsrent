"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/app/Context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const BookingModal = ({ isOpen, onClose, listing }) => {
  const { user, fetchUser } = useAuth();

  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const hasBookedRef = useRef(false); // 🔥 prevent double booking

  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "",
    message: "",
    name: "",
    email: "",
    phone: "",
  });

  // ============================
  // RESET MODAL
  // ============================
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setAuthMode("login");
        setBookingData({ date: "", timeSlot: "", message: "", name: "", email: "", phone: "", });
        setErrors({});
        hasBookedRef.current = false;
      }, 300);
    }
  }, [isOpen]);

  // ============================
  // AUTO BOOK AFTER LOGIN
  // ============================
  useEffect(() => {
    if (user && step === 2 && !hasBookedRef.current) {
      hasBookedRef.current = true;
      submitFinalBooking();
    }
  }, [user, step]);

  // ❗ IMPORTANT: AFTER HOOKS
  if (!isOpen) return null;

  // ============================
  // VALIDATION
  // ============================
  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.date) {
      newErrors.date = "Please select a date";
    }

    if (!bookingData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    // 👇 Guest validation
    if (!user) {
    if (!bookingData.name.trim()) newErrors.name = "Name is required";
    if (!bookingData.email.trim()) newErrors.email = "Email is required";
    if (!bookingData.phone || bookingData.phone.length < 8)
      newErrors.phone = "Valid phone required";
    }

    if (bookingData.message.length > 300) {
      newErrors.message = "Max 300 characters allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // NEXT STEP
  // ============================
  const handleNextStep = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitFinalBooking();
  };

  // ============================
  // API CALL
  // ============================
  const submitFinalBooking = async () => {
    if (!listing?._id) {
      alert("Listing not available. Please refresh.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            listingId: listing._id,
            viewingDate: bookingData.date,
            viewingSlot: bookingData.timeSlot,
            message: bookingData.message,
            userId: user?._id || null,

            // 👇 guest fields
            guestName: !user ? bookingData.name : null,
            guestEmail: !user ? bookingData.email : null,
            guestPhone: !user ? bookingData.phone : null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Booking failed");

      setStep(3);
    } catch (error) {
      console.error(error);
      alert(error.message);
      hasBookedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // AUTH SUCCESS
  // ============================
  const handleAuthSuccess = async () => {
    await fetchUser();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-[#0a192f]/60 backdrop-blur-sm transition-all duration-300">
      
      <div className="bg-white w-full h-[95%] sm:h-auto sm:max-h-[90vh] sm:max-w-125 sm:rounded-4xl rounded-t-4xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div>
              <h3 className="font-bold text-[#0a192f] text-lg">
                {step === 1 && "Book a Viewing"}
                {step === 2 &&
                  (authMode === "login" ? "Welcome Back" : "Create Account")}
                {step === 3 && "Request Sent"}
              </h3>

              {step !== 3 && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {listing?.title || "Property Viewing"}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">

              {/* 👤 Guest Info */}
              {!user && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500/20 ${
                        errors.name ? "border-red-400" : "border-gray-100"
                      }`}
                      value={bookingData.name}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, name: e.target.value })
                      }
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                     Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500/20 ${
                        errors.email ? "border-red-400" : "border-gray-100"
                      }`}
                      value={bookingData.email}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, email: e.target.value })
                      }
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Phone Number
                    </label>

                    <div
                      className={`rounded-2xl border bg-gray-50 focus-within:ring-2 focus-within:ring-orange-500/20 ${
                        errors.phone ? "border-red-400" : "border-gray-100"
                      }`}
                    >
                      <PhoneInput
                        country={"gb"} // default (change if needed)
                        value={bookingData.phone}
                        onChange={(phone) => {
                          setBookingData((prev) => ({
                            ...prev,
                            phone: phone || "",
                          }));
                        }}
                        inputClass="!w-full !bg-transparent !border-none !py-6 !pl-14 !text-sm"
                        buttonClass="!border-none !bg-transparent"
                        containerClass="!w-full"
                        dropdownClass="!text-black"
                        enableSearch
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* DATE */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Preferred Date
                </label>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full pl-12 p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500/20 ${
                      errors.date ? "border-red-400" : "border-gray-100"
                    }`}
                    value={bookingData.date}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, date: e.target.value });
                      setErrors({ ...errors, date: "" });
                    }}
                  />
                </div>

                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              {/* TIME SLOT */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Time of Day
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {["Morning", "Afternoon", "Evening"].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setBookingData({
                          ...bookingData,
                          timeSlot: slot,
                        });
                        setErrors({ ...errors, timeSlot: "" });
                      }}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        bookingData.timeSlot === slot
                          ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md"
                          : "bg-white text-gray-500 border-gray-100 hover:border-orange-500"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {errors.timeSlot && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.timeSlot}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Message (Optional)
                </label>

                <textarea
                  rows={3}
                  maxLength={300}
                  className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-orange-500/20 ${
                    errors.message ? "border-red-400" : "border-gray-100"
                  }`}
                  placeholder="Any specific request..."
                  value={bookingData.message}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      message: e.target.value,
                    });
                    setErrors({ ...errors, message: "" });
                  }}
                />

                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !bookingData.date ||
                  !bookingData.timeSlot ||
                  (!user &&
                    (!bookingData.name || !bookingData.email || !bookingData.phone))
                }
                className="w-full bg-[#e36b2c] hover:bg-[#c95a1f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                {loading
                  ? "Processing..."
                  : "Confirm Booking"
                  }
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex justify-between">
                <div className="text-xs text-[#c95a1f]">
                  <b>Viewing:</b> {bookingData.date} ({bookingData.timeSlot})
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-[10px] font-bold underline"
                >
                  Change
                </button>
              </div>

              {authMode === "login" ? (
                <LoginForm
                  onLoginSuccess={handleAuthSuccess}
                  onSwitchToRegister={() => setAuthMode("register")}
                />
              ) : (
                <RegisterForm
                  onRegisterSuccess={handleAuthSuccess}
                  onSwitchToLogin={() => setAuthMode("login")}
                />
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 size={50} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-[#0a192f]">
                Request Received!
              </h2>
              <p className="text-gray-500 text-sm">
                We’ll contact you shortly to confirm.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#0a192f] text-white py-4 rounded-2xl font-bold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;