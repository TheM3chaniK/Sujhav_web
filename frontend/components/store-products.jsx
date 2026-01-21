"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ShoppingCart,
  Download,
  Star,
  Users,
  BookOpen,
  Package,
  Plus,
  Minus,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import PaymentModal from "./payment-modal"
import { isBackendReady } from "@/lib/utils"

export default function StoreProducts() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [notes, setNotes] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [notification, setNotification] = useState(null)

  // Get user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Fetch products and notes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (!isBackendReady()) {
          setProducts([])
          setNotes([])
          return
        }

        const [productsRes, notesRes] = await Promise.all([fetch("/api/products"), fetch("/api/notes")])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData.products || [])
        }

        if (notesRes.ok) {
          const notesData = await notesRes.json()
          setNotes(notesData.notes || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch cart
  useEffect(() => {
    if (user?.id) {
      fetchCart()
    }
  }, [user])

  const fetchCart = async () => {
    if (!user?.id) return

    if (!isBackendReady()) {
      setCart([])
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/cart?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.items || [])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  // Payment modal state and handlers
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification("Your cart is empty", "error")
      return
    }
    if (!isBackendReady()) {
      showNotification("Payments are temporarily unavailable", "error")
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const token = localStorage.getItem("token")
      if (isBackendReady()) {
        await Promise.all(
          cart.map((item) =>
            fetch("/api/cart", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId: user.id,
                productId: item.product_id,
              }),
            })
          )
        )
      }

      await fetchCart()
      showNotification("Payment successful! Your order has been placed.")
      setShowPaymentModal(false)
    } catch (error) {
      console.error("Error clearing cart:", error)
      showNotification("Payment successful but failed to clear cart", "error")
    }
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Sync cart dialog visibility with URL hash (#cart)
  useEffect(() => {
    if (typeof window === "undefined") return

    const onHashChange = () => {
      setShowCart(window.location.hash === "#cart")
    }

    const onOpenCartEvent = () => {
      handleCartOpenChange(true)
    }

    // Open on mount if hash is present
    if (window.location.hash === "#cart") {
      setShowCart(true)
    }

    window.addEventListener("hashchange", onHashChange)
    window.addEventListener("open-cart", onOpenCartEvent)
    return () => {
      window.removeEventListener("hashchange", onHashChange)
      window.removeEventListener("open-cart", onOpenCartEvent)
    }
  }, [])

  // Wrapper to keep URL hash in sync when opening/closing the cart dialog
  const handleCartOpenChange = (open) => {
    if (typeof window === "undefined") {
      setShowCart(open)
      return
    }
    const currentHash = window.location.hash

    if (open) {
      // Only push a new history entry if we're not already at #cart
      if (currentHash !== "#cart") {
        window.history.pushState(null, "", "#cart")
      }
    } else {
      // If currently at #cart, replace the history entry to avoid Back reopening the cart
      if (currentHash === "#cart") {
        const base = window.location.pathname + window.location.search
        window.history.replaceState(null, "", base)
      }
    }

    setShowCart(open)
  }

  const addToCart = async (item, type) => {
    if (!user) {
      showNotification("Please sign in to add items to cart", "error")
      return
    }
    if (!isBackendReady()) {
      showNotification("Cart functionality temporarily unavailable", "error")
      return
    }

    setCartLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: item.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        await fetchCart()
        showNotification(`${item.name || item.title} added to cart!`)
      } else {
        const error = await response.json()
        showNotification(error.error || "Failed to add to cart", "error")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      showNotification("Failed to add to cart", "error")
    } finally {
      setCartLoading(false)
    }
  }

  const updateCartQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId)
      return
    }
    if (!isBackendReady()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: itemId,
          quantity: newQuantity,
        }),
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const removeFromCart = async (itemId) => {
    if (!isBackendReady()) {
      showNotification("Cart operations unavailable", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: itemId,
        }),
      })

      if (response.ok) {
        await fetchCart()
        showNotification("Item removed from cart")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const downloadFreeNote = async (note) => {
    if (!user) {
      showNotification("Please sign in to download notes", "error")
      return
    }
    if (!isBackendReady()) {
      showNotification("Downloads are temporarily unavailable", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/notes/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          noteId: note.id,
        }),
      })

      if (response.ok) {
        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          const json = await response.json()
          const url = json.downloadUrl
          if (url) {
            window.open(url, "_blank")
            showNotification(`${note.title} download started`) 
          } else {
            showNotification("Download available, but no URL provided", "error")
          }
        } else {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${note.title}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          showNotification(`${note.title} downloaded successfully!`)
        }
      } else {
        const error = await response.json()
        showNotification(error.error || "Download failed", "error")
      }
    } catch (error) {
      console.error("Error downloading note:", error)
      showNotification("Download failed", "error")
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const ProductCard = ({ item, type }) => {
    const isInCart = cart.some((cartItem) => cartItem.product_id === item.id)
    const isFree = type === "note" || item.price === 0

    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
            <Image
              src={
                item.images?.[0] ||
                item.image_url ||
                (type === "note" ? "/notes-cover.png" : "/generic-product-display.png")
              }
              alt={item.name || item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isFree && <Badge className="absolute top-2 right-2 bg-green-500 text-black font-semibold">FREE</Badge>}
          </div>
          <CardTitle className="text-lg text-green-400 line-clamp-2">{item.name || item.title}</CardTitle>
          {item.description && <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {!isFree && (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-400">₹{item.price}</span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="text-sm text-gray-500 line-through">₹{item.original_price}</span>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                {item.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                )}
                {item.student_count && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{item.student_count}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.subject && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{item.subject}</Badge>}
            {item.class && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Class {item.class}</Badge>
            )}
            {item.stream && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">{item.stream}</Badge>
            )}
          </div>

          <div className="flex space-x-2">
            {type === "note" && isFree ? (
              <Button
                onClick={() => downloadFreeNote(item)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                disabled={cartLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Free
              </Button>
            ) : (
              <Button
                onClick={() => addToCart(item, type)}
                disabled={isInCart || cartLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:opacity-50"
              >
                {cartLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isInCart ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <ShoppingCart className="mr-2 h-4 w-4" />
                )}
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const CartDialog = () => (
    <Dialog open={showCart} onOpenChange={handleCartOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-400">Shopping Cart ({cartItemCount} items)</DialogTitle>
          <DialogDescription>Review your items before checkout</DialogDescription>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/generic-product-display.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-400">{item.name}</h3>
                  <p className="text-sm text-gray-400">₹{item.price} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.product_id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}

              <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-400">₹{cartTotal}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Cart Button */}
      {user && cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => handleCartOpenChange(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold shadow-lg"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Cart ({cartItemCount})
          </Button>
        </div>
      )}

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-green-500/20">
          <TabsTrigger value="products" className="data-[state=active]:bg-green-500/20">
            <Package className="mr-2 h-4 w-4" />
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-green-500/20">
            <BookOpen className="mr-2 h-4 w-4" />
            Study Notes ({notes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-8">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Products Available</h3>
              <p className="text-gray-500">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} item={product} type="product" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-8">
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Study Notes Available</h3>
              <p className="text-gray-500">Check back later for new study materials!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <ProductCard key={note.id} item={note} type="note" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CartDialog />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartItems={cart}
        totalAmount={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
