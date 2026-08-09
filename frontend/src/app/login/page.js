import React from 'react'
import Login from './components/Login'

export const metadata = {
  title: "Login | LONDONROOMSRENT",

  description:
    "Login to your LONDONROOMSRENT account to manage bookings, saved properties, and enquiries.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/login",
  },
};

const page = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default page
