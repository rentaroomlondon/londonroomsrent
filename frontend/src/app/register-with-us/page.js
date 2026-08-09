import React from 'react'
import Register from './components/Register'

export const metadata = {
  title: "Create Account | LONDONROOMSRENT",

  description:
    "Create your LONDONROOMSRENT account to save properties, and manage your bookings.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/register",
  },
};

const page = () => {
  return (
    <div>
      <Register />
    </div>
  )
}

export default page
