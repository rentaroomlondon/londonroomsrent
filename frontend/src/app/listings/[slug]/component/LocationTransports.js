"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Loader2, Train, Bus, Navigation, TramFront } from "lucide-react";

const LocationTransport = ({ listing }) => {
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTransportStyles = (mode) => {
    switch (mode) {
      case "tube":
      case "elizabeth-line":
        return { icon: <Train className="w-5 h-5" />, color: "text-blue-700", bg: "bg-blue-50", label: mode === "elizabeth-line" ? "Elizabeth Line" : "Underground" };
      case "overground":
        return { icon: <TramFront className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50", label: "Overground" };
      case "bus":
        return { icon: <Bus className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50", label: "Bus" };
      case "national-rail":
      case "rail":
        return { icon: <Navigation className="w-5 h-5 rotate-45" />, color: "text-slate-700", bg: "bg-slate-100", label: "Rail" };
      case "dlr":
        return { icon: <Train className="w-5 h-5" />, color: "text-teal-600", bg: "bg-teal-50", label: "DLR" };
      default:
        return { icon: <Train className="w-5 h-5" />, color: "text-slate-400", bg: "bg-slate-50", label: "Transit" };
    }
  };

  useEffect(() => {
    const fetchStations = async () => {
      if (!listing?.location?.coordinates) return;
      const [lon, lat] = listing.location.coordinates;
      
      // We use a broad set of NaPTAN types to ensure we catch everything
      const stopTypes = "NaptanMetroStation,NaptanRailStation,NaptanBusCoachStation,NaptanPublicBusCoachTram";
      const radius = 1000; 
      const APP_KEY = "d2486266d2234f45b1b279ba0eee8ef7";

      try {
        const res = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}&app_key=${APP_KEY}`);
        const data = await res.json();

        if (data.stopPoints) {
          const formattedStops = data.stopPoints.flatMap(stop => {
            const modes = stop.modes || [];
            
            return modes.map(mode => {
              const validModes = ["tube", "overground", "bus", "dlr", "national-rail", "elizabeth-line"];
              if (!validModes.includes(mode)) return null;

              const styles = getTransportStyles(mode);
              
              // Improved Line Detection for Buses
              let lineName = "Public Route";
              if (mode === "bus") {
                // Bus lines are often in the 'lines' array or 'lineGroups'
                lineName = stop.lines?.map(l => l.name).join(", ") || "Local Bus";
              } else {
                lineName = stop.lineModeGroups?.find(g => g.modeName === mode)?.lineIdentifier?.[0]?.replace(/-/g, " ") || "Service";
              }

              return {
                id: `${stop.id}-${mode}`, 
                name: stop.commonName.replace(/ (Underground|Rail|DLR|Overground|Station|Stop) /g, " ").trim(),
                mode,
                modeLabel: styles.label,
                styles,
                distance: stop.distance,
                time: `${Math.round(stop.distance / 80)} min walk`, // Added "walk" back
                line: lineName
              };
            }).filter(Boolean);
          });

          // --- PRIORITY MIX ---
          // 1. Get unique stations (Avoid showing the same station twice if it has multiple platforms)
          const stations = formattedStops
            .filter(s => s.mode !== "bus")
            .sort((a, b) => a.distance - b.distance);
          
          const uniqueStations = stations.filter((v, i, a) => a.findIndex(t => t.name === v.name && t.mode === v.mode) === i);

          // 2. Get unique Bus stops
          const buses = formattedStops
            .filter(s => s.mode === "bus")
            .sort((a, b) => a.distance - b.distance);
            
          const uniqueBuses = buses.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

          // 3. Combine: Take top 4 stations and top 4 buses to ensure a 50/50 mix
          const finalSelection = [
            ...uniqueStations.slice(0, 4),
            ...uniqueBuses.slice(0, 4)
          ].sort((a, b) => a.distance - b.distance);

          setTransport(finalSelection);
        }
      } catch (err) {
        console.error("TfL Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, [listing]);

  const formatAddress = (address) => {
    if (!address) return "";

    // Remove starting number + optional letter (e.g. 92, 118A, 129b)
    return address.replace(/^\s*\d+[a-zA-Z]?\s*/, "");
  };

  return (
    <div className="w-full md:mt-6 mt-3 border-b md:border-b-0 border-gray-100 font-sans text-slate-900">
      <div className="bg-white md:rounded-[20px] md:border border-slate-100 md:p-10 md:shadow-sm">
        
        {/* Header with the specific border seen in desktop screenshot */}
        <div className="md:pb-4 md:border-b md:border-gray-100">
          <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
            Location & Transport
          </h2>
        </div>

        <div className="relative h-64 bg-slate-50 rounded-[20px] mb-4 md:my-6 flex items-center justify-center overflow-hidden border border-slate-100">
  
          {listing?.location?.coordinates?.[0] !== 0 ? (
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                listing.location.coordinates[0] - 0.0015
              },${
                listing.location.coordinates[1] - 0.0015
              },${
                listing.location.coordinates[0] + 0.0015
              },${
                listing.location.coordinates[1] + 0.0015
              }&layer=mapnik&marker=${
                listing.location.coordinates[1]
              },${listing.location.coordinates[0]}`}
            />
          ) : (
            <div className="text-gray-400 text-sm">Map loading...</div>
          )}

          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md text-white py-3 px-5 rounded-2xl flex items-center gap-3 z-10">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold truncate">
              {formatAddress(listing?.location?.address)}, {listing?.location?.postcode}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {transport.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col gap-4 p-5 bg-[#F1F4F7] rounded-[20px] border border-[#E2E7EE] hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl shadow-sm bg-white ${item.styles.color}`}>
                    {item.styles.icon}
                  </div>
                  <span className="text-[10px] font-black text-[#F27A3D] bg-orange-50 px-2.5 py-1 rounded-full uppercase">
                    {item.time}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm leading-tight break-words">
                    {item.name}
                  </h4>
                  <div className="flex flex-col gap-1 mt-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${item.styles.color}`}>
                      {item.modeLabel}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                      {item.line}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTransport;