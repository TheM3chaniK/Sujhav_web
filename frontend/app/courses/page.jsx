"use client"

import Navbar from "@/components/navbar"
import CoursesHero from "@/components/courses-hero"
import CoursesGrid from "@/components/courses-grid"
import Footer from "@/components/footer"

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <CoursesHero />
            <CoursesGrid />
            <Footer />
        </div>
    )
}
