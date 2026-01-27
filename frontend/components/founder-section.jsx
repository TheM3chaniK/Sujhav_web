"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, GraduationCap, Award, Users, Clock, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-900/20 via-gray-950 to-green-950/10"></div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-20"
        >
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1.5 text-xs uppercase tracking-widest">
            Meet Our Founder
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Visionary Leadership
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left - Founder Info (Span 5) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-green-500/20 to-transparent rounded-3xl blur-2xl group-hover:from-green-500/30 transition-all duration-500"></div>

              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/founder.jpg"
                    alt="Abhiraj Prasad - Founder"
                    width={450}
                    height={600}
                    className="w-full object-cover rounded-3xl shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] border border-white/10"
                    sizes="(max-width: 1024px) 100vw, 450px"
                    priority
                  />
                </motion.div>

                {/* Floating Badge */}
                <div className="md:absolute -bottom-6 -right-6 bg-black/60 backdrop-blur-xl border border-green-500/30 p-4 sm:p-6 rounded-2xl shadow-2xl mt-8 md:mt-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-lg sm:text-xl">
                      AP
                    </div>
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg">Abhiraj Prasad</p>
                      <p className="text-green-400 text-xs sm:text-sm font-medium">Founder & Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education/Credentials */}
            <div className="grid gap-4 pt-6">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors group">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Education</p>
                  <p className="text-lg text-white font-semibold">M.Tech, Electrical Engineering</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors group">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                  <Award className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Alma Mater</p>
                  <p className="text-lg text-white font-semibold">IIT Roorkee</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Message & Stats (Span 7) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-12"
          >
            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-32 h-32 text-green-500" />
              </div>

              <CardContent className="p-6 sm:p-10 space-y-8 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <Quote className="h-8 w-8 text-black fill-current" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-green-100 bg-clip-text text-transparent">
                    Founder's Vision
                  </h3>
                </div>

                <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed font-light">
                  <p className="italic relative">
                    <span className="hidden sm:block text-green-400 font-medium font-serif text-3xl absolute -left-6 -top-2">"</span>
                    For me, <span className="text-green-400 font-semibold">SUJHAV</span> is a puzzle solution, with the
                    numerous puzzle pieces representing the various experiences and realizations I've had during my
                    student life.
                  </p>

                  <p>
                    I feel that life is similar to a puzzle, with the exception that in a puzzle, if a piece is placed
                    incorrectly, we may remove it and reposition it, however in life, we do not have the luxury of going
                    back in time and rectifying our mistakes.
                  </p>

                  <p>
                    <span className="text-green-400 font-semibold italic">SUJHAV</span> is an initiative that assists us in
                    placing the correct puzzle pieces (<span className="text-green-400/80">accurate life decisions</span>), in the appropriate location (at
                    the right time in life), in the correct order.
                  </p>

                  <p>
                    As a result, we take a step forward to rethink and redefine the way of learning by applying and
                    guiding people to pave their paths to success with minimal errors, and turn out to be an inspiration
                    with the right suggestion, precisely.
                  </p>

                  <p>
                    Education is often cited as India’s most important development factor in the country. People frequently discuss ‘Educational Career Opportunities’, and it has long been a hot topic. As the number of college graduates and degree holders rises year over year, so does the unemployment rate.
                  </p>

                  <p>
                    In our opinion, the process of change should begin with each of us, with our way of thinking. Let’s take a step forward towards self-improvement.
                  </p>

                  <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                    <p className="text-white font-medium italic">
                      "<span className="text-green-400 font-bold">SUJHAV</span> serves as a platform to shape our thoughts about our career and provides clarity to our approach towards learning through practical techniques."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-green-500/40 transition-all duration-500 hover:-translate-y-2 text-center md:text-left">
                <Clock className="w-8 h-8 text-green-400 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">5+</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Years Experience</div>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-green-500/40 transition-all duration-500 hover:-translate-y-2 text-center md:text-left">
                <Users className="w-8 h-8 text-green-400 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Students Guided</div>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-green-500/40 transition-all duration-500 hover:-translate-y-2 text-center md:text-left">
                <Sparkles className="w-8 h-8 text-green-400 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">IITian</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Technical Expert</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="max-w-5xl mx-auto p-0.5 sm:p-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent rounded-[1.5rem] sm:rounded-[2rem]">
            <div className="bg-black/80 backdrop-blur-3xl rounded-[1.4rem] sm:rounded-[1.9rem] p-6 sm:p-12 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>

              <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Core Philosophy</h4>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto italic">
                At SUJHAV, we believe in placing the right puzzle pieces of knowledge and guidance at the right time in a
                student's journey. Our approach is designed to <span className="text-green-400 font-semibold underline decoration-green-500/30 underline-offset-8">minimize errors and maximize success</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
