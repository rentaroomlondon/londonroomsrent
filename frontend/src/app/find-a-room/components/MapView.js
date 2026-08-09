"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";

// 🔥 PERFECT PRICE MARKER (ACCURATE POSITION)
const createPriceIcon = (price) => {
  return L.divIcon({
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform: translate(-50%, -100%);
      ">
        
        <div style="
          background:#FF7A45;
          color:white;
          padding:6px 12px;
          border-radius:8px;
          font-size:12px;
          font-weight:bold;
          box-shadow:0 4px 10px rgba(0,0,0,0.2);
          white-space:nowrap;
        ">
          £${price}
        </div>

        <div style="
          width:0;
          height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:8px solid #FF7A45;
        "></div>

      </div>
    `,
    className: "",
    iconAnchor: [0, 0], // ✅ perfectly centered via transform
  });
};

// 🔥 AUTO FIT ALL MARKERS
const FitBounds = ({ listings }) => {
  const map = useMap();

  useEffect(() => {
    if (!listings?.length) return;

    const bounds = listings.map((item) => [
      item.location.coordinates[1],
      item.location.coordinates[0],
    ]);

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [listings, map]);

  return null;
};

const MapView = ({ listings }) => {

  // 🔥 OPTIMIZED MARKERS
  const markers = useMemo(() => {
    return listings
      ?.filter(
        (item) =>
          item.location?.coordinates?.[0] &&
          item.location?.coordinates?.[1]
      )
      .map((item) => ({
        id: item._id,
        lat: item.location.coordinates[1],
        lng: item.location.coordinates[0],
        price: item.monthlyPrice || 0,
      }));
  }, [listings]);

  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      preferCanvas={true}
    >
      {/* 🔥 LOCATIONIQ TILE */}
      <TileLayer
        url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}`}
      />

      <FitBounds listings={listings} />

      {/* 🔥 MARKERS */}
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={createPriceIcon(m.price)}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;