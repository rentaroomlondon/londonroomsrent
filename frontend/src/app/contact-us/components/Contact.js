"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({
    contactMethod: "Call me",
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success("Message sent successfully!");

        setForm({
          contactMethod: "Call me",
          title: "Mr",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
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
            
            {/* Soft Ambient Background Glows */}
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

              {/* Info Items List */}
              <div className="space-y-5">
                
                {/* Address Card */}
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

                {/* Phone & Email Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <a
                    href="tel:02077905577"
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
                        020 7790 5577
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

            {/* Embedded Google Map */}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Contact Method & Title Selectors */}
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
                      className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
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

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +44 7123 456789"
                    required
                    className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] rounded-xl text-xs sm:text-sm text-[#0A192F] outline-none focus:ring-2 focus:ring-[#F9A370]/30 focus:border-[#F9A370] transition-all placeholder-gray-400"
                  />
                </div>

                {/* Message Textarea */}
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

                {/* Submit Button */}
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