import React from 'react'
import PrivacyPolicy from './components/PrivacyPolicy'

export const metadata = {
  title: "Privacy Policy | LONDONROOMSRENT",

  description:
    "Read LONDONROOMSRENT’s Privacy Policy to understand how we collect, use, and protect your personal data in accordance with UK GDPR and data protection laws.",

  keywords: [
    "privacy policy LONDONROOMSRENT",
    "gdpr policy uk property website",
    "data protection london rentals",
    "user privacy LONDONROOMSRENT",
  ],

  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/privacy-policy",
  },

  openGraph: {
    title: "Privacy Policy | LONDONROOMSRENT",
    description:
      "Learn how LONDONROOMSRENT handles and protects your personal data in compliance with UK GDPR.",
    url: "https://LONDONROOMSRENT.co.uk/privacy-policy",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "article",
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy | LONDONROOMSRENT",
    description:
      "Understand how your data is collected, used, and protected by LONDONROOMSRENT.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  )
}

export default page
