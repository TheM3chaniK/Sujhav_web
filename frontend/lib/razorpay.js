import Razorpay from "razorpay"

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createOrder = async (amount, currency = "INR", receipt) => {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
    })
    return order
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    throw error
  }
}

export const verifyPayment = (orderId, paymentId, signature) => {
  const crypto = require("crypto")
  const body = orderId + "|" + paymentId
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")

  return expectedSignature === signature
}
