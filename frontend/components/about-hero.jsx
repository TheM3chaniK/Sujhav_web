"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowDown } from "lucide-react"

export default function AboutHero() {
    const [showIndicator, setShowIndicator] = useState(true)

    useEffect(() => {
      const handleScroll = () => {
        setShowIndicator(window.scrollY < 50)
      }
  
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])
  
    const scrollToNext = () => {
        const target = document.getElementById("about-next");
        if (!target) return;
      
        const startY = window.scrollY;
        const endY = target.getBoundingClientRect().top + startY;
        const duration = 1000; // in ms (adjust to make it slower)
        const startTime = performance.now();
      
        const easeInOutQuad = (t) =>
          t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
        const animateScroll = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = easeInOutQuad(progress);
          window.scrollTo(0, startY + (endY - startY) * ease);
      
          if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
          }
        };
      
        requestAnimationFrame(animateScroll);
      };
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6 sm:mt-4">
            <Badge className="text-md bg-green-500/10 text-green-400 border-green-500/20 px-6 py-4">About SUJHAV</Badge>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                Our Story
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Transforming education through innovative thinking, practical learning, and personalized career guidance
            </p>
          </div>

          <div className="sm:pb-30 grid md:grid-cols-3 gap-8 pt-8">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">Application</div>
              <div className="text-sm text-gray-400">Based Learning</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">Career</div>
              <div className="text-sm text-gray-400">Guidance</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">Personal</div>
              <div className="text-sm text-gray-400">Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      { showIndicator && (
      <button
      onClick={scrollToNext}
      className="cursor-pointer absolute z-20 bottom-8 inset-x-0 text-center animate-bounce"
    >
      <div className="inline-flex flex-col items-center space-y-2">
        <span className="text-green-400 text-sm">Know More, Click here</span>
        <ArrowDown className="h-6 w-6 text-green-400" />
      </div>
    </button>
)}
    </section>
  )
}
