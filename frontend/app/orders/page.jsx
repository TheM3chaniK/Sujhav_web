import OrdersNavbar from "@/components/orders-navbar"
import OrdersContent from "@/components/orders-content"
import Footer from "@/components/footer"

export const metadata = {
  title: "My Orders - SUJHAV Store",
  description: "Track your orders and purchase history from SUJHAV Store.",
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-black">
      <OrdersNavbar />
      <OrdersContent />
      <Footer />
    </div>
  )
}
