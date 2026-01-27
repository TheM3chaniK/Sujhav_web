"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Medal, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react"
import { useRef } from "react"
import { motion } from "framer-motion"

export default function CoursesGrid() {
    const sectionRef = useRef(null)

    const premiumCourses = [
        {
            id: 1,
            name: "JEE + Boards",
            icon: GraduationCap,
            classes: "Class 11 & 12",
            duration: "24 Months",
            subjects: ["Physics", "Chemistry", "Maths"],
            regularPrice: 8000,
            specialPrice: 5000,
            features: [
                "Merchandise",
                "Study Materials",
                "DPPs & Notes",
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-500 to-green-600",
        },
        {
            id: 2,
            name: "NEET + Boards",
            icon: Medal,
            classes: "Class 11 & 12",
            duration: "24 Months",
            subjects: ["Physics", "Chemistry", "Biology"],
            regularPrice: 8000,
            specialPrice: 5000,
            features: [
                "Merchandise",
                "Study Materials",
                "DPPs & Notes",
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-500 to-green-600",
        }
    ]

    const boardsCourses = [
        {
            id: 3,
            name: "SARVAGYA",
            icon: BookOpen,
            classes: "Class 12",
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer"],
            pricing: {
                core: 1000,
                other: 800,
            },
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-600 to-green-700",
            perSubject: true
        },
        {
            id: 4,
            name: "SANGHARSH",
            icon: TrendingUp,
            classes: "Class 11",
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer"],
            pricing: {
                core: 1000,
                other: 800,
            },
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-600 to-green-700",
            perSubject: true
        }
    ]

    const aarambhCourses = [
        {
            id: 5,
            name: "AARAMBH",
            classes: "Class 10",
            variants: [
                { board: "ICSE", regularPrice: 8000, specialPrice: 4000 },
                { board: "CBSE", regularPrice: 8000, specialPrice: 3750 }
            ],
            icon: Sparkles,
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer", "Commerce", "Economics"],
            perSubjectPrice: 800,
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-500 to-green-600"
        },
        {
            id: 6,
            name: "AARAMBH",
            classes: "Class 9",
            variants: [
                { board: "ICSE", regularPrice: 8000, specialPrice: 4000 },
                { board: "CBSE", regularPrice: 8000, specialPrice: 3750 }
            ],
            icon: Sparkles,
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer", "Commerce", "Economics"],
            perSubjectPrice: 800,
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-500 to-green-600"
        }
    ]

    const foundationCourses = [
        {
            id: 7,
            name: "UDAAN 2",
            classes: "Class 7 & 8",
            variants: [
                { board: "ICSE", regularPrice: 8000, specialPrice: 4000 },
                { board: "CBSE", regularPrice: 8000, specialPrice: 3750 }
            ],
            icon: BookOpen,
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer"],
            perSubjectPrice: 800,
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-400 to-green-500"
        },
        {
            id: 8,
            name: "UDAAN 1",
            classes: "Class 4, 5 & 6",
            icon: BookOpen,
            duration: "12 Months",
            subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Hindi", "SST", "Computer"],
            regularPrice: 4000,
            specialPrice: 2250,
            perSubjectPrice: 500,
            features: [
                "Regular Tests",
                "Report Cards",
                "Parent-Teacher Meetings",
                "Sanjeevni Counselling"
            ],
            color: "from-green-400 to-green-500"
        }
    ]

    // Simplified visibility logic using framer-motion instead of manual IntersectionObserver


    const renderCourseCard = (course, featured = false) => {
        const IconComponent = course.icon

        return (
            <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`${course.id !== 8 ? 'h-full' : ''} flex flex-col`}
            >
                <Card
                    className={`h-full flex flex-col bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 transform hover:scale-[1.02] group shadow-2xl hover:shadow-green-500/10 ${featured ? 'border-green-500/30' : ''}`}
                >
                    <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                <IconComponent className="h-7 w-7 text-black" />
                            </div>
                            {featured && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                    Premium
                                </Badge>
                            )}
                        </div>

                        <div>
                            <CardTitle className="text-xl sm:text-2xl text-green-400 group-hover:text-green-300 transition-colors duration-300 mb-2">
                                {course.name}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                                {course.classes} • {course.duration}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-1 gap-6">
                        {/* Pricing */}
                        <div className="space-y-2">
                            {course.variants ? (
                                <div className="space-y-3">
                                    {course.variants.map((variant, idx) => (
                                        <div key={idx} className="p-3 bg-white/5 rounded-lg border border-green-500/10">
                                            <div className="text-xs font-semibold text-green-400 mb-2">{variant.board}</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl sm:text-2xl font-bold text-green-400">₹{variant.specialPrice}</span>
                                                <span className="text-gray-400 text-sm">/month</span>
                                            </div>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-sm text-gray-500 line-through">₹{variant.regularPrice}</span>
                                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                                    Save ₹{variant.regularPrice - variant.specialPrice}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {course.perSubjectPrice && (
                                        <div className="text-sm text-gray-400 text-center">
                                            Per Subject: ₹{course.perSubjectPrice}/month
                                        </div>
                                    )}
                                </div>
                            ) : course.perSubject ? (
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-400">Per Subject Pricing:</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-green-400">₹{course.pricing.core}</span>
                                        <span className="text-gray-400">/month (Core)</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-green-400">₹{course.pricing.other}</span>
                                        <span className="text-gray-400">/month (Other)</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-bold text-green-400">₹{course.specialPrice}</span>
                                        <span className="text-gray-400">/month</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg text-gray-500 line-through">₹{course.regularPrice}</span>
                                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                            Save ₹{course.regularPrice - course.specialPrice}
                                        </Badge>
                                    </div>
                                    {course.perSubjectPrice && (
                                        <div className="text-sm text-gray-400">
                                            Per Subject: ₹{course.perSubjectPrice}/month
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Subjects */}
                        <div className={`space-y-2 ${!course.variants && course.id !== 8 ? 'flex-grow' : ''}`}>
                            <div className="text-sm font-semibold text-green-400">Subjects:</div>
                            <div className="flex flex-wrap gap-2">
                                {course.subjects.map((subject, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs text-gray-300 border-green-500/30"
                                    >
                                        {subject}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            <div className="text-sm font-semibold text-green-400">Includes:</div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                {course.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-xs text-gray-400">
                                        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                                        <span className="truncate">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <Button
                            className="w-full mt-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                            onClick={() => {
                                const contactSection = document.getElementById("contact")
                                if (contactSection) {
                                    const targetPosition = contactSection.offsetTop - 50
                                    const startPosition = window.scrollY
                                    const distance = targetPosition - startPosition
                                    const duration = 1500
                                    let start = null

                                    function animation(currentTime) {
                                        if (start === null) start = currentTime
                                        const timeElapsed = currentTime - start
                                        const progress = Math.min(timeElapsed / duration, 1)
                                        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
                                        window.scrollTo(0, startPosition + distance * ease)
                                        if (timeElapsed < duration) {
                                            requestAnimationFrame(animation)
                                        }
                                    }
                                    requestAnimationFrame(animation)
                                } else {
                                    window.location.href = "/#contact"
                                }
                            }}
                        >
                            Enroll Now
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <section ref={sectionRef} className="py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-green-900/15 via-gray-950 to-green-950/10"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-40 left-0 w-80 h-80 bg-green-500/15 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-40 right-0 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

                {/* Premium Courses */}
                <div className="space-y-8">
                    <div className="text-center space-y-3">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                            Premium Programs
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                            JEE & NEET Preparation
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Comprehensive 2-year programs with premium inclusions for competitive exam aspirants
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {premiumCourses.map(course => renderCourseCard(course, true))}
                    </div>
                </div>

                {/* Boards Preparation */}
                <div className="space-y-8">
                    <div className="text-center space-y-3">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
                            Board Preparation
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                            Class 11 & 12 Boards
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Flexible per-subject programs for comprehensive board exam preparation
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {boardsCourses.map(course => renderCourseCard(course))}
                    </div>
                </div>

                {/* AARAMBH Programs */}
                <div className="space-y-8">
                    <div className="text-center space-y-3">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
                            AARAMBH Programs
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                            Class 9 & 10
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Build a strong foundation with comprehensive curriculum coverage
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {aarambhCourses.map(course => renderCourseCard(course))}
                    </div>
                </div>

                {/* Foundation Courses */}
                <div className="space-y-8">
                    <div className="text-center space-y-3">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">
                            Foundation Programs
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                            UDAAN - Early Learning
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Nurture young minds with age-appropriate learning programs
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {foundationCourses.map(course => renderCourseCard(course))}
                    </div>
                </div>

            </div>
        </section>
    )
}
