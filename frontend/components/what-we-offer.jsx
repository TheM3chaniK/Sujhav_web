"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Library, Compass, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function WhatWeOffer() {
  const [visibleCards, setVisibleCards] = useState([])
  const sectionRef = useRef(null)

  const services = [
    {
      icon: BookOpen,
      title: "Class 4-10 All Subjects",
      description:
        "Comprehensive foundation building across all subjects with personalized attention and interactive learning methods.",
      features: ["Mathematics", "Science", "English", "Social Studies", "Hindi", "PPT demonstrations", "ICSE & CBSE"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: GraduationCap,
      title: "Class 11-12 - Boards | JEE | NEET",
      description:
        "Specialized coaching for board exams and competitive entrance tests with expert faculty and proven methodologies.",
      features: ["Board Preparation", "JEE Main & Advanced", "NEET", "Mock Tests", "Doubt Sessions", "Regular assessments"],
      color: "from-green-600 to-green-700",
    },
    {
      icon: Library,
      title: "Free Library Access & Doubt Clearing",
      description:
        "24/7 library access with extensive study materials and dedicated doubt clearing sessions for all students.",
      features: ["24*7 Self Study Space Available","Study Materials", "Reference Books", "Online Resources", "Doubt Sessions", "Group Discussions"],
      color: "from-green-400 to-green-500",
    },
    {
      icon: Compass,
      title: "Career Guidance - Analyze & Explore",
      description:
        "Comprehensive career counseling to help students analyze their strengths and explore the right career paths.",
      features: ["Self-assessment & analysis (Know Yourself)", "Career Mapping", "College Guidance", "Industry Insights", "Mentorship"],
      color: "from-green-500 to-green-700",
    },
  ]

  const smoothScrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      const targetPosition = contactSection.offsetTop - 50 // Offset for navbar
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      const duration = 1500 // 1.5 seconds for smooth animation
      let start = null

      function animation(currentTime) {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function for smooth animation (ease-in-out)
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * ease)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...prev, cardIndex])
          }
        })
      },
      { threshold: 0.2 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-15 relative overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-950/10"></div>


      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-140 left-0 w-80 h-80 bg-green-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-100 right-0 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Clean and Simple */}
        <div className="text-center space-y-6 mb-16 animate-fade-in-up">
          <Badge className="bg-green-500/10 backdrop-blur-sm text-green-400 border-green-500/20 px-4 py-2">
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              What We Offer
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive educational solutions designed to nurture academic excellence and personal growth
          </p>
        </div>

        {/* Services - Vertical Layout */}
        <div className="max-w-4xl mx-auto space-y-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isVisible = visibleCards.includes(index)

            return (
              <div
                key={index}
                data-index={index}
                className={`transform transition-all duration-1000 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                } pb-10`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 group shadow-2xl hover:shadow-green-500/10">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start space-x-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg flex-shrink-0`}
                      >
                        <IconComponent className="h-8 w-8 text-black" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-green-400 group-hover:text-green-300 transition-colors duration-300 mb-2">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-22">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-green-400 transition-colors duration-300 group/feature"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full group-hover/feature:scale-125 transition-transform duration-300"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Join Now Button */}
                    <div className="flex justify-end pt-4 border-t border-green-500/20">
                      <Button
                        onClick={smoothScrollToContact}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 group/button"
                      >
                        Join Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
