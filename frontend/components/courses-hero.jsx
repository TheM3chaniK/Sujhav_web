"use client"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function CoursesHero() {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        })
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-950/10"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
                        Our Programs
                    </Badge>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                            Courses & Pricing
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                        Comprehensive coaching programs designed for every student's success journey
                    </p>
                </div>
            </div>

            {/* Bouncing Arrow Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <button
                    onClick={scrollToContent}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                    <span className="text-gray-400 text-sm font-medium tracking-widest uppercase group-hover:text-green-400 transition-colors">
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-8 h-8 text-green-500 group-hover:text-green-400" />
                    </motion.div>
                </button>
            </motion.div>
        </section>
    )
}
