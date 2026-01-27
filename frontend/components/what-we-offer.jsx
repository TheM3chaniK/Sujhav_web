"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Library, Compass, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function WhatWeOffer() {
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
      features: ["24*7 Self Study Space Available", "Study Materials", "Reference Books", "Online Resources", "Doubt Sessions", "Group Discussions"],
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
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-950/10"></div>


      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Clean and Simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-20"
        >
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
        </motion.div>

        {/* Services - Vertical Layout */}
        <div className="max-w-4xl mx-auto space-y-12">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="pb-6"
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-[1.01] group shadow-2xl hover:shadow-green-500/10">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:ml-22">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-green-400 transition-colors duration-300 group/feature"
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover/feature:scale-125 transition-transform duration-300"></div>
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

