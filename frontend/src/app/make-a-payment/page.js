import React from 'react'
import Hero from '../Shared/Hero'
import LegalFooter from '../Shared/LegalFooter'
import PaymentForm from './components/PaymentForm'

export const metadata = {
  title: "Secure Payment | LONDONROOMSRENT",

  description:
    "Make secure rent payments online using your debit or credit card.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/make-a-payment",
  },
};

const page = () => {
  return (
    <div>
      <Hero
        badge="Secure Payment"
        title="Make a "
        highlight="Payment"
        description="Pay your rent securely online using a debit or credit card."
      />
      <PaymentForm />
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
