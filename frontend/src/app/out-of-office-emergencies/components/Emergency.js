import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Clock,
  Flame,
  Droplets,
  Zap,
  ShieldAlert,
  Wrench,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const Emergency = () => {
  const publicEmergencyContacts = [
    { icon: <Flame className="w-5 h-5 text-rose-500" />, label: 'Fire Services', phone: '999', badge: 'National' },
    { icon: <Droplets className="w-5 h-5 text-amber-500" />, label: 'National Gas Leak', phone: '0800 111 99', badge: 'Free 24/7' },
    { icon: <ShieldAlert className="w-5 h-5 text-blue-500" />, label: 'Police (Crime)', phone: '999 / 101', badge: 'Emergency/Non' },
    { icon: <Droplets className="w-5 h-5 text-cyan-500" />, label: 'Water Supply Issue', phone: '0800 316 980', badge: 'Thames Water' },
    { icon: <Zap className="w-5 h-5 text-yellow-500" />, label: 'Power Outage', phone: '105', badge: 'UK Power Cut' },
  ];

  const emergencyExamples = [
    'Uncontained Active Water Leaks',
    'Complete Boiler & Heating Failures in Winter',
    'Malfunctioning Outer Access Door Locks',
    'Total Electrical Blackout (Unit Specific)',
    'Gas Odor or Identified Leak',
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Header Banner */}
        <div className="bg-gradient-to-r from-[#0F253B] to-[#1E3A5F] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#F47C3C]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#F47C3C]/20 border border-[#F47C3C]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F47C3C] tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-[#F47C3C] animate-pulse" />
                24/7 Priority Guidance
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight leading-tight">
                Out of Hours & Emergency Care
              </h1>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Fast assistance guide for urgent maintenance concerns when our main office is closed.
              </p>
            </div>

            {/* Main Call Action Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 min-w-[280px]">
              <div className="w-12 h-12 bg-[#F47C3C] rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-[#F47C3C]/30">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Property Management Direct
              </span>
              <a
                href="tel:02045703191"
                className="text-2xl sm:text-3xl font-extrabold text-white hover:text-[#F47C3C] transition-colors mt-1"
              >
                020 4570 3191
              </a>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar - Public Services & Contacts */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Standard Operating Hours Box */}
            <div className="bg-white border border-[#E8E4DF] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F253B] font-bold text-sm uppercase tracking-wider border-b border-[#E8E4DF] pb-3">
                <Clock className="w-4 h-4 text-[#F47C3C]" />
                Standard Service Hours
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B7280]">
                <li className="flex justify-between items-center">
                  <span>Monday – Friday:</span>
                  <span className="font-semibold text-[#0F253B]">10:00 AM – 5:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Saturday:</span>
                  <span className="font-semibold text-[#0F253B]">10:00 AM – 3:00 PM</span>
                </li>
                <li className="flex justify-between items-center text-rose-600 font-medium pt-1">
                  <span>Sunday & Bank Holidays:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>

            {/* National Public Emergency Contacts */}
            <div className="bg-white border border-[#E8E4DF] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F253B]">
                  National Emergency Lines
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Contact utility providers directly for broad local outages.
                </p>
              </div>

              <div className="space-y-3">
                {publicEmergencyContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF8F5] border border-[#E8E4DF] hover:border-[#F47C3C]/50 rounded-xl transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-xs border border-[#E8E4DF]">
                        {contact.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F253B]">
                          {contact.label}
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-medium">
                          {contact.badge}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="text-xs font-bold text-[#F47C3C] group-hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* General Contact Direct CTA */}
            <a
              href="/contact-us"
              className="w-full bg-white border border-[#E8E4DF] hover:border-[#F47C3C] text-[#0F253B] py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-sm group"
            >
              <span>General Inquiry / Contact Us</span>
              <ArrowRight className="w-4 h-4 text-[#F47C3C] group-hover:translate-x-1 transition-transform" />
            </a>
          </aside>

          {/* Right Main Content Panel */}
          <main className="lg:col-span-8 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            
            {/* Step-by-Step Reporting Instructions */}
            <div className="space-y-6">
              <div className="space-y-1 border-b border-[#E8E4DF] pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F253B]">
                  Reporting an Urgent Out-of-Hours Issue
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  Follow these essential steps to ensure rapid dispatch and triage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Portal */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-5 space-y-3 relative flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#F47C3C] text-white text-xs font-bold flex items-center justify-center">
                        1
                      </span>
                      <span className="text-[10px] font-bold text-[#F47C3C] bg-[#F47C3C]/10 px-2 py-0.5 rounded-md uppercase">
                        Recommended
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0F253B]">
                      Log Issue via Online Portal
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Submit details and upload photos directly. Emergencies receive a response or callback within <strong>30 minutes</strong>.
                    </p>
                  </div>

                  <a
                    href="/report-a-repair"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#F47C3C] hover:text-[#e85e2f] pt-2"
                  >
                    <span>Log repair now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Option 2: Dedicated Phone */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="w-7 h-7 rounded-full bg-[#0F253B] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-[#0F253B]">
                      Call Property Management
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      If you cannot access the online form, dial our hotline directly to record an emergency alert.
                    </p>
                  </div>

                  <a
                    href="tel:02045703191"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F253B] hover:text-[#F47C3C] pt-2"
                  >
                    <span>Dial 020 4570 3191</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Emergency Classifications List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#F47C3C]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F253B]">
                  What Constitutes an Emergency?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyExamples.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DF] rounded-xl text-xs sm:text-sm font-medium text-[#0F253B]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Liability Notice Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Important Notice on Unauthorized Services
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Engaging third-party tradespeople without prior written authorization from property management may result in un-reimbursed costs or personal financial liability.
                </p>
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};

export default Emergency;