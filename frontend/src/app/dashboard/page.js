import React from 'react'
import Dashboard from './components/Dashboard'

// 🔒 BLOCK GOOGLE INDEXING
export const metadata = {
  title: "Dashboard",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const page = () => {
  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default page
