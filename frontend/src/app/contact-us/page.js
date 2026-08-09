import React from 'react'
import Hero from '../Shared/Hero'
import Testimonial from '../Shared/Testimonial'
import Contact from './components/Contact'

// 🔥 SEO METADATA
export const metadata = {
  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  // 🔥 SEO TITLE (intent-based)
  title: "Contact LONDONROOMSRENT | Rooms for Rent in London & Flatshare Support",

  // 🔥 DESCRIPTION (conversion-focused)
  description:
    "Contact LONDONROOMSRENT to find rooms for rent in London. Get help with flatshares, property enquiries, and affordable accommodation across all London areas.",

  // ✅ CANONICAL
  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/contact-us",
  },

  // ✅ ROBOTS
  robots: {
    index: true,
    follow: true,
  },

  // ✅ OPEN GRAPH (SOCIAL SHARING)
  openGraph: {
    title: "Contact LONDONROOMSRENT | London Room Rental Experts",
    description:
      "Get in touch with LONDONROOMSRENT for room rentals, flatshares, and property enquiries across London.",
    url: "https://LONDONROOMSRENT.co.uk/contact-us",
    siteName: "LONDONROOMSRENT",
    type: "website",
    images: [
      {
        width: 1200,
        height: 630,
        alt: "Contact LONDONROOMSRENT London",
      },
    ],
  },

  // ✅ TWITTER
  twitter: {
    card: "summary_large_image",
    title: "Contact LONDONROOMSRENT",
    description:
      "Reach out to LONDONROOMSRENT for rooms, flatshares, and London rental support.",
  },

  // ⚠️ OPTIONAL
  keywords: [
    "contact LONDONROOMSRENT",
    "rooms for rent london contact",
    "flatshare london contact",
    "london rental help",
    "property enquiry london",
    "rent room london support",
  ],
};

const page = () => {
  return (
    <div>
      <Hero
        badge="Contact us"
        title="Where to "
        highlight="Find Us"
        description="We'd love to hear from you. Visit us at our office or reach out online."
      />

      <Contact />
      
      <Testimonial
        text="I would like to say, once again, how impressed I am with LONDONROOMSRENT. I would remark on the professionalism and responsibility of the agency and how pleasant everyone was. This has been a complete change for my past experience with estate agents."
        name="Anna Hudson"
        source="London Trustpilot"
        rating={5}
      />
    </div>
  )
}

export default page
