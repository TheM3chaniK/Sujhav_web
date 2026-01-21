import Navbar from "@/components/navbar"
import GalleryHero from "@/components/gallery-hero"
import PhotoGallery from "@/components/photo-gallery"
import Footer from "@/components/footer"

export const metadata = {
  title: "Gallery - SUJHAV Coaching Institute",
  description:
    "Explore our campus, facilities, events, and memorable moments at SUJHAV Coaching Institute through our photo gallery.",
}

export default function GalleryPage() {
  return (
    
    <div className="min-h-screen bg-black">
      <Navbar />
      <GalleryHero />
      <PhotoGallery />
      <Footer />
    </div>
    
  )
}
