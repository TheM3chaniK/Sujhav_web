import Navbar from "@/components/navbar"
import AboutHero from "@/components/about-hero"
import WhySujhav from "@/components/why-sujhav"
import WhatWeThink from "@/components/what-we-think"
import SujhavSolution from "@/components/sujhav-solution"
import LogoSignificance from "@/components/logo-significance"
import Footer from "@/components/footer"

export const metadata = {
  title: "About Us - SUJHAV Coaching Institute",
  description:
    "Learn about SUJHAV's mission, vision, and approach to transforming education through application-based learning and career guidance.",
}

export default function AboutPage() {
  return (
    
    <div className="min-h-screen bg-black">
      <Navbar />
      <AboutHero />
      <WhySujhav />
      <WhatWeThink />
      <SujhavSolution />
      <LogoSignificance />
      <Footer />
    </div>
    
  )
}
