"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Layers } from 'lucide-react'
import { motion } from "framer-motion"

export default function TeacherStats() {
    const [stats, setStats] = useState({
        totalBatches: 0,
        totalStudents: 0,
        activeBatches: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/batches/teacher/my-batches', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                const batches = data.data || []

                const totalBatches = batches.length
                const activeBatches = batches.filter(b => b.isActive).length
                const totalStudents = batches.reduce((acc, curr) => acc + (curr.studentCount || 0), 0)

                setStats({
                    totalBatches,
                    totalStudents,
                    activeBatches
                })
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const statItems = [
        {
            label: "My Batches",
            value: stats.totalBatches,
            icon: Layers,
            color: "from-blue-500 to-blue-600",
            delay: "0s"
        },
        {
            label: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            color: "from-green-500 to-green-600",
            delay: "0.1s"
        },
        {
            label: "Active Batches",
            value: stats.activeBatches,
            icon: BookOpen,
            color: "from-purple-500 to-purple-600",
            delay: "0.2s"
        }
    ]

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {statItems.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: stat.delay }}>
                        <CardContent className="p-6 text-center">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-green-400 mb-1">
                                {loading ? "-" : stat.value}
                            </div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
