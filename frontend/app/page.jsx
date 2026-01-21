import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import WhatWeOffer from "@/components/what-we-offer"
import FounderSection from "@/components/founder-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <WhatWeOffer />
      <FounderSection />
      <ContactSection />
      <Footer />
    </div>
    
  )
}
