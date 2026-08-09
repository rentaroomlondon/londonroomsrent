import React from 'react'
import Hero from '../Shared/Hero'
import MaintenanceForm from './components/MaintenanceForm'

export const metadata = {
  title: "Report a Repair | LONDONROOMSRENT",

  description:
    "Report maintenance issues quickly with LONDONROOMSRENT. Log your repair request and our team will respond promptly.",

  robots: {
    index: false,
    follow: true, // allow internal links to pass SEO value
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/report-a-repair",
  },
};

const page = () => {
  return (
    <div>
        <Hero
            badge="Maintenance"
            title="Report a "
            highlight="Repair"
            description="Log your repair quickly and we'll respond within 30 minutes during office hours."
        />
        <MaintenanceForm />
    </div>
  )
}

export default page
