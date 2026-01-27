"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Play } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function HeroSection() {

  return (
    <section id="home" className="sm:pb-14 relative min-h-screen flex items-center justify-center overflow-hidden py-4">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-950/10"></div>


      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">


              <h1 className="text-5xl md:text-6xl lg:text-7xl mt-4 tracking-wide font-bold leading-tight">
                <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                  SUJHAV
                </span>
              </h1>

              <div className="space-y-3 text-lg md:text-xl text-gray-300">
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">S</span>
                  <span className="text-xl md:text-2xl tracking-wider">ynchronise your</span>
                </p>
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">U</span>
                  <span className="text-xl md:text-2xl tracking-wider">nderstanding, do</span>
                </p>
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">J</span>
                  <span className="text-xl md:text-2xl tracking-wider">ustice to your</span>
                </p>
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">H</span>
                  <span className="text-xl md:text-2xl tracking-wider">ardWork, and let others</span>
                </p>
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">A</span>
                  <span className="text-xl md:text-2xl tracking-wider">dmire your</span>
                </p>
                <p className="flex items-center">
                  <span className="text-green-400 font-bold text-2xl md:text-3xl mr-3">V</span>
                  <span className="text-xl md:text-2xl tracking-wider">ictory</span>
                </p>
              </div>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                SUJHAV serves as a platform to shape our thoughts about our career and provides clarity to our approach towards learning through practical techniques.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 cursor-pointer"
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                onClick={() => window.open("https://www.youtube.com/shorts/tXtDPNOeuTc", "_blank")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
              {/*<Link href="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  View Gallery
                </Button>
              </Link>*/}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 md:gap-20 pt-8 pb-10">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400">200+</div>
                <div className="text-sm text-gray-400">Students Guided</div>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400">5+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo with Glassmorphism Animation */}
          <div className="relative hidden md:flex justify-center lg:ml-5">
            <div className="relative">
              {/* 3D Floating Logo Container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] animate-float">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-3xl animate-pulse-slow"></div>

                {/* Logo Container with Glassmorphism and 3D rotation */}
                <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-full border border-green-500/20 shadow-2xl animate-rotate-3d-full">
                  {/* Logo */}
                  <div className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-10">
                    <Image
                      src="/logo.png"
                      alt="SUJHAV Logo"
                      fill
                      priority
                      sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 400px"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-green-400/60 rounded-full animate-float-delayed"></div>
                <div className="absolute -bottom-4 -left-4 w-2 h-2 bg-green-500/70 rounded-full animate-float-delayed-2"></div>
                <div className="absolute top-1/2 -left-8 w-2 h-2 bg-green-300/80 rounded-full animate-float-delayed-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
