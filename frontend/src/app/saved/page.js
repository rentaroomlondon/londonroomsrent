import React from 'react'
import Saved from './component/Saved'

export const metadata = {
  title: "Saved Properties | LONDONROOMSRENT",

  description:
    "View and manage your saved properties on LONDONROOMSRENT.",

  robots: {
    index: false,
    follow: false, // private page → better to block completely
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/saved",
  },
};

const page = () => {
  return (
    <div>
      <Saved />
    </div>
  )
}

export default page
