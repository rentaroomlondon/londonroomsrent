import React from "react";
import { Phone, MessageSquare, Star } from "lucide-react";

const ConsultantCard = () => {
  return (
    <div className="mt-4 md:mt-6">
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-[24px] font-bold text-[#0D1B2E] mb-6 border-b border-gray-100 pb-4">
          Your Letting Consultant
        </h2>

        <div className="bg-[#F4F7FA] rounded-3xl p-6 flex items-center justify-between border border-[#E9EDF2]">
          
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <img
              src="/woman-sitting.avif"
              className="w-[90px] h-[90px] rounded-full border-[3px] border-[#F58444] object-cover"
              alt="Sarah Kowalski"
            />

            <div>
              <h3 className="text-xl font-bold text-[#0D1B2E]">
                Sarah Kowalski
              </h3>
              <p className="text-sm text-[#9BA6B5] mt-1">
                Senior Letting Consultant
              </p>

              {/* STATS */}
              <div className="flex gap-8 mt-4">
                <div>
                  <div className="flex items-center gap-1 font-bold text-[#0D1B2E]">
                    4.9
                    <Star size={16} fill="#0D1B2E" stroke="none" />
                  </div>
                  <p className="text-xs text-[#9BA6B5]">Rating</p>
                </div>

                <div>
                  <div className="font-bold text-[#0D1B2E]">8 yrs</div>
                  <p className="text-xs text-[#9BA6B5]">Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button className="bg-[#F58444] text-white px-5 py-3 w-[120px] rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition">
                <Phone size={18} fill="currentColor" stroke="none" />
                <span className="text-sm font-semibold">Call</span>
            </button>

            <button className="bg-[#0D1B2E] text-white px-6 py-3 w-[120px] rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a2b42] transition">
                <MessageSquare size={18} fill="currentColor" stroke="none" />
                <span className="text-sm font-semibold">Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-1">
        <h2 className="text-lg font-semibold text-[#0D1B2E] mb-3">
          Your Consultant
        </h2>

        <div className="bg-[#F4F7FA] rounded-2xl p-4 border border-[#E9EDF2]">
          
          {/* TOP */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/woman-sitting.avif"
              className="w-[60px] h-[60px] rounded-full border-[2px] border-[#F58444] object-cover"
              alt="Sarah Kowalski"
            />

            <div>
              <h3 className="text-base font-bold text-[#0D1B2E]">
                Sarah Kowalski
              </h3>
              <p className="text-sm text-[#9BA6B5]">
                Senior Consultant
              </p>
            </div>
          </div>

          

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button className="flex-1 bg-[#F58444] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-medium">
              <Phone size={16} fill="currentColor" stroke="none" />
              Call
            </button>

            <button className="flex-1 bg-[#0D1B2E] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-medium">
              <MessageSquare size={16} fill="currentColor" stroke="none" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;