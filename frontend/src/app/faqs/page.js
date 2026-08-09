import React from 'react'
import Hero from '../Shared/Hero'
import Testimonial from '../Shared/Testimonial'
import LegalFooter from '../Shared/LegalFooter'
import DynamicFaq, { faqContent } from './components/faqContent'
import FaqSchema from './components/FaqSchema'

export const metadata = {
  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  title: "Tenant FAQs | Rooms for Rent in London, Flatshare & Rental Help",

  description:
    "Find answers to common questions about renting rooms in London. Learn about deposits, contracts, bills, flatshares, and how to find affordable accommodation with LONDONROOMSRENT.",

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/faqs",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Tenant FAQs | LONDONROOMSRENT London Rental Help",
    description:
      "Explore frequently asked questions about rooms for rent, flatshares, deposits, and renting in London.",
    url: "https://LONDONROOMSRENT.co.uk/faqs",
    siteName: "LONDONROOMSRENT",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LONDONROOMSRENT FAQs",
    description:
      "Answers to common questions about renting rooms and flatshares in London.",
  },

  keywords: [
  "rooms for rent london faqs",
  "flatshare london questions",
  "renting room london guide",
  "deposit rules london rent",
  "student accommodation london faqs",
  "cheap rooms london help",
  "how to LONDONROOMSRENT",
  ],
};

const page = () => {
  return (
    <div>

       {/* ✅ VERY IMPORTANT (SEO STRUCTURE DATA) */}
      <FaqSchema data={faqContent.All} />

      <Hero
        badge="Help Centre"
        title="Tenant"
        highlight="FAQs"
        description="We've compiled answers to the most common questions. If you have further questions, please"
        linkText="contact us"
        linkHref="/contact-us"
      />
      <DynamicFaq />
      <Testimonial
        text="Incredible experience, very easy to work with and no doubt would I work with them again."
        name="Max Lochrie"
        source="Google"
        rating={5}
      />
      <LegalFooter
        items={[
          "© {year} LONDONROOMSRENT",
        ]}
      /> 
    </div>
  )
}

export default page
