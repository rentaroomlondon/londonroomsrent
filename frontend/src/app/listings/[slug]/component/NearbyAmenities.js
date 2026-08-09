"use client";
import React, { useEffect, useState } from "react";
import { GraduationCap, Store, MapPin } from "lucide-react";

const NearbyAmenities = ({ listing }) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- SKELETON ---
  const SkeletonCard = () => (
    <div className="flex flex-col gap-4 p-5 bg-[#F1F4F7] rounded-[20px] border border-[#E2E7EE] animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div className="w-16 h-4 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  // --- ICON / STYLE ---
  const getAmenityStyles = (type) => {
    switch (type) {
      case "education":
        return {
          icon: <GraduationCap className="w-5 h-5" />,
          color: "text-indigo-600",
          label: "Education",
        };
      case "market":
        return {
          icon: <Store className="w-5 h-5" />,
          color: "text-emerald-600",
          label: "Shopping",
        };
      default:
        return {
          icon: <MapPin className="w-5 h-5" />,
          color: "text-slate-400",
          label: "Nearby",
        };
    }
  };

  // --- HAVERSINE DISTANCE ---
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371e3;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // --- OSRM WALKING TIME ---
  const getWalkingTime = async (lat1, lon1, lat2, lon2) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${lon1},${lat1};${lon2},${lat2}?overview=false`
      );
      const data = await res.json();

      if (data.routes?.length) {
        return `${Math.round(data.routes[0].duration / 60)} min walk`;
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchNearby = async () => {
      if (!listing?.location?.coordinates) {
        setLoading(false);
        return;
      }

      const [lon, lat] = listing.location.coordinates;

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"university|college|school"](around:5000,${lat},${lon});
          way["amenity"~"university|college|school"](around:5000,${lat},${lon});

          node["shop"](around:5000,${lat},${lon});
          way["shop"](around:5000,${lat},${lon});
        );
        out center;
      `;

      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            query
          )}`
        );

        const data = await res.json();

        if (!data.elements) return;

        // STEP 1: basic format + distance
        let formatted = data.elements
          .map((item) => {
            const itemLat = item.lat || item.center?.lat;
            const itemLon = item.lon || item.center?.lon;
            if (!itemLat || !itemLon) return null;

            const dist = getDistance(lat, lon, itemLat, itemLon);

            const isEducation = ["university", "college", "school"].includes(
              item.tags?.amenity
            );

            const type = isEducation ? "education" : "market";
            const styles = getAmenityStyles(type);

            return {
              id: item.id,
              name:
                item.tags?.name ||
                (isEducation ? "Education Center" : "Local Shop"),
              type,
              styles,
              distance: dist,
              coords: { lat: itemLat, lon: itemLon },
              subtext:
                item.tags?.brand ||
                item.tags?.shop ||
                item.tags?.amenity ||
                "Local Area",
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distance - b.distance)
          .filter(
            (v, i, a) => a.findIndex((t) => t.name === v.name) === i
          )
          .slice(0, 9);

        // STEP 2: get accurate time ONLY for top 6 (performance safe)
        const withTime = await Promise.all(
          formatted.map(async (item, index) => {
            if (index < 6) {
              const time = await getWalkingTime(
                lat,
                lon,
                item.coords.lat,
                item.coords.lon
              );
              return { ...item, time };
            }
            return {
              ...item,
              time: `${Math.max(1, Math.round(item.distance / 84))} min walk`,
            };
          })
        );

        setAmenities(withTime);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [listing]);

  return (
    <div className="w-full md:mt-6 mt-3 border-b md:border-b-0 border-gray-100 font-sans text-slate-900">
      <div className="bg-white md:rounded-[20px] md:border border-slate-100 md:p-10 md:shadow-sm">

        <div className="md:pb-4 md:border-b md:border-gray-100 mb-6">
          <h2 className="text-[17px] md:text-[24px] font-bold text-[#0C1F33]">
            Nearby Education & Shopping
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : error ? (
            <div className="col-span-full py-10 text-center text-red-400 text-sm">
              Failed to load nearby places.
            </div>
          ) : amenities.length > 0 ? (
            amenities.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 bg-[#F1F4F7] rounded-[20px] border border-[#E2E7EE] hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-white ${item.styles.color}`}>
                    {item.styles.icon}
                  </div>
                  <span className="text-[10px] font-black text-[#F27A3D] bg-orange-50 px-2.5 py-1 rounded-full uppercase">
                    {item.time}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {item.name}
                  </h4>

                  <div className="mt-2">
                    <p className={`text-[10px] font-black ${item.styles.color}`}>
                      {item.styles.label}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase truncate">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-400 text-sm">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyAmenities;