import React from 'react'
import Hero from './components/Hero'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonial'
import Stats from '../components/Stats'
import MobileHowItWorks from './components/MobileHowItWorks'
import Testimonial from '../Shared/Testimonial'

export const metadata = {
  title: "How LONDONROOMSRENT Works | Find & Rent Rooms in London Step-by-Step",
  description:
    "Learn how LONDONROOMSRENT works. Discover how to find rooms for rent in London, explore flatshares, contact landlords, and move in quickly with our simple step-by-step process.",

  keywords: [
    "how to LONDONROOMSRENT",
    "how flatshare works london",
    "room rental process london",
    "find rooms london guide",
    "how to book room london",
    "renting process london uk",
  ],

  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/how-it-works",
  },

  openGraph: {
    title: "How LONDONROOMSRENT Works | London Room Rental Guide",
    description:
      "Step-by-step guide to finding and renting rooms in London with LONDONROOMSRENT.",
    url: "https://LONDONROOMSRENT.co.uk/how-it-works",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "article",
  },

  twitter: {
    card: "summary",
    title: "How LONDONROOMSRENT Works",
    description:
      "Learn how to find and rent rooms in London step-by-step with LONDONROOMSRENT",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <Hero />
      <div className="hidden md:block">
        <HowItWorks />
        <Testimonials />
        <Stats />
      </div>
      <div className="block md:hidden">
        <MobileHowItWorks />
        <Testimonial
          text="My experience has been very positive. The staff working at The LONDONROOMSRENT have proved to be honest, reliable and the team ensured a stress-free rent."
          name="Maria Ibañez"
          source="Madrid via Trustpilot"
          rating={5}
        />
      </div>
    </div>
  )
}

export default page
