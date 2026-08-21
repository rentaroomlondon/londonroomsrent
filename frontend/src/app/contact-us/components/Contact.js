"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { analytics } from "@/app/utils/analytics";

const Contact = () => {
  const [form, setForm] = useState({
    contactMethod: "Call me",
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
  });

  const [loading, setLoading] = useState(false);

  // ============================
  // PAGE VIEW EVENT
  // ============================
  useEffect(() => {
    analytics.trackEvent
      ? analytics.trackEvent("contact_page_view", {
          page_path: window.location.pathname,
        })
      : null;

    // Safer direct call (matches your analytics helper style)
    if (typeof window !== "undefined") {
      // Use the trackEvent helper if you export it, otherwise fire via existing pattern
      import("@/app/utils/analytics").then(({ trackEvent }) => {
        trackEvent("contact_page_view", {
          page_path: window.location.pathname,
        });
      }).catch(() => {});
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const setDirectValue = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // VALIDATION HELPERS (copied from first Contact)
  // ============================
  const isValidRealName = (name) => {
    if (!name || typeof name !== "string") return false;

    const cleaned = name.trim();

    // 1. Basic format (letters, space, ' and - only) + min 2 chars
    if (!/^[a-zA-Z\s'-]{2,40}$/.test(cleaned)) return false;

    // 2. Must contain at least one vowel
    if (!/[aeiouAEIOU]/.test(cleaned)) return false;

    // 3. Reject 4 or more consecutive consonants
    if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(cleaned)) {
      return false;
    }

    // 4. Reject repeated characters (aaaa, bbbb, etc.)
    if (/(.)\1{3,}/.test(cleaned)) return false;

    // 5. Reject common keyboard smash / random patterns
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
    if (fakePatterns.some((pattern) => lowerName.includes(pattern))) {
      return false;
    }

    return true;
  };

  const isFakeOrInvalidPhone = (phone) => {
    if (!phone) return true;

    const fullPhone = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;

    if (!isValidPhoneNumber(fullPhone)) {
      return true;
    }

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
        "123456789",
        "1234567890",
        "0123456789",
        "987654321",
        "9876543210",
        "111111111",
        "222222222",
        "999999999",
        "000000000",
        "555555555",
      ];

      if (
        isSequential(nationalNumber) ||
        isRepeated ||
        fakePatterns.some((fake) => nationalNumber.includes(fake))
      ) {
        return true;
      }

      return false;
    } catch (err) {
      return true;
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, message, website } = form;

    // Honeypot
    if (website) {
      return false;
    }

    if (!isValidRealName(firstName)) {
      toast.error("Please enter a valid first name");
      return false;
    }
    if (!isValidRealName(lastName)) {
      toast.error("Please enter a valid surname");
      return false;
    }

    // Strong Email Validation
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const localPart = cleanEmail.split("@")[0];

    const isSuspicious =
      localPart.length < 4 ||
      (localPart.match(/\./g) || []).length >= 2 ||
      localPart.includes("..") ||
      localPart.startsWith(".") ||
      localPart.endsWith(".") ||
      /^[0-9]+$/.test(localPart) ||
      /^(test|fake|dummy|sample|admin|user|guest|asdf|qwer)/.test(localPart);

    if (isSuspicious) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (isFakeOrInvalidPhone(phone)) {
      toast.error("Please enter a complete and valid phone number");
      return false;
    }

    if (
      message &&
      message.trim().length > 10 &&
      !/\s/.test(message.trim()) &&
      /^[a-zA-Z0-9]+$/.test(message.trim())
    ) {
      toast.error("Please enter a proper message");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ Analytics – contact form submit
        analytics.contactFormSubmit();

        toast.success("Message sent successfully!");

        setForm({
          contactMethod: "Call me",
          title: "Mr",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          website: "",
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FAF8F5] min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F9A370]/15 border border-[#F9A370]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#e87d46] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Connect With Our Team</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A192F] tracking-tight">
            We'd Love to <span className="text-[#F9A370]">Hear From You</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed">
            Have questions about room viewings, tenancies, or property management? Reach out and our London team will get back to you promptly.
          </p>
        </div>

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-[#E8E4DF] bg-white">
          
          {/* LEFT COLUMN: Office Info & Map */}
          <div className="lg:col-span-5 bg-[#0A192F] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#F9A370]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F9A370]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  London Office
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Visit us or get in touch through our primary contact channels.
                </p>
              </div>

              <div className="space-y-5">
                
                {/* Address */}
                <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                  <div className="p-2.5 bg-[#F9A370]/20 text-[#F9A370] rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#F9A370]">
                      Headquarters Address
                    </div>
                    <div className="text-xs sm:text-sm text-gray-200 mt-0.5 leading-snug">
                      118 Cricklewood Broadway <br />
                      London, NW2 3EJ
                    </div>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <a
                    href="http://wa.me/+447950309760"
                    className="flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-md group"
                  >
                    <div className="p-2.5 bg-[#F9A370]/20 text-[#F9A370] rounded-xl shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#F9A370]">
                        Phone Number
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#F9A370] transition-colors">
                        +447950309760
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:info@LONDONROOMSRENT.co.uk"
                    className="flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-md group"
                  >
                    <div className="p-2.5 bg-[#F9A370]/20 text-[#F9A370] rounded-xl shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#F9A370]">
                        Email Address
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#F9A370] transition-colors">
                        info@LONDONROOMSRENT.co.uk
                      </div>
                    </div>
                  </a>
                </div>

                {/* Opening Hours */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F9A370] uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>Office Working Hours</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-gray-300 pt-1 border-t border-white/10">
                    <span>Monday – Friday:</span>
                    <span className="font-semibold text-white text-right">10:00 – 18:00</span>
                    <span>Saturday:</span>
                    <span className="font-semibold text-white text-right">11:00 – 17:00</span>
                    <span>Sunday:</span>
                    <span className="font-semibold text-red-400 text-right">Closed</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Map */}
            <div className="mt-8 relative z-10">
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps?q=118+Cricklewood+Broadway,+NW2+3EJ,+London&output=embed"
                  className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-[#0A192F]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                  <CheckCircle2 className="w-3 h-3 text-[#F9A370]" />
                  <span>Main Office Location</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-xl mx-auto w-full space-y-6">
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill out the details below and a team member will contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
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
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Contact Method & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Preferred Response Method
                    </label>
                    <select
                      name="contactMethod"
                      value={form.contactMethod}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm font-semibold text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all cursor-pointer"
                    >
                      <option value="Call me">Call me back</option>
                      <option value="Email me">Email me back</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Title
                    </label>
                    <select
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm font-semibold text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all cursor-pointer"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="e.g. John"
                      required
                      minLength={2}
                      maxLength={40}
                      className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Surname *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Doe"
                      required
                      minLength={2}
                      maxLength={40}
                      className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                    className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all placeholder-gray-400"
                  />
                </div>

                {/* Phone – now using PhoneInput */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Phone Number *
                  </label>
                  <div className="rounded-xl border border-[#E8E4DF] bg-[#FAF8F5] overflow-hidden focus-within:ring-2 focus-within:ring-[#F9A370]/30 focus-within:border-[#F9A370]">
                    <PhoneInput
                      country={"gb"}
                      value={form.phone}
                      onChange={(phone) => setDirectValue("phone", phone)}
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                      containerClass="w-full"
                      inputClass="!w-full !h-[50px] !pl-14 !pr-4 !bg-transparent !border-none !text-[#0A192F] !text-sm !outline-none"
                      buttonClass="!bg-transparent !border-none"
                      dropdownClass="!text-black"
                      enableSearch
                      placeholder="Phone Number *"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    How Can We Help You?
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about the property you are interested in or ask any question..."
                    className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all resize-none placeholder-gray-400"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#F9A370] hover:bg-[#e38d5b] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-[#F9A370]/25 transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-2 ${
                    loading ? "cursor-not-allowed opacity-80" : "group"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;