"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, BookOpen, Shirt, Star, ArrowRight, Download, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function StoreSection() {
  const featuredProducts = [
    {
      id: 1,
      name: "JEE Main Complete Package",
      price: 2999,
      originalPrice: 4999,
      image: "/placeholder.svg?height=200&width=300",
      category: "Study Material",
      rating: 4.8,
      students: 1250,
    },
    {
      id: 2,
      name: "Physics Handwritten Notes",
      price: 0,
      originalPrice: 999,
      image: "/placeholder.svg?height=200&width=300",
      category: "Free Notes",
      rating: 4.9,
      students: 2100,
      free: true,
    },
    {
      id: 3,
      name: "SUJHAV Premium T-Shirt",
      price: 799,
      originalPrice: 1299,
      image: "/placeholder.svg?height=200&width=300",
      category: "Merchandise",
      rating: 4.6,
      students: 320,
    },
  ]

  return (
    <section id="store" className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
            <ShoppingBag className="w-4 h-4 mr-2" />
            SUJHAV Store
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover premium study materials, exclusive handwritten notes, and stylish SUJHAV merchandise. Your one-stop
            shop for academic excellence and school pride.
          </p>
        </div>

        {/* Store Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
            <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-2">500+</div>
            <div className="text-sm text-gray-400">Study Materials</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
            <Download className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-2">50+</div>
            <div className="text-sm text-gray-400">Free Resources</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
            <Shirt className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-2">20+</div>
            <div className="text-sm text-gray-400">Merchandise Items</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
            <Gift className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-2">10K+</div>
            <div className="text-sm text-gray-400">Happy Students</div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Featured Products</h3>
            <p className="text-gray-400">Handpicked resources for your success journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-green-500/10"
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    {product.free && (
                      <Badge className="absolute top-3 left-3 bg-green-500 text-black font-semibold">FREE</Badge>
                    )}
                    {!product.free && product.originalPrice > product.price && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">{product.category}</Badge>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                      <span>•</span>
                      <span>{product.students} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.free ? (
                        <span className="text-2xl font-bold text-green-400">FREE</span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-green-400">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-green-400">Ready to Explore?</h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join thousands of students who have transformed their learning journey with SUJHAV resources. Start
                  with our free materials and discover the difference quality makes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Explore Store
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Free Downloads
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
