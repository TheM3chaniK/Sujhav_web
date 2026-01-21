"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, Brain, Calendar, BookOpen, ChevronRight, AlertCircle, CheckCircle, User } from 'lucide-react'
import AIAnalyticsSection from "./ai-analytics-section"
import { motion } from "framer-motion"

export default function DashboardContent({ onAnimationComplete }) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [user, setUser] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showAllTests, setShowAllTests] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        fetchUserData(parsedUser.id)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`/api/tests/${userId}`)
      const data = await res.json()
      if (res.ok) {
        setUserStats(data.stats)
        setTests(data.results)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !animationComplete) {
      const timer1 = setTimeout(() => { setShowWelcome(false) }, 3000)
      const timer2 = setTimeout(() => {
        setShowDashboard(true)
        setAnimationComplete(true)
      }, 3700)
      return () => { clearTimeout(timer1); clearTimeout(timer2) }
    }
  }, [user, animationComplete])

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "good": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "needs-improvement": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-4 w-4" />
      case "good": return <Target className="h-4 w-4" />
      case "needs-improvement": return <AlertCircle className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const formatJoinDate = (dateString) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const getDisplayName = () => {
    if (!user) return "Student"
    return user.fullName || user.name || "Student"
  }

  const getClassDisplay = () => {
    if (!user?.class) return ""
    let classText = `Class ${user.class}`
    if (user.stream) {
      classText += ` - ${user.stream.charAt(0).toUpperCase() + user.stream.slice(1)}`
    }
    return classText
  }

  if (loading || !user) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center animate-spin">
              <BookOpen className="h-12 w-12 text-black" />
            </div>
          </div>
          <p className="text-xl text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const displayedTests = showAllTests ? tests : tests.slice(0, 3)

  return (
    <div className={`pt-20 pb-12 relative overflow-hidden transition-all duration-1000 ${showDashboard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              {getDisplayName()}'s Dashboard
            </span>
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            {getClassDisplay() && (<>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span>{getClassDisplay()}</span>
            </>)}
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Joined {formatJoinDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{
            icon: TrendingUp,
            value: userStats?.averageScore ? `${userStats.averageScore.toFixed(1)}%` : "N/A",
            label: "Average Score",
            badge: userStats?.improvement ? `+${userStats.improvement}% this month` : null,
            color: "from-green-500 to-green-600",
            badgeColor: "bg-green-500/10 text-green-400 border-green-500/20",
            delay: "0s",
          }, {
            icon: BookOpen,
            value: userStats ? `${userStats.testsCompleted}/${userStats.totalTests}` : "0/0",
            label: "Tests Completed",
            color: "from-blue-500 to-blue-600",
            delay: "0.1s",
          }, {
            icon: Brain,
            value: "AI",
            label: "Analytics Ready",
            color: "from-purple-500 to-purple-600",
            delay: "0.2s",
          }].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: stat.delay }}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  {stat.badge && <Badge className={`mt-2 ${stat.badgeColor}`}>{stat.badge}</Badge>}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-green-500/20">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <Brain className="mr-2 h-4 w-4" /> AI Analytics
            </TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <Calendar className="mr-2 h-4 w-4" /> Recent Tests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-6">
            <AIAnalyticsSection userId={user.id} />
          </TabsContent>
          <TabsContent value="tests" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-green-400 flex items-center">
                  <Calendar className="mr-3 h-6 w-6" /> Test Scores
                </CardTitle>
                <Button
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 bg-transparent"
                  onClick={() => setShowAllTests(!showAllTests)}
                >
                  {showAllTests ? "Show Recent" : "See All Tests"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayedTests.length > 0 ? (
                  displayedTests.map((test, index) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-green-500/10 hover:border-green-500/20 transition-colors animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-400">{test.test?.subject || 'Test'}</h3>
                          <p className="text-gray-400 text-sm">{test.topic || test.test?.title}</p>
                          <p className="text-gray-500 text-xs">{test.createdAt ? new Date(test.createdAt).toLocaleDateString() : 'Recently'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{test.score}/{test.totalMarks}</div>
                          <div className="text-sm text-gray-400">{test.percentage?.toFixed(1)}%</div>
                        </div>
                        <Badge className={getStatusColor(test.status || 'good')}>
                          {getStatusIcon(test.status || 'good')}
                          <span className="ml-1 capitalize">{test.status ? test.status.replace("-", " ") : 'Completed'}</span>
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No tests yet</h3>
                    <p className="text-gray-500">Start taking tests to see your progress here</p>
                    <Button className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold">
                      Take Your First Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
