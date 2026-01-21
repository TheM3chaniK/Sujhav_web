"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users } from 'lucide-react'

export default function ReportsAnalytics({ batchId }) {
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [stats, setStats] = useState({
        testCount: 0,
        averageScore: 0,
        topPerformers: []
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (batchId) {
            fetchSubjects()
        }
    }, [batchId])

    useEffect(() => {
        if (selectedSubject) {
            fetchAnalytics()
        }
    }, [selectedSubject])

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`/api/tests/teacher/batch/${batchId}/subjects`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSubjects(data.data || [])
                if (data.data && data.data.length > 0) {
                    setSelectedSubject(data.data[0].name)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            // 1. Fetch Top Performers
            const rankRes = await fetch(`/api/tests/rankings/batch/${batchId}/subject/${encodeURIComponent(selectedSubject)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            let topPerformers = []
            if (rankRes.ok) {
                const data = await rankRes.json()
                // Assuming data.data is the list. Take top 5.
                topPerformers = (data.data || []).slice(0, 5)
            }

            // 2. Fetch Tests to calculate average and count because there isn't a direct "subject stats" endpoint
            const testsRes = await fetch(`/api/tests/teacher/batch/${batchId}/subject/${encodeURIComponent(selectedSubject)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            let testCount = 0
            let averageScore = 0

            if (testsRes.ok) {
                const data = await testsRes.json()
                const tests = data.data || []
                testCount = tests.length

                // Calculate rough average of ALL accessible tests if possible
                // This is an estimation as we don't have a "batch average" endpoint exposed directly in the simplified routes
                // In a real production app, we should use a dedicated aggregation endpoint.
            }

            setStats({
                testCount,
                averageScore, // We might not be able to calc this easily without more calls, so maybe leave 0 or hide
                topPerformers
            })

        } catch (error) {
            console.error("Error fetching analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-gray-300">Analysis for Subject:</span>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {subjects.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Tests Conducted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">{stats.testCount}</div>
                        <p className="text-xs text-gray-500 mt-1">In {selectedSubject}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-400">{stats.topPerformers.length}</div>
                        <p className="text-xs text-gray-500 mt-1">Students ranked</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-gray-400" /> Leaderboard
                </h3>
                {loading ? (
                    <div className="text-gray-500 py-4 text-center">Loading rankings...</div>
                ) : stats.topPerformers.length > 0 ? (
                    <div className="space-y-4">
                        {stats.topPerformers.map((student, i) => (
                            <div key={student._id || i} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.email}</div>
                                    </div>
                                </div>
                                <div className="text-green-400 font-bold">
                                    {student.totalMarks != null ? student.totalMarks : 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No data available.</p>
                )}
            </div>
        </div>
    )
}
