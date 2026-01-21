"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Target, Users, MapPin } from "lucide-react"

export default function WhatWeThink() {
  const questions = [
    {
      icon: HelpCircle,
      question: "Why we learn? over What we learn?",
      description: "Understanding the purpose behind learning is more important than memorizing facts.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Target,
      question: "Do we have a goal in life?",
      description: "Having a clear direction and purpose drives meaningful progress.",
      color: "from-green-600 to-green-700",
    },
    {
      icon: Users,
      question: "Is our goal self-determined or influenced by others?",
      description: "Authentic goals come from within, not from external pressures.",
      color: "from-green-400 to-green-500",
    },
    {
      icon: MapPin,
      question: "Are we aware of the path that leads us to our goal?",
      description: "Knowing the journey is as important as knowing the destination.",
      color: "from-green-500 to-green-700",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Self Reflection</Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              What do we Think?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Let's begin with a few questions that we must first ask ourselves. These are the major issues for which
            SUJHAV provides a solution.
          </p>
        </div>

        {/* Questions Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {questions.map((item, index) => {
            const IconComponent = item.icon

            return (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-green-500/10"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center transform hover:scale-110 transition-all duration-500 shadow-lg flex-shrink-0`}
                    >
                      <IconComponent className="h-8 w-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl font-bold text-green-400">Question {index + 1}:</span>
                      </div>
                      <h3 className="text-xl font-bold text-green-300 mb-3 leading-relaxed">{item.question}</h3>
                      <p className="text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-2xl font-bold text-green-400">Ready to Find Your Answers?</h3>
              <p className="text-gray-300 leading-relaxed">
                These fundamental questions shape our educational philosophy at SUJHAV. We help students discover their
                own answers through guided self-reflection and practical learning experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
