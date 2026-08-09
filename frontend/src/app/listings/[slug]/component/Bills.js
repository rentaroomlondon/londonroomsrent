import React from 'react';

const Bills = ({ billsIncluded, wifiSpeed, councilTaxBand }) => {
  // Logic to determine the title
  const allIncluded = billsIncluded?.electricity && billsIncluded?.gas && billsIncluded?.water && billsIncluded?.wifi;
  const title = allIncluded ? "All Bills Included" : "Bills Included";

  // Data mapping for the items
  const billItems = [
    { key: 'electricity', label: 'Electricity', icon: '💡' },
    { key: 'gas', label: 'Gas', icon: '🔥' },
    { key: 'water', label: 'Water', icon: '💧' },
    { key: 'wifi', label: `${wifiSpeed || '400'}Mbps Wi-Fi`, icon: '📶' },
  ];

  // Filter only those that are true in your data
  const activeBills = billItems.filter(item => billsIncluded?.[item.key]);

  return (
    <div className="md:mt-6 mt-0 border-y md:border md:rounded-[20px] border-gray-100 md:shadow-sm overflow-hidden transition-all">
      
      {/* Header */}
      <div className="px-1 pt-6 md:px-8 md:py-6 md:border-b border-gray-100">
        <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
          {title}
        </h2>
      </div>

      {/* Content Area */}
      <div className="px-1 py-5 md:p-8">
        
        {/* MOBILE LAYOUT: Small Pill Tags */}
        <div className="flex flex-wrap gap-2 md:hidden">
          {activeBills.map((bill) => (
            <div 
              key={bill.key} 
              className="flex items-center gap-2 bg-[#F2F4F7] px-4 py-2.5 rounded-xl border border-[#E4E8EE]"
            >
              <span className="text-base">{bill.icon}</span>
              <span className="text-[#0F253B] text-[12px] font-bold">{bill.label}</span>
            </div>
          ))}
        </div>

        {/* DESKTOP LAYOUT: Large Square Cards */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {activeBills.map((bill) => (
            <div 
              key={bill.key} 
              className="flex flex-col items-center justify-center p-4 bg-[#F1F4F7] rounded-[14px] border border-[#E2E7EE] text-center"
            >
              <span className="text-3xl mb-3">{bill.icon}</span>
              <span className="text-[#0F253B] text-[12px] md:text-[13px] font-bold mb-2">
                {bill.label}
              </span>
              <span className="bg-[#E9F9F0] text-[#0F9455] px-3 py-1 rounded-full text-[10px] font-bold">
                Included
              </span>
            </div>
          ))}
        </div>

        {/* FOOTER (Desktop Only): Council Tax info */}
        <div className="hidden md:block mt-8 pt-6 md:border-t border-gray-100">
          <p className="text-[#7A8FA0] text-[12px] leading-relaxed">
            * Council tax is payable by tenants and split equally between occupants. 
            Current band for this property is <span className="font-bold">Band {councilTaxBand || 'A'}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bills;