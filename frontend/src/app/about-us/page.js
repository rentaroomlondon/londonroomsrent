import React from "react";
import Hero from "../Shared/Hero";
import CredentialStrip from "./components/CredentialStrip";
import About from "./components/About";
import Testimonial from "../Shared/Testimonial";

// 🔥 SEO METADATA
export const metadata = {
  metadataBase: new URL("ttps://LONDONROOMSRENT.co.uk"),

  title: "About LONDONROOMSRENT | Rooms for Rent in London & Flatshare Experts",

  description:
    "Learn about LONDONROOMSRENT – a trusted platform helping people find rooms for rent in London. Discover our mission, verified listings, and affordable flatshare options across the city.",

  // ✅ CORRECT CANONICAL
  alternates: {
    canonical: "ttps://LONDONROOMSRENT.co.uk/about-us",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "About LONDONROOMSRENT | London Room Rental Platform",
    description:
      "Discover how LONDONROOMSRENT helps renters find affordable rooms, flatshares, and apartments across London.",
    url: "ttps://LONDONROOMSRENT.co.uk/about-us",
    siteName: "LONDONROOMSRENT",
    type: "website",
    images: [
      {
        url: "ttps://LONDONROOMSRENT.co.uk/About.jpg", // ✅ use jpg/png
        width: 1200,
        height: 630,
        alt: "About LONDONROOMSRENT London",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About LONDONROOMSRENT",
    description:
      "Find out how LONDONROOMSRENT helps you rent rooms and shared accommodation in London.",
    images: ["https://LONDONROOMSRENT.co.uk/About.jpg"],
  },

  keywords: [
    "about LONDONROOMSRENT",
    "rooms for rent london",
    "flatshare london",
    "london room rental platform",
    "cheap rooms london",
    "student accommodation london",
    "shared accommodation london",
  ],
};

// 🔥 PAGE
const page = () => {
  return (
    <div>
      <Hero
        badge="Our Story"
        title="About "
        highlight="Us"
        description="London's leading room rental agency since 2002 — built on trust, quality, and genuinely caring."
      />

      <CredentialStrip />

      <About />

      <Testimonial
        text="Incredible experience, very easy to work with and no doubt would I work with them again."
        name="Max Lochrie"
        source="Google"
        rating={5}
      />
    </div>
  );
};

export default page;