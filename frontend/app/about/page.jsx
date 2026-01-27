import Navbar from "@/components/navbar"
import AboutContent from "@/components/about-content"

export const metadata = {
  title: "About Us - SUJHAV Coaching Institute",
  description:
    "Learn about SUJHAV's mission, vision, and approach to transforming education through application-based learning and career guidance.",
}

export default function AboutPage() {
  return (

    <div className="min-h-screen bg-black">
      <Navbar />
      <AboutContent />
    </div>

  )
}
