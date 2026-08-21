"use client";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import Card from "./Card";
import { analytics } from "@/app/utils/analytics";

const RegisterPage = () => {
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
    website: "", // honeypot
  });

  const [loading, setLoading] = useState(false);

  // ============================
  // PAGE VIEW EVENT
  // ============================
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Safe call – uses your existing trackEvent helper under the hood
      analytics.registrationSubmit
        ? null // just ensure the module is loaded
        : null;

      // Fire page view
      import("@/app/utils/analytics").then(({ trackEvent }) => {
        trackEvent("register_page_view", {
          page_path: window.location.pathname,
        });
      }).catch(() => {});
    }
  }, []);

  // Budget options: 300 → 1000 (step 50)
  const budgetOptions = useMemo(() => {
    const options = [];
    for (let i = 300; i <= 1000; i += 50) {
      options.push(i);
    }
    return options;
  }, []);

  // Budget To options = only values greater than Budget From
  const budgetToOptions = useMemo(() => {
    if (!formData.budgetFrom) return budgetOptions;
    return budgetOptions.filter((val) => val > Number(formData.budgetFrom));
  }, [formData.budgetFrom, budgetOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Reset budgetTo if it's now invalid
      if (name === "budgetFrom" && updated.budgetTo && Number(updated.budgetTo) <= Number(value)) {
        updated.budgetTo = "";
      }

      return updated;
    });
  };

  const setPhone = (phone) => {
    setFormData((prev) => ({ ...prev, phone }));
  };

  // ---------- Strong Name Validation ----------
  const isValidRealName = (name) => {
    if (!name || typeof name !== "string") return false;
    const cleaned = name.trim();

    if (!/^[a-zA-Z\s'-]{2,40}$/.test(cleaned)) return false;
    if (!/[aeiouAEIOU]/.test(cleaned)) return false;
    if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(cleaned)) return false;
    if (/(.)\1{3,}/.test(cleaned)) return false;

    const fakePatterns = [
      "asdf", "qwer", "zxcv", "hjkl", "uiop", "bnm",
      "qwerty", "asdfgh", "zxcvbn", "qazwsx", "poiuyt",
      "jhdb", "hbds", "dsgh", "fghj", "cvbn", "tyui",
      "qwe", "asd", "zxc", "rty", "fgh", "vbn",
      "test", "testing", "tester", "testuser", "test1", "test2", "test3",
      "test87", "test123", "dummy", "fake", "sample", "example",
      "name", "fullname", "firstname", "lastname", "username", "user", "admin", "guest"
    ];

    const lowerName = cleaned.toLowerCase();
    if (fakePatterns.some((p) => lowerName.includes(p))) return false;

    return true;
  };

  // ---------- Strong Phone Validation ----------
  const isFakeOrInvalidPhone = (phone) => {
    if (!phone) return true;
    const fullPhone = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;

    if (!isValidPhoneNumber(fullPhone)) return true;

    try {
      const parsed = parsePhoneNumber(fullPhone);
      const nationalNumber = parsed.nationalNumber;

      const isSequential = (num) => {
        const seq = "01234567890123456789";
        const revSeq = "98765432109876543210";
        return seq.includes(num) || revSeq.includes(num);
      };

      const isRepeated = /^(\d)\1+$/.test(nationalNumber);

      const fakePatterns = [
        "123456789", "1234567890", "0123456789",
        "987654321", "9876543210",
        "111111111", "222222222", "999999999",
        "000000000", "555555555",
      ];

      if (
        isSequential(nationalNumber) ||
        isRepeated ||
        fakePatterns.some((f) => nationalNumber.includes(f))
      ) {
        return true;
      }

      return false;
    } catch {
      return true;
    }
  };

  // ---------- Strong Email Validation (Spammy) ----------
  const isSpammyEmail = (email) => {
    if (!email) return true;
    const local = (email.split("@")[0] || "").toLowerCase();

    const dotCount = (local.match(/\./g) || []).length;
    if (dotCount >= 3) return true;
    if (local.includes("..") || local.startsWith(".") || local.endsWith(".")) return true;
    if (local.length < 3) return true;

    // No vowels (common in keyboard smash)
    if (!/[aeiou]/.test(local)) return true;

    // Too many consecutive consonants
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(local)) return true;

    // Common test / throwaway patterns
    if (/^(test|temp|fake|asdf|qwerty|xxx|spam|abc|123|admin)/.test(local)) return true;
    if (/^\d+$/.test(local)) return true;
    if (/^[a-z]{1,2}\d+$/.test(local)) return true;
    if (local.length >= 8 && !/[aeiou].*[aeiou]/.test(local)) return true;

    return false;
  };

  const validateForm = () => {
    // Honeypot
    if (formData.website) return false;

    if (!isValidRealName(formData.firstName)) {
      toast.error("Please enter a valid first name");
      return false;
    }
    if (!isValidRealName(formData.surname)) {
      toast.error("Please enter a valid surname");
      return false;
    }

    // Email validation (basic format + spammy check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formData.email.trim()) || isSpammyEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (isFakeOrInvalidPhone(formData.phone)) {
      toast.error("Please enter a complete and valid phone number");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (
      formData.budgetFrom &&
      formData.budgetTo &&
      Number(formData.budgetTo) <= Number(formData.budgetFrom)
    ) {
      toast.error("Budget To must be higher than Budget From");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        // ✅ Analytics – registration success
        analytics.registrationSubmit("email");

        toast.success(data.message || "Registration successful. Please verify your email.");
        setFormData({
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
          website: "",
        });
        window.location.href = "/login";
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: "🏠", title: "Personalised Matches", desc: "Rooms matched to your budget, location and lifestyle" },
    { icon: "🔔", title: "Instant Alerts", desc: "Be first to know when new rooms become available" },
    { icon: "🤝", title: "Dedicated Consultant", desc: "A personal letting consultant guides you through the process" },
    { icon: "✅", title: "No Fees", desc: "Registering is completely free for tenants" },
  ];

  return (
    <div className="flex flex-col lg:flex-row font-sans bg-[#FDF7F2]">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 bg-[#1A1F2C] p-6 md:p-12 text-white relative overflow-hidden flex flex-col">
        <div
          className="absolute top-[-10] right-[-10%] w-64 h-64 rounded-full"
          style={{
            background: "linear-gradient(234.79deg, rgba(244, 124, 60, 0.1) 34.72%, rgba(142, 72, 35, 0.1) 83.57%)",
          }}
        ></div>

        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-4xl lg:text-[40px] font-playfair font-bold mb-6">
            Find Your <span className="text-orange-500 font-serif italic">Perfect</span> Room in London
          </h1>
          <p className="text-[#FFFFFF99] mb-12 text-[15px] font-sans">
            Take a few moments to supply some information. This helps us match your requirements much closer and send you relevant rooms as they come available.
          </p>

          <div className="space-y-8 mb-16">
            {benefits.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="bg-[#F47C3C] p-2 rounded-lg h-fit">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-[14px] font-sans leading-none mb-1">{item.title}</h4>
                  <p className="text-[#FFFFFF80] text-[13px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h5 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">
              Featured Available Rooms
            </h5>
            <Card />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 lg:p-12">
          <h2 className="text-[24px] font-bold text-[#1A2332] mb-2">Register with Us</h2>
          <p className="text-[#6B7280] text-sm mb-8">
            Items marked with * are required.{" "}
            <a href="tel:07419990126" className="text-orange-500 underline underline-offset-4">
              Call us on 07419990126
            </a>{" "}
            if you need help.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* HONEYPOT */}
            <div
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                height: 0,
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Title
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                >
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                  required
                  minLength={2}
                  maxLength={40}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Surname *
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                  required
                  minLength={2}
                  maxLength={40}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  E-mail Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                Phone No. *
              </label>
              <div className="phone-input-wrapper-register">
                <PhoneInput
                  country={"gb"}
                  value={formData.phone}
                  onChange={setPhone}
                  inputProps={{ name: "phone", required: true }}
                  containerClass="w-full"
                  inputClass="!w-full !h-[46px] !pl-14 !pr-4 !bg-gray-50 !border !border-gray-100 lg:!bg-white lg:!border-[#E8E4DF] !rounded-xl !text-sm !outline-none focus:!ring-2 focus:!ring-orange-500/20"
                  buttonClass="!bg-gray-50 !border !border-gray-100 lg:!bg-white lg:!border-[#E8E4DF] !rounded-l-xl"
                  dropdownClass="!bg-white !border-gray-200 !text-black"
                  searchClass="!bg-gray-100 !text-black !border-gray-200"
                  enableSearch
                  disableSearchIcon
                  placeholder="Phone No. *"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                required
                minLength={6}
              />
            </div>

            {/* Budget Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Budget From (£)
                </label>
                <select
                  name="budgetFrom"
                  value={formData.budgetFrom}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-sm"
                >
                  <option value="">No Minimum</option>
                  {budgetOptions.map((val) => (
                    <option key={val} value={val}>
                      £{val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Budget To (£)
                </label>
                <select
                  name="budgetTo"
                  value={formData.budgetTo}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-sm"
                  required
                >
                  <option value="">Select Maximum</option>
                  {budgetToOptions.map((val) => (
                    <option key={val} value={val}>
                      £{val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Number of Occupants
                </label>
                <input
                  type="number"
                  name="occupants"
                  value={formData.occupants}
                  min={1}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                  Type of Room
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-sm"
                >
                  <option>Any</option>
                  <option>Studio</option>
                  <option>Single Room</option>
                  <option>Double Room</option>
                  <option>Ensuit Room</option>
                  <option>1 Bedroom</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                Need From Date
              </label>
              <input
                type="date"
                name="needFromDate"
                value={formData.needFromDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] lg:text-[12px] font-bold text-[#6B7280] font-sans uppercase">
                Additional Notes / Comments
              </label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 lg:bg-white lg:border-[#E8E4DF] rounded-xl outline-none text-sm"
              ></textarea>
            </div>

            <div className="text-center space-y-4 pt-2">
              <p className="text-[10px] lg:text-[12px] text-gray-400 leading-relaxed">
                Please read our{" "}
                <a href="/privacy-policy" className="text-orange-500 underline">
                  Privacy Statement
                </a>
                . You only need to click once — a confirmation page will be shown when complete.
              </p>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#F27C4B] hover:bg-[#E06B3A] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                  loading ? "cursor-not-allowed opacity-70" : "group"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    Submit
                    <span className="transition-transform group-hover:translate-x-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Phone input styles */}
      <style jsx global>{`
        .phone-input-wrapper-register .react-tel-input .form-control {
          width: 100% !important;
          height: 46px !important;
          border-radius: 0.75rem !important;
          font-size: 0.875rem !important;
          padding-left: 52px !important;
          outline: none !important;
        }
        .phone-input-wrapper-register .react-tel-input .form-control:focus {
          box-shadow: 0 0 0 2px rgba(244, 124, 60, 0.2) !important;
        }
        .phone-input-wrapper-register .react-tel-input .flag-dropdown {
          border-radius: 0.75rem 0 0 0.75rem !important;
        }
        .phone-input-wrapper-register .react-tel-input .selected-flag {
          border-radius: 0.75rem 0 0 0.75rem !important;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;