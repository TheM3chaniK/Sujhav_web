"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function WhySujhav() {
  return (
    <section id="about-next" className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Our Mission</Badge>
          <h2 className="text-3xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Why "SUJHAV"?
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="h-8 w-8 text-green-400" />
                    <h3 className="text-2xl font-bold text-green-400">The Challenge</h3>
                  </div>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      <span className="text-green-400 font-semibold">'Education'</span> is often cited as India's most
                      important development factor. People frequently discuss 'Educational Career Opportunities', and it
                      has long been a hot topic.
                    </p>

                    <p>
                      As the number of college graduates and degree holders rises year over year, so does the unemployment
                      rate. People make excuses, point the finger at the educational system, and frequently consider
                      changing it.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-green-400" />
                    <h3 className="text-2xl font-bold text-green-400">Our Approach</h3>
                  </div>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      In our opinion, the process of change should begin with each of us, with our way of thinking. Let's
                      take a step forward towards <span className="text-green-400 font-semibold">self-improvement</span>.
                    </p>

                    <p>
                      <span className="text-green-400 font-bold">'SUJHAV'</span> serves as a platform to shape our
                      thoughts about our career and provides clarity to our approach towards learning through practical
                      techniques.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Content - Statistics */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">Rising</div>
                <div className="text-sm text-gray-400">Graduate Numbers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-red-400 mb-2">Growing</div>
                <div className="text-sm text-gray-400">Unemployment</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 shadow-2xl">
                <CardContent className="p-8 text-center space-y-4">
                  <Users className="h-12 w-12 text-green-400 mx-auto" />
                  <h3 className="text-2xl font-bold text-green-400">The SUJHAV Difference</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We believe in transforming mindsets, not just teaching subjects. Our approach focuses on practical
                    learning and career clarity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
