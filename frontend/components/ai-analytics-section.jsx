"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Target, Lightbulb, BookOpen, Clock, Award, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react'
import { useAIAnalytics } from "@/hooks/use-ai-analytics"

export default function AIAnalyticsSection({ userId }) {
  const { analytics, loading, error, generateAnalytics } = useAIAnalytics(userId)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAnalytics = async () => {
    setIsGenerating(true)
    await generateAnalytics()
    setIsGenerating(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500/30 border-t-green-400 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your AI analytics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-red-500/20">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={handleGenerateAnalytics}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
        <CardContent className="p-8 text-center">
          <Brain className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-green-400 mb-2">AI Analytics Ready</h3>
          <p className="text-gray-400 mb-6">
            Get personalized insights about your learning progress powered by advanced AI
          </p>
          <Button
            onClick={handleGenerateAnalytics}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Generating Analytics...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Analytics
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-green-500/10 backdrop-blur-xl border border-green-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-green-400 flex items-center">
            <Brain className="mr-3 h-6 w-6" />
            AI-Powered Learning Analytics
            <Badge className="ml-3 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Powered by Gemini AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">
              Last updated: {new Date(analytics.generatedAt).toLocaleDateString()}
            </p>
            <Button
              onClick={handleGenerateAnalytics}
              disabled={isGenerating}
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 bg-transparent"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Analytics
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.performanceTrends?.map((trend, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{trend.subject}</span>
                  <Badge className={trend.trend === 'improving' ? 'bg-green-500/20 text-green-400' : 
                                  trend.trend === 'declining' ? 'bg-red-500/20 text-red-400' : 
                                  'bg-blue-500/20 text-blue-400'}>
                    {trend.trend}
                  </Badge>
                </div>
                <Progress value={trend.score} className="h-2" />
                <p className="text-sm text-gray-400">{trend.insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Strengths & Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-green-300 font-medium mb-2 flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Strengths
              </h4>
              <div className="space-y-1">
                {analytics.strengths?.map((strength, index) => (
                  <Badge key={index} className="mr-2 mb-1 bg-green-500/20 text-green-400 border-green-500/30">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-yellow-300 font-medium mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Areas for Improvement
              </h4>
              <div className="space-y-1">
                {analytics.weaknesses?.map((weakness, index) => (
                  <Badge key={index} className="mr-2 mb-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-blue-300 font-medium mb-3 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Study Focus Areas
              </h4>
              <ul className="space-y-2">
                {analytics.recommendations?.studyFocus?.map((focus, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-purple-300 font-medium mb-3 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Study Schedule
              </h4>
              <ul className="space-y-2">
                {analytics.recommendations?.schedule?.map((item, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="bg-gradient-to-r from-green-500/5 to-blue-500/5 backdrop-blur-xl border border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">
            {analytics.summary}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
