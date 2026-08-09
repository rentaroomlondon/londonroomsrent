import React from 'react';

const InputField = ({ label, placeholder, type = "text", required = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-gray-700"
    />
  </div>
);

export default function PaymentForm() {
  return (
    <div className="flex items-center justify-center p-4 font-sans py-14 md:py-20">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-sm border border-[#E8E4DF] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              {/* Simple Credit Card Icon Mockup */}
              <div className="w-6 h-4 border-2 border-orange-200 rounded-sm relative">
                <div className="absolute top-1 left-1 w-2 h-1 bg-orange-200"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Make a Payment</h1>
              <p className="text-xs text-gray-400">Fill in the form below to make the payment with a debit/credit card.</p>
            </div>
          </div>
          <hr className="mt-6 border-gray-100" />
        </div>

        {/* Form Body */}
        <form className="p-8 pt-2 space-y-6">
          
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField label="Room Reference Letter (A, B, C, D...)" placeholder="e.g. A" />
            <InputField label="Property Address" placeholder="Full property address" required />
            <InputField label="Payment Amount (£)" placeholder="0.00" required />
            <InputField label="Tenant First Name(s)" placeholder="" required />
            <InputField label="Tenant Surname" placeholder="" required />
            <InputField label="Tenant Email Address" placeholder="" required />
            <InputField label="Tenant Phone No." placeholder="" required />
            <InputField label="Additional Information" placeholder="Any notes..." />
          </div>

          {/* Divider with Label */}
          <div className="pt-4">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Cardholder's Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="Billing First Name(s)" placeholder="" required />
              <InputField label="Billing Surname" placeholder="" required />
              <InputField label="Billing Address Line 1" placeholder="" required />
              <InputField label="Billing Address Line 2" placeholder="" />
              <InputField label="City" placeholder="" required />
              <InputField label="Post / Zip Code" placeholder="" required />
              
              {/* Select Fields */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Country *</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-gray-700 appearance-none">
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">State (U.S. Only)</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm text-gray-400 appearance-none">
                  <option>Please select...</option>
                </select>
              </div>

              <InputField label="Cardholder Email Address" placeholder="" required />
              <InputField label="Cardholder Phone No." placeholder="" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#FF6B35] hover:bg-[#e85a25] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase text-sm tracking-wide"
            >
              Submit Payment 
              <span className="text-lg">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}