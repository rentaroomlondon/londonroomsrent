import React from 'react';

const Details = ({ listing }) => {
  const formatDate = (dateObj) => {
    if (listing?.availableImmediately) return "Immediately";
    if (!dateObj) return "Check with agent";
    return new Date(dateObj?.$date || dateObj).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const details = [
    { label: "Property Reference", value: listing?.listingId, mobile: true },
    { label: "Room Number", value: `${listing?.roomLabel} (${listing?.floor})`, mobile: false },
    { label: "Monthly Rent", value: `£${listing?.monthlyPrice} per month`, color: "text-[#F27A3D]", mobile: true },
    { label: "Monthly Equivalent", value: `≈ £${listing?.monthlyPrice} per month`, mobile: false },
    { label: "Security Deposit", value: `£${listing?.deposit} (2 weeks)`, mobile: true },
    { label: "Holding Deposit", value: `£${listing?.holdingDeposit} (2 weeks)`, mobile: false },
    { label: "Minimum Tenancy", value: `${listing?.minTenancy} months`, mobile: true },
    { label: "Available From", value: formatDate(listing?.availableFrom), color: "text-[#10B981]", mobile: false },
    { label: "Furnishing", value: listing?.furnished ? "Fully Furnished" : "Unfurnished", mobile: true },
    { label: "Parking", value: listing?.parking?.available ? "Available" : "No Parking", mobile: false },
    { label: "EPC Rating", value: `${listing?.epcRating} (Good)`, color: "text-[#10B981]", mobile: true },
    { label: "Council Tax Band", value: `Band ${listing?.councilTaxBand} (Shared)`, mobile: false },
  ];

  return (
    <div className="md:mt-6 mt-3 bg-white md:border md:rounded-[20px] border-gray-100 md:shadow-sm overflow-hidden transition-all">
      
      {/* Header */}
      <div className="px-1 pt-3 md:px-8 md:py-6 md:border-b border-gray-100">
        <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
          Full Property Detail
        </h2>
      </div>

      <div className="px-1 py-1 md:px-8 md:py-6">
        {/* DESKTOP: 2-Column Grid */}
        <div className="hidden md:grid grid-cols-2 relative">
          
          {/* Vertical Divider line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#E2E7EE] hidden md:block"></div>
          
          {details.map((item, idx) => {
            const isLeftColumn = idx % 2 === 0;
            // ✅ Desktop Logic: Hide border for the last two items (last row)
            const isLastRow = idx >= details.length - 2;

            return (
              <div 
                key={idx} 
                className={`flex justify-between items-center py-4 
                  ${!isLastRow ? 'border-b border-[#E2E7EE]' : ''} 
                  ${isLeftColumn ? 'pr-7' : 'pl-7'} 
                `}
              >
                <span className="text-[#7A8FA0] text-[14px]">{item.label}</span>
                <span className={`text-[14px] font-bold text-[#0F253B] ${item.color || ''}`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* MOBILE: Single Column List */}
        <div className="md:hidden">
          {details.filter(d => d.mobile).map((item, idx, filteredArray) => (
            <div 
              key={idx} 
              className={`flex justify-between py-5 border-gray-100 
                ${idx !== filteredArray.length - 1 ? 'border-b' : ''}
              `}
            >
              <span className="text-[#6B7C8E] text-[13px]">{item.label}</span>
              <span className={`text-[13px] font-bold text-[#0F253B] ${item.color || ''}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;