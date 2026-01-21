import StoreNavbar from "@/components/store-navbar"
import StoreBanner from "@/components/store-banner"
import StoreProducts from "@/components/store-products"
import Footer from "@/components/footer"

export const metadata = {
  title: "SUJHAV Store - Study Materials & Merchandise",
  description:
    "Explore premium study materials, handwritten notes, and exclusive SUJHAV merchandise. Get the best resources for JEE, NEET, and board exam preparation.",
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-black">
      <StoreNavbar />
      <StoreBanner />
      <StoreProducts />
      <Footer />
    </div>
  )
}
