import React from 'react';

const AMENITY_MAP = {
  // 🔹 ROOM AMENITIES
  single_bed: { label: "Single Bed", icon: "🛌" },
  double_bed: { label: "Double Bed", icon: "🛌" },
  ensuite_bathroom: { label: "Ensuite Bathroom", icon: "🚿" },
  desk: { label: "Desk", icon: "👩‍💻" },
  chair: { label: "Chair", icon: "🪑" },
  wardrobe: { label: "Double Wardrobe", icon: "🧮" },
  chest_of_drawers: { label: "Chest of Drawers", icon: "🗄️" },
  mirror: { label: "Large Mirror", icon: "⬜" },
  tv: { label: "55\" Smart TV (Shared)", icon: "📺" },
  lockable_room: { label: "Bedroom Door Lock", icon: "🚪" },
  balcony: { label: "Private Balcony", icon: "🌅" },

  // 🔹 PROPERTY AMENITIES
  wifi: { label: "Superfast Wi-Fi", icon: "🌐" },
  heating: { label: "Gas Central Heating", icon: "🌡️" },
  air_conditioning: { label: "Air Conditioning", icon: "❄️" },
  washing_machine: { label: "Washing Machine", icon: "🧼" },
  dryer: { label: "Dryer", icon: "💨" },
  dishwasher: { label: "Dishwasher", icon: "🍽️" },
  fridge: { label: "Fridge", icon: "🧊" },
  freezer: { label: "Freezer", icon: "🧊" },
  microwave: { label: "Microwave", icon: "📟" },
  oven: { label: "Oven", icon: "📟" },
  shared_kitchen: { label: "Full Modern Kitchen", icon: "🍽️" },
  cleaning_service: { label: "Weekly Communal Clean", icon: "🧹" },
  garden: { label: "Garden Access", icon: "🌿" },
  parking: { label: "Parking", icon: "🚗" },
  lift: { label: "Elevator Access", icon: "🏗️" },
  security: { label: "Secure Front Door", icon: "🔒" },
  cctv: { label: "24/7 CCTV Security", icon: "🔭" },
};

const Amenities = ({ roomAmenities = [], propertyAmenities = [] }) => {
  // Merge the arrays and handle potential undefined values
  const allAmenities = [...new Set([...(roomAmenities || []), ...(propertyAmenities || [])])];

  return (
    // Added mt-6 to separate it from the Description component
    <div className="md:mt-6 mt-3 bg-white md:border-y md:border md:rounded-[20px] md:border-gray-100 md:shadow-sm overflow-hidden transition-all">
      
      {/* Header */}
      <div className="px-1 py-5 md:px-8 md:py-6 md:border-b border-gray-100">
        <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
          Room & House Amenities
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="px-1 py-5 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 md:gap-4">
          {allAmenities.length > 0 ? (
            allAmenities.map((key) => {
              const item = AMENITY_MAP[key] || { label: key.replace(/_/g, ' '), icon: "✅" };
              
              return (
                <div 
                  key={key}
                  className="flex items-center space-x-3 md:bg-[#F1F4F7] md:p-4 md:rounded-[12px] md:border md:border-[#E2E7EE] md:min-h-[55px]"
                >
                  <div className="flex-shrink-0 text-xl md:text-[20px] flex items-center justify-center">
                    {item.icon}
                  </div>
                  
                  <span className="text-[#334155] md:text-[#0F253B] text-[12.5px] md:text-[14px] font-medium leading-tight">
                    {item.label}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm italic col-span-full">No amenities listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Amenities;