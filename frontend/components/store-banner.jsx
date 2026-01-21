"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award, ShoppingBag, Star, Users } from "lucide-react"
import Image from "next/image"

export default function StoreBanner() {
  return (
    <section className="pt-20 pb-12 relative overflow-hidden">
      {/* Enhanced Background with Study Materials Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-gray-800/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/5"></div>

      {/* Background Pattern of Books and Study Materials */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 transform rotate-12">
          <div className="w-16 h-20 bg-green-500/30 rounded-sm shadow-lg"></div>
        </div>
        <div className="absolute top-20 right-20 transform -rotate-12">
          <div className="w-20 h-16 bg-green-400/20 rounded-sm shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 left-20 transform rotate-45">
          <div className="w-12 h-16 bg-green-600/25 rounded-sm shadow-lg"></div>
        </div>
        <div className="absolute bottom-10 right-10 transform -rotate-6">
          <div className="w-18 h-14 bg-green-300/20 rounded-sm shadow-lg"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 transform rotate-6">
          <div className="w-14 h-18 bg-green-500/15 rounded-sm shadow-lg"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 transform -rotate-12">
          <div className="w-16 h-12 bg-green-400/25 rounded-sm shadow-lg"></div>
        </div>
      </div>

      {/* Floating Study Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Book Icons */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 animate-float">
          <BookOpen className="h-8 w-8 text-green-400/30" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-float-delayed">
          <Award className="h-6 w-6 text-green-300/25" />
        </div>
        <div className="absolute top-1/2 left-1/6 animate-float-delayed-2">
          <Star className="h-7 w-7 text-green-500/20" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 shadow-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>

          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2 animate-fade-in-up">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    SUJHAV Store
                  </Badge>

                  <h1
                    className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                      Premium Study
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
                      Resources Hub
                    </span>
                  </h1>

                  <p
                    className="text-xl text-gray-300 leading-relaxed animate-fade-in-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    Discover our carefully curated collection of study materials, handwritten notes, and exclusive
                    SUJHAV merchandise. Everything you need for academic excellence, crafted by experts who understand
                    your journey.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <BookOpen className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-lg font-bold text-green-400">500+</div>
                    <div className="text-xs text-gray-400">Study Materials</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <Award className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="text-lg font-bold text-green-400">50+</div>
                    <div className="text-xs text-gray-400">Free Resources</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <ShoppingBag className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    </div>
                    <div className="text-lg font-bold text-green-400">20+</div>
                    <div className="text-xs text-gray-400">Merchandise</div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div
                  className="flex items-center space-x-6 text-sm text-gray-400 animate-fade-in-up"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-green-400" />
                    <span>10,000+ Students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-green-400" />
                    <span>Expert Curated</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Enhanced Founder Section */}
              <div className="relative animate-fade-in-up" style={{ animationDelay: "1s" }}>
                <div className="relative w-full max-w-md mx-auto">
                  {/* Multiple Glow Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-2xl blur-3xl animate-pulse-slow"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-green-300/20 to-green-500/20 rounded-2xl blur-2xl animate-pulse-slow delay-1000"></div>

                  {/* Enhanced Image Container */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-green-500/20 shadow-2xl p-6 transform hover:scale-105 transition-all duration-500">
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-300 rounded-full animate-pulse delay-700"></div>

                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-green-500/30">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Abhriaj Prasad - Founder"
                        fill
                        className="object-cover"
                        sizes="400px"
                      />

                      {/* Overlay with Study Elements */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>

                    <div className="mt-4 text-center space-y-2">
                      <h3 className="text-xl font-bold text-green-400">Abhriaj Prasad</h3>
                      <div className="flex items-center justify-center space-x-2">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                          M.Tech IIT Roorkee
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">Founder & Chief Curator</p>
                      <div className="mt-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
                        <p className="text-sm text-gray-300 italic">
                          "Every resource in our store is handpicked and designed to accelerate your path to success."
                        </p>
                      </div>
                    </div>

                    {/* Floating Achievement Icons */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Award className="h-4 w-4 text-black" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-1000">
                      <BookOpen className="h-4 w-4 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div
              className="mt-8 pt-6 border-t border-green-500/20 animate-fade-in-up"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="text-center">
                <p className="text-green-400 font-semibold mb-2">🎉 Special Launch Offer!</p>
                <p className="text-gray-300 text-sm">
                  Get <span className="text-green-400 font-bold">3 FREE downloads</span> on signup +
                  <span className="text-green-400 font-bold"> Up to 40% OFF</span> on premium materials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
