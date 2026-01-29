"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

export default function ContactSection() {
  const [state, setState] = useState(null)
  const [isPending, setIsPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()

    const form = e.currentTarget // ✅ capture immediately
    const formData = new FormData(form)

    setIsPending(true)
    setState(null)

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          courseInterest: formData.get("courseInterest"),
          message: formData.get("message"),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      setState({
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      })

      form.reset() // ✅ SAFE
    } catch (err) {
      setState({
        success: false,
        message: err.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsPending(false)
    }
  }


  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-900/10"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to start your journey with SUJHAV? Get in touch with us today
            for personalized guidance and consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                We're here to help you achieve your academic goals. Reach out to
                us through any of the following channels, and our team will get
                back to you promptly.
              </p>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">
                        Phone Numbers
                      </h4>
                      <div className="text-gray-300">
                        <div>7003091196</div>
                        <div>7439059335</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">
                        Email Address
                      </h4>
                      <div className="text-gray-300">info@sujhav.co.in</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">Address</h4>
                      <div className="text-gray-300">
                        SUJHAV Coaching Institute
                        <br />
                        Education Hub, Knowledge City
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">
                        Office Hours
                      </h4>
                      <div className="text-gray-300">
                        <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                        <div>Sunday: 10:00 AM - 6:00 PM</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {state && (
                <div
                  className={`p-4 rounded-lg border flex items-center space-x-3 ${state.success
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                >
                  {state.success ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{state.message}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6 text-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-400">
                      First Name *
                    </label>
                    <Input name="firstName" required disabled={isPending} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-400">
                      Last Name *
                    </label>
                    <Input name="lastName" required disabled={isPending} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-400">
                    Email *
                  </label>
                  <Input name="email" type="email" required disabled={isPending} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-400">
                    Phone Number *
                  </label>
                  <Input name="phone" required disabled={isPending} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-400">
                    Course Interest
                  </label>
                  <Input name="courseInterest" disabled={isPending} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-400">
                    Message *
                  </label>
                  <Textarea name="message" required disabled={isPending} />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

