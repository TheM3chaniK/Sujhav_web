"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { isBackendReady } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export default function PaymentModal({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState("review") // 'review', 'processing', 'success', 'error'
  const [error, setError] = useState("")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    if (!window.Razorpay) {
      loadRazorpay()
    } else {
      setRazorpayLoaded(true)
    }
  }, [])

  const handlePayment = async () => {
    if (!isBackendReady()) {
      setError("Payments are temporarily unavailable")
      return
    }

    if (!razorpayLoaded) {
      setError("Payment system is loading. Please try again.")
      return
    }

    setIsProcessing(true)
    setPaymentStep("processing")
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Please login to continue")
      }

      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.product_id || item.productId || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
          })),
          totalAmount,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Failed to create order")
      }

    const orderData = await orderResponse.json()
    const dbOrderId = orderData.orderId
    // Optionally set state for UI, but use dbOrderId for verification to avoid stale state in handler
    setOrderId(orderData.orderId)

      // Get user data for prefill
      const userData = JSON.parse(localStorage.getItem("user") || "{}")

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SUJHAV Institute",
        description: "Study Materials & Courses",
        image: "/logo.png",
  order_id: orderData.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderId,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verifyData = await verifyResponse.json()
            setPaymentStep("success")

            setTimeout(() => {
              onPaymentSuccess(verifyData)
              // Notify other components (Orders page) to refresh their data without a hard reload
              try {
                window.dispatchEvent(new Event("orders-updated"))
              } catch (e) {
                console.warn("Could not dispatch orders-updated event", e)
              }
              onClose()
              setPaymentStep("review")
              setIsProcessing(false)
            }, 2000)
          } catch (error) {
            console.error("Payment verification error:", error)
            setError("Payment verification failed. Please contact support.")
            setPaymentStep("error")
            setIsProcessing(false)
          }
        },
        prefill: {
          name: userData.fullName || userData.name || "Student",
          email: userData.email || "",
          contact: userData.phone || "9999999999",
        },
        notes: {
          address: "SUJHAV Institute",
        },
        theme: {
          color: "#10B981",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            setPaymentStep("review")
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`)
        setPaymentStep("error")
        setIsProcessing(false)
      })

      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      setError(error.message || "Payment failed. Please try again.")
      setPaymentStep("error")
      setIsProcessing(false)
    }
  }

  const resetModal = () => {
    setPaymentStep("review")
    setError("")
    setIsProcessing(false)
    setOrderId(null)
  }

  const renderReviewStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-green-400 flex items-center">
          <CreditCard className="mr-2 h-6 w-6" />
          Complete Your Purchase
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Order Summary</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-400">{item.name}</h4>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-green-500/20" />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Processing Fee:</span>
            <span>₹0</span>
          </div>
          <Separator className="bg-green-500/20" />
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-300">Total Amount:</span>
            <span className="text-green-400">₹{totalAmount}</span>
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white/5 p-3 rounded-lg">
          <Shield className="h-4 w-4 text-green-400" />
          <span>Secure payment powered by Razorpay • SSL Encrypted</span>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !razorpayLoaded || !isBackendReady()}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg py-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : !razorpayLoaded ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading Payment System...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay ₹{totalAmount}
            </>
          )}
        </Button>
      </div>
    </>
  )

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="h-16 w-16 animate-spin text-green-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
      <p className="text-gray-400">Please wait while we process your payment...</p>
      <p className="text-sm text-gray-500 mt-2">Do not close this window</p>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
      <p className="text-gray-400">Your order has been confirmed. You can now download your materials.</p>
      <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-sm text-green-400">Receipt will be sent to your email</p>
      </div>
    </div>
  )

  const renderErrorStep = () => (
    <div className="text-center py-8">
      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Payment Failed</h3>
      <p className="text-gray-400 mb-4">{error}</p>
      <div className="space-y-3">
        <Button
          onClick={resetModal}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
        >
          Try Again
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border border-green-500/20 text-white max-w-2xl">
      <VisuallyHidden>
        <DialogTitle>Payment Modal</DialogTitle>
      </VisuallyHidden>
        {paymentStep === "review" && renderReviewStep()}
        {paymentStep === "processing" && renderProcessingStep()}
        {paymentStep === "success" && renderSuccessStep()}
        {paymentStep === "error" && renderErrorStep()}
      </DialogContent>
    </Dialog>
  )
}
