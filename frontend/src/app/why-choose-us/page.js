import React from 'react'
import Hero from './components/Hero'
import WhyUs from './components/WhyUs'
import Testimonial from '../Shared/Testimonial'
import LegalFooter from '../Shared/LegalFooter'

export const metadata = {
  title: "Why Choose LONDONROOMSRENT | Trusted Room Rentals",

  description:
    "Discover why LONDONROOMSRENT is trusted by tenants. We offer verified listings, secure bookings, and a hassle-free rental experience across London.",

  keywords: [
    "why choose LONDONROOMSRENT",
    "trusted room rentals london",
    "verified property listings london",
    "safe room rent london",
    "best room rental website london",
  ],

  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/why-choose-us",
  },

  openGraph: {
    title: "Why Choose LONDONROOMSRENT",
    description:
      "Trusted by tenants across London. Discover safe and reliable room rentals.",
    url: "https://LONDONROOMSRENT.co.uk/why-choose-us",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "article",
  },

  twitter: {
    card: "summary",
    title: "Why Choose Us | LONDONROOMSRENT",
    description:
      "Find out why tenants trust LONDONROOMSRENT.",
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
      <WhyUs />
      <Testimonial
        text="My experience has been very positive. The staff working at The LONDONROOMSRENT have proved to be honest, reliable and the team ensured a stress-free rent."
        name="Maria Ibañez"
        source="Madrid via Trustpilot"
        rating={5}
      />
      <LegalFooter
        items={[
          "© {year} LONDONROOMSRENT",
          "Property Redress Scheme",
          "My Deposits Protection Scheme",
          "Client Money Protect",
        ]}
      />
    </div>
  )
}

export default page
