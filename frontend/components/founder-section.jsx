"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, GraduationCap, Award } from "lucide-react"
import Image from "next/image"

export default function FounderSection() {
  return (
    <section id="founder" className="py-15 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-900/10"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Meet Our Founder</Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Visionary Leadership
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Left - Founder Info */}
          <div className="space-y-8"> 
            <div className="space-y-4">
            <Image src="/founder.jpg" alt="SUJHAV Logo" width={350} height={40} className="w-200 h-160 object-cover"/>
              <h3 className="text-3xl font-bold text-green-400">Abhiraj Prasad</h3>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-green-400" />
                <span className="text-lg text-gray-300">M.Tech, Electrical Engineering</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-400" />
                <span className="text-lg text-gray-300">IIT Roorkee</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
                <div className="text-2xl font-bold text-green-400">M.Tech</div>
                <div className="text-sm text-gray-400">IIT Roorkee</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
                <div className="text-2xl font-bold text-green-400">10+</div>
                <div className="text-sm text-gray-400">Years Teaching</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
                <div className="text-2xl font-bold text-green-400">1000+</div>
                <div className="text-sm text-gray-400">Students Guided</div>
              </div>
            </div>
          </div>

          {/* Right - Message */}
          <Card className="inline-flex bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-green-500/10">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Quote className="h-8 w-8 text-green-400" />
                <span className="text-lg font-semibold text-green-400">Founder's Message</span>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  "For me, <span className="text-green-400 font-semibold">SUJHAV</span> is a puzzle solution, with the
                  numerous puzzle pieces representing the various experiences and realizations I've had during my
                  student life."
                </p>

                <p>
                  "I feel that life is similar to a puzzle, with the exception that in a puzzle, if a piece is placed
                  incorrectly, we may remove it and reposition it, however in life, we do not have the luxury of going
                  back in time and rectifying our mistakes."
                </p>

                <p>
                  "<span className="text-green-400 font-semibold">SUJHAV</span> is an initiative that assists us in
                  placing the correct puzzle pieces (i.e. accurate life decisions), in the appropriate location (i.e. at
                  the right time in life), in the correct order."
                </p>

                <p>
                  "As a result, we take a step forward to rethink and redefine the way of learning by applying and
                  guiding people to pave their paths to success with minimal errors, and turn out to be an inspiration
                  with the right suggestion, precisely,{" "}
                  <span className="text-green-400 font-bold">'THE SAHI SUJHAV'</span>."
                </p>

                <p>
                  <span className="text-green-400 font-semibold">Why Sujhav?</span> 
                  <br></br>
                  Education is often cited as India’s most important development factor in the country. People frequently discuss ‘Educational Career Opportunities’, and it has long been a hot topic. As the number of college graduates and degree holders rises year over year, so does the unemployment rate. People make excuses, point the finger at the educational system, and frequently consider changing it.
                  In our opinion, the process of change should begin with each of us, with our way of thinking. Let’s take a step forward towards self-improvement.
                  <span className="text-green-400 font-bold">‘SUJHAV‘</span> serves as a platform to shape our thoughts about our career and provides clarity to our approach towards learning through practical techniques. "
                </p>
              </div>

              <div className="pt-4 border-t border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-400">Abhiraj Prasad</p>
                    <p className="text-sm text-gray-400">Founder & Director, SUJHAV</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">AP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Philosophy Section */}
        <div className="mt-16 text-center mb-5">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-3xl font-bold text-green-400 mb-6">Our Philosophy</h4>
            <p className="text-lg text-gray-300 leading-relaxed">
              At SUJHAV, we believe in placing the right puzzle pieces of knowledge and guidance at the right time in a
              student's journey. Our approach is designed to minimize errors and maximize success, ensuring every
              student finds their path to excellence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
