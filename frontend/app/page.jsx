"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"

const WhatWeOffer = dynamic(() => import("@/components/what-we-offer"), {
  loading: () => <div className="h-96 bg-black" />,
})
const FounderSection = dynamic(() => import("@/components/founder-section"), {
  loading: () => <div className="h-96 bg-black" />,
})
const ContactSection = dynamic(() => import("@/components/contact-section"), {
  loading: () => <div className="h-96 bg-black" />,
})
const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => <div className="h-20 bg-black" />,
})
const ScholarshipPopup = dynamic(() => import("@/components/scholarship-popup"), {
  ssr: false,
})

export default function Home() {
  useEffect(() => {
    // Check if there's a hash in the URL on mount
    if (window.location.hash) {
      const id = window.location.hash.substring(1) // remove the #
      // Small delay to allow dynamic components to mount
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 500)
    }
  }, [])

  return (

    <div className="min-h-screen bg-black">
      <Navbar />
      <ScholarshipPopup />
      <HeroSection />
      <WhatWeOffer />
      <FounderSection />
      <ContactSection />
      <Footer />
    </div>

  )
}
