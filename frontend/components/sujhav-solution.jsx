"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, BookOpen, TrendingUp, Users, Target, Award } from "lucide-react"
import { motion } from "framer-motion"

export default function SujhavSolution() {
  return (
    <section className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with seamless gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/40 to-black"></div>

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
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Our Solution</Badge>
          <h2 className="text-3xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              SUJHAV: The Solution
            </span>
          </h2>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="h-8 w-8 text-green-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-green-400">Our Philosophy</h3>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  The solution is in the way people think about and approach such issues. Problems should be viewed as{" "}
                  <span className="text-green-400 font-semibold">opportunities</span>, and we think that opportunities
                  lead to improvement and growth.
                </p>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 p-6 rounded-lg border border-green-500/20">
                  <p className="text-green-300 font-semibold text-lg text-center">
                    "The best way to escape from problems is to face them."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Main Solutions */}
        <div className="space-y-16">
          {/* Solution 1: Application Based Learning */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="h-8 w-8 text-green-400" />
                    <h3 className="text-xl sm:text-2xl font-bold text-green-400">1. Application Based Active Learning</h3>
                  </div>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      To begin, one must recognize the value of education in one's life. Education is crucial in the
                      development of character, opinion, and intellect. It shapes one's thinking and ensures a higher
                      standard of living.
                    </p>

                    <p>
                      Instead of accepting concepts and formulas as facts, the approach to learning should focus on
                      understanding the <span className="text-green-400 font-semibold">practical reasons</span> behind
                      them.
                    </p>

                    <p>
                      We believe that application-based learning is the most effective way to learn, hence we encourage{" "}
                      <span className="text-green-400 font-semibold">Active Learning</span>, or learning by doing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300"
                >
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-400">Growth</div>
                  <div className="text-sm text-gray-400">Mindset</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-500/20 transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-400">Active</div>
                  <div className="text-sm text-gray-400">Learning</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/30 shadow-2xl">
                  <CardContent className="p-6 text-center space-y-3">
                    <Award className="h-10 w-10 text-green-400 mx-auto" />
                    <h4 className="text-lg font-bold text-green-400">Practical Approach</h4>
                    <p className="text-gray-300 text-sm">
                      We employ practical experimental setups and conceptual presentations to simplify complex subjects.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Solution 2: Career Opportunities */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:order-2"
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="h-8 w-8 text-green-400" />
                    <h3 className="text-xl sm:text-2xl font-bold text-green-400">2. Expand Your Career Opportunities</h3>
                  </div>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Career planning is a systematic process that consists of several interconnected stages that assist
                      individuals in exploring and selecting the most appropriate path for them.
                    </p>

                    <p>
                      SUJHAV provides continuous support, motivation and guidance throughout the journey to success. We
                      use <span className="text-green-400 font-semibold">success stories</span> to teach our students
                      how to avoid common mistakes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="lg:order-1 space-y-6">
              {/* Career Stages */}
              <div className="space-y-4">
                {[
                  { id: 1, title: "Self-Assessment", desc: "Thorough analysis and personality report" },
                  { id: 2, title: "Explore Opportunities", desc: "Knowledge of various career options" },
                  { id: 3, title: "Passion & Determination", desc: "Never-give-up attitude towards goals" },
                ].map((stage, idx) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border border-green-500/20 hover:border-green-400/30 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
                            {stage.id}
                          </div>
                          <div>
                            <h4 className="font-bold text-green-400">{stage.title}</h4>
                            <p className="text-sm text-gray-400">{stage.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
