"use client"

import { Badge } from "@/components/ui/badge"
import { Camera, ImageIcon, Award, ArrowDown } from "lucide-react"
import { HyperText } from "./ui/hyper-text"

export default function GalleryHero() {
  return (
    <section if="gallery" className="relative min-h-screen md:pb-4 pb-4 sm:pb-16 flex items-center justify-center overflow-hidden">
      {/* Background with enhanced gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black-800/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-500/3 to-transparent"></div>

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-green-600/6 rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-500/8 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6 sm:mt-4">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
              <Camera className="w-4 h-4 mr-2" />
              Photo Gallery
            </Badge>

            < h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                Our Moments
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Capturing memories, celebrating achievements, and showcasing the vibrant life at SUJHAV
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8 relative z-10">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <ImageIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-2">Campus</div>
              <div className="text-sm text-gray-400">Infrastructure & Facilities</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <Camera className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-2">Events</div>
              <div className="text-sm text-gray-400">Activities & Celebrations</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-2">Success</div>
              <div className="text-sm text-gray-400">Achievements & Awards</div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  )
}
