import React, { Suspense } from "react";
import PropertySearch from "./components/PropertySearch";

export const metadata = {
  title: "Find Rooms for Rent in London | Flatshare, Studios & Cheap Rooms",
  description:
    "Search rooms for rent in London with LONDONROOMSRENT. Explore flatshares, studios, and affordable rooms across all London areas with map-based search and verified listings.",

  keywords: [
    "rooms for rent london",
    "find a room london",
    "flatshare london",
    "cheap rooms london",
    "studio apartments london rent",
    "shared accommodation london",
    "rent room london map",
    "london property search",
  ],

  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/find-a-room",
  },

  openGraph: {
    title: "Find Rooms for Rent in London | LONDONROOMSRENT",
    description:
      "Browse rooms, flatshares, and apartments across London with an interactive map and real-time listings.",
    url: "https://LONDONROOMSRENT.co.uk/find-a-room",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "website",
    // No image → it's okay, Google will still index
  },

  twitter: {
    card: "summary",
    title: "Find Rooms for Rent in London",
    description:
      "Search and explore rooms, flatshares, and apartments in London using LONDONROOMSRENT.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PropertySearch />
      </Suspense>
    </div>
  );
};

export default page;