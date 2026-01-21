"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User } from 'lucide-react'
import TeacherStats from "./teacher-stats"
import QuickActions from "./quick-actions"
import MyBatchesSection from "./my-batches-section"

export default function TeacherDashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (error) {
                console.error("Error parsing user data:", error)
            }
        }
        setLoading(false)
    }, [])

    const getDisplayName = () => {
        if (!user) return "Teacher"
        return user.fullName || user.name || "Teacher"
    }

    const formatJoinDate = (dateString) => {
        if (!dateString) return "Recently"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-green-400">
                Loading...
            </div>
        )
    }

    return (
        <div className="pt-20 pb-12 relative overflow-hidden min-h-screen bg-black">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black"></div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-1000">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                            {getDisplayName()}'s Dashboard
                        </span>
                    </h1>
                    <div className="flex items-center justify-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <span>Joined {formatJoinDate(user?.createdAt)}</span>
                    </div>
                </div>

                {/* Stats Section */}
                <TeacherStats />

                {/* Quick Actions Section */}
                <QuickActions />

                {/* My Batches Section */}
                <MyBatchesSection />
            </div>
        </div>
    )
}
