"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hand, User, Palette } from "lucide-react"
import Image from "next/image"

export default function LogoSignificance() {
  const logoElements = [
    {
      icon: Hand,
      title: '"Palm" signifies "Nurturing"',
      description: "The caring hand that guides and supports growth",
      color: "from-green-500 to-green-600",
    },
    {
      icon: User,
      title: '"The Human Figure" signifies "Success"',
      description: "The achievement and triumph of human potential",
      color: "from-green-600 to-green-700",
    },
  ]

  const colors = [
    {
      name: "Ground",
      description: "It resembles the foundation where journey begins",
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      name: "Sky",
      description: "It resembles the limitless possibilities above",
      color: "bg-blue-500",
      textColor: "text-blue-400",
    },
    {
      name: "Golden Shine",
      description: "It resembles the golden shine of success",
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Our Symbol</Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Significance of the Logo
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Logo Display */}
          <div className="text-center">
            <div className="relative w-80 h-80 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="logo-container relative w-full h-full bg-white/5 backdrop-blur-xl rounded-full border border-green-500/20 shadow-2xl">
                <div className="absolute inset-4">
                  <Image src="/logo.png" alt="SUJHAV Logo" fill className="object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Logo Elements */}
          <div className="space-y-6">
            {logoElements.map((element, index) => {
              const IconComponent = element.icon

              return (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-105 shadow-2xl"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${element.color} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-400">{element.title}</h3>
                        <p className="text-gray-400 text-sm">{element.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Colors</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {colors.map((colorItem, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-105 shadow-2xl"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 ${colorItem.color} rounded-full mx-auto shadow-lg`}></div>
                  <h4 className={`text-xl font-bold ${colorItem.textColor}`}>{colorItem.name}</h4>
                  <p className="text-gray-400 text-sm">{colorItem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <Palette className="h-12 w-12 text-green-400 mx-auto" />
              <h3 className="text-2xl font-bold text-green-400">Our Message</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                <span className="text-green-400 font-bold">SUJHAV</span> is by your side from the beginning, i.e.{" "}
                <span className="text-amber-400 font-semibold">"Ground,"</span> to the extreme of your success, i.e.{" "}
                <span className="text-blue-400 font-semibold">"Sky,"</span> and sees you Shine brightly like the{" "}
                <span className="text-yellow-400 font-semibold">Sun</span>, inspiring all.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
