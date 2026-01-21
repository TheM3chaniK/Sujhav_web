"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { isBackendReady } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  ShoppingCart,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  User,
  Home,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function OrdersContent() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(() => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        return parsedUser
      } else {
        setUser(null)
        return null
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      setUser(null)
      return null
    }
  }, [])

  const fetchOrders = useCallback(async (currentUser) => {
    if (!currentUser?.id) return

    if (!isBackendReady()) {
      // Backend not ready: do not attempt network calls
      setLoading(false)
      setOrders([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication required")
        return
      }

      const res = await fetch(`/api/user/orders?userId=${encodeURIComponent(currentUser.id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch orders")
      }

      setOrders(json.orders || [])
    } catch (e) {
      console.error("Orders fetch error:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const currentUser = fetchUser()
    if (!isBackendReady()) {
      setLoading(false)
      return
    }

    if (currentUser) {
      fetchOrders(currentUser)
    } else {
      setLoading(false)
    }
    // Listen for external updates to orders (e.g., after payment) so the list refreshes without reload
    const onOrdersUpdated = () => {
      const freshUser = fetchUser()
      if (freshUser) fetchOrders(freshUser)
    }
    window.addEventListener("orders-updated", onOrdersUpdated)
    return () => {
      window.removeEventListener("orders-updated", onOrdersUpdated)
    }
  }, [fetchUser, fetchOrders])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "processing":
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }, [])

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }, [])

  const getOrderTypeIcon = useCallback((type) => {
    return type === "download" ? <Download className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />
  }, [])

  const getOrderTypeColor = useCallback((type) => {
    return type === "download"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-purple-500/10 text-purple-400 border-purple-500/20"
  }, [])

  const handleRedownload = useCallback((item) => {
    if (!item) return
    ;(async () => {
      try {
        const token = localStorage.getItem("token")
        const body = item.type === "note" ? { noteId: item.id } : { productId: item.productId || item.product_id }
        const res = await fetch("/api/notes/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const j = await res.json()
          throw new Error(j.error || "Download failed")
        }

        const contentType = res.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          const j = await res.json()
          const url = j.downloadUrl
          if (url) {
            const link = document.createElement("a")
            link.href = url
            link.download = `${item.name || "download"}.pdf`
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        } else {
          const blob = await res.blob()
          const link = document.createElement("a")
          const url = window.URL.createObjectURL(blob)
          link.href = url
          link.download = `${item.name || "download"}.pdf`
          link.target = "_blank"
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(link)
        }
      } catch (e) {
        console.error("Download failed:", e)
      }
    })()
  }, [])

  const EmptyOrdersState = useCallback(
    () => (
      <div className="text-center space-y-8 py-16">
        <div className="relative w-32 h-32 mx-auto">
          <div className="relative w-full h-full">
            <ShoppingCart className="w-32 h-32 text-green-400/60" />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="animate-bounce-package">
                <Package className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400/40 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-300/40 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-green-400">No Orders Yet</h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Your order history will appear here once you make your first purchase from the SUJHAV Store.
          </p>
          <p className="text-gray-500">Start exploring our premium study materials and exclusive merchandise!</p>
        </div>

        <Link href="/store">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Explore SUJHAV Store
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20">
            <Package className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400">Study Materials</div>
            <div className="text-sm text-gray-400">Premium Content</div>
          </div>
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20">
            <Download className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400">Instant Download</div>
            <div className="text-sm text-gray-400">Digital Products</div>
          </div>
          <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20">
            <ShoppingCart className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400">Merchandise</div>
            <div className="text-sm text-gray-400">Physical Products</div>
          </div>
        </div>
      </div>
    ),
    [],
  )

  const hasOrders = useMemo(() => (orders || []).length > 0, [orders])

  if (!user) {
    return (
      <div className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 py-16">
            <div className="relative w-32 h-32 mx-auto">
              <User className="w-32 h-32 text-gray-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-400">Please sign in to view your orders.</h2>
              <p className="text-xl text-gray-500 max-w-md mx-auto">
                You need to be logged in to access your order history and track your purchases.
              </p>
            </div>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              My Orders
            </span>
          </h1>
          <p className="text-xl text-gray-400">Track your purchases and download your study materials</p>
        </div>

        {loading && (
          <div className="text-center space-y-4 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4 py-16">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-medium">{error}</p>
              <Button onClick={() => fetchOrders(user)} className="mt-4 bg-green-500 hover:bg-green-600 text-black">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          (!hasOrders ? (
            <EmptyOrdersState />
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white/5 backdrop-blur-xl border border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl text-green-400">
                            {order.type === "download" ? "Download" : "Order"} #{order.id.slice(-8)}
                          </CardTitle>
                          <Badge className={getOrderTypeColor(order.type)}>
                            {getOrderTypeIcon(order.type)}
                            <span className="ml-1 capitalize">{order.type}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {order.total_amount === 0 ? "FREE" : `₹${order.total_amount}`}
                        </div>
                        <div className="text-sm text-gray-400">{order.order_items?.length || 0} item(s)</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=100&width=100&query=order-item-image"}
                            alt={item.name || "Order Item"}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-400">{item.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {item.type === "note" || item.type === "digital" ? "Digital" : "Physical"}
                            </Badge>
                            {item.subject && <span>Subject: {item.subject}</span>}
                            {item.class && <span>Class: {item.class}</span>}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="font-bold text-green-400">{item.price === 0 ? "FREE" : `₹${item.price}`}</div>
                          {(item.type === "note" || item.type === "digital") &&
                            (order.status === "completed" || order.status === "paid") &&
                            item.file_url && (
                              <Button
                                onClick={() => handleRedownload(item)}
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
      </div>

      <style jsx>{`
        @keyframes bounce-package {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
          60% { transform: translateY(-6px); }
        }
        .animate-bounce-package { animation: bounce-package 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
