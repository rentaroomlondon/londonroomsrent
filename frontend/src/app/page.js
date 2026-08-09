import React from 'react';
import TrustBadges from './components/TrustBadges';
import Office from './components/Office';
import Stats from './components/Stats';
import Testimonials from './components/Testimonial';
import AreaGuides from './components/AreaGuides';
import FeaturedRooms from './components/FeaturedRooms';
import HowItWorks from './components/HowItWorks';
import HeroSection from './components/HeroSection';

export const metadata = {
  title: "LONDONROOMSRENT | Rooms for Rent in London | Flatshare, Student Rooms & Apartments",
  description:
    "Find rooms for rent in London with LONDONROOMSRENT. Discover affordable flatshares, student accommodation, and apartments across all London areas. Verified listings, fast search, easy booking.",

  keywords: [
    "rooms for rent london",
    "LONDONROOMSRENT",
    "flatshare london",
    "cheap rooms london",
    "student accommodation london",
    "london room rental",
    "shared accommodation london",
    "houseshares london",
    "apartments for rent london",
    "double room london",
    "single room london",
  ],

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk",
  },

  openGraph: {
    title: "Rooms for Rent in London | Flatshare, Student Rooms & Apartments | LONDONROOMSRENT",
    description:
      "Browse verified rooms, flatshares, and apartments across London with LONDONROOMSRENT.",
    url: "https://LONDONROOMSRENT.co.uk",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Rooms for Rent in London",
    description:
      "Find affordable rooms and shared properties in London.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const structuredData = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "LONDONROOMSRENT",
      url: "https://LONDONROOMSRENT.co.uk",
      logo: "https://LONDONROOMSRENT.co.uk/LONDONROOMSRENT.png",
    },

    // Website Schema (Search box in Google)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LONDONROOMSRENT",
      url: "https://LONDONROOMSRENT.co.uk",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://LONDONROOMSRENT.co.uk/find-a-room?location={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <HeroSection />
      <HowItWorks />
      <FeaturedRooms />
      <AreaGuides />
      <Testimonials />
      <Stats />
      <Office />
      <div className="hidden lg:block">
        <TrustBadges />
      </div>
    </div>
  );
}