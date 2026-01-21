"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, GraduationCap, ArrowRight, BookOpen, BarChart3, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardAccessGuard({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900/20 backdrop-blur-sm border-green-500/20">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-green-400">Access Required</CardTitle>
            <CardDescription className="text-gray-400">Please log in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not a SUJHAV student
  if (!user.isSujhavStudent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="bg-gray-900/20 backdrop-blur-sm border-red-500/20">
            <CardHeader className="text-center">
              <GraduationCap className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-400">Dashboard Access Restricted</CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                The student dashboard is exclusively available for SUJHAV Institute students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">Why can't I access the dashboard?</h3>
                <p className="text-gray-300 text-sm">
                  Our advanced AI-powered dashboard with personalized analytics, progress tracking, and study
                  recommendations is designed specifically for SUJHAV Institute students as part of their comprehensive
                  learning experience.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-green-400 font-medium">AI Analytics</h4>
                  <p className="text-gray-400 text-sm">Personalized performance insights</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                  <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-green-400 font-medium">Study Plans</h4>
                  <p className="text-gray-400 text-sm">Customized learning paths</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                  <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-green-400 font-medium">Progress Tracking</h4>
                  <p className="text-gray-400 text-sm">Real-time performance monitoring</p>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">Interested in joining SUJHAV Institute?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Discover our comprehensive programs designed to help students excel in their academic journey and
                  achieve their career goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push("/about")}
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    Learn About SUJHAV
                  </Button>
                  <Button
                    onClick={() => router.push("/#contact")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                  >
                    Contact for Admission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={() => router.push("/")} variant="ghost" className="text-gray-400 hover:text-green-400">
                  ← Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // SUJHAV student or Teacher - show dashboard
  if (user.isSujhavStudent || user.role === 'teacher') {
    return children
  }

  // Not authorised
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="bg-gray-900/20 backdrop-blur-sm border-red-500/20">
          <CardHeader className="text-center">
            <GraduationCap className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-400">Dashboard Access Restricted</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              The student dashboard is exclusively available for SUJHAV Institute students and teachers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">Why can't I access the dashboard?</h3>
              <p className="text-gray-300 text-sm">
                This area is restricted to authorized students and teachers of SUJHAV Institute.
              </p>
            </div>

            <div className="text-center">
              <Button onClick={() => router.push("/")} variant="ghost" className="text-gray-400 hover:text-green-400">
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
