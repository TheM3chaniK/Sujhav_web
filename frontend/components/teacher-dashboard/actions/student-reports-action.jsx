"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, GraduationCap, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function StudentReportsAction() {
    const [batches, setBatches] = useState([])
    const [selectedBatchId, setSelectedBatchId] = useState(null)
    const [students, setStudents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [studentStats, setStudentStats] = useState(null)
    const [loadingStats, setLoadingStats] = useState(false)

    useEffect(() => {
        fetchBatches()
    }, [])

    useEffect(() => {
        if (selectedBatchId) {
            fetchBatchStudents(selectedBatchId)
        }
    }, [selectedBatchId])

    useEffect(() => {
        if (selectedStudent) {
            fetchStudentDetails(selectedStudent._id || selectedStudent.id)
        }
    }, [selectedStudent])

    const fetchBatches = async () => {
        try {
            const res = await fetch('/api/batches/teacher/my-batches', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setBatches(data.data || [])
                if (data.data && data.data.length > 0) {
                    setSelectedBatchId(data.data[0].id || data.data[0]._id)
                }
            }
        } catch (error) {
            console.error("Error fetching batches:", error)
        }
    }

    const fetchBatchStudents = async (batchId) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/batches/teacher/batch/${batchId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                const batchData = data.data
                let studentList = []
                if (batchData.studentAssignments) {
                    studentList = batchData.studentAssignments.map(sa => ({
                        ...sa.student,
                        enrolledAt: sa.enrolledAt
                    }))
                } else if (batchData.students) {
                    studentList = batchData.students
                }
                setStudents(studentList)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStudentDetails = async (studentId) => {
        setLoadingStats(true)
        try {
            // Fetch Academic Stats
            const statsRes = await fetch(`/api/tests/reports/student/${studentId}/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            let academicStats = {}
            if (statsRes.ok) {
                const data = await statsRes.json()
                academicStats = data.data || {}
            }

            // Fetch Attendance Stats (Optional: fetch for a specific subject if needed, or aggregate)
            // Since we don't have a single "all subjects" attendance endpoint easily accessible here without looping,
            // we might just show what we have or rely on the report card endpoint if it includes attendance.
            // For now, we'll store academic stats.

            setStudentStats(academicStats)

        } catch (error) {
            console.error("Error fetching student details:", error)
        } finally {
            setLoadingStats(false)
        }
    }

    const getPerformanceColor = (percentage) => {
        if (!percentage) return "text-gray-400"
        if (percentage < 60) return "text-red-400"
        if (percentage < 75) return "text-yellow-400"
        return "text-green-400"
    }

    const renderStudentList = () => (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
                <div
                    key={student._id || student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-white/10 transition-all"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">{student.name}</h4>
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">{student.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-center text-gray-500 mt-2">
                        Click to view detailed report
                    </div>
                </div>
            ))}
            {students.length === 0 && !loading && (
                <div className="col-span-full text-center text-gray-400 py-8">
                    No students found in this batch.
                </div>
            )}
        </div>
    )

    const renderStudentDetails = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right">
            <Button variant="ghost" onClick={() => { setSelectedStudent(null); setStudentStats(null); }} className="text-gray-400 hover:text-white pl-0">
                ← Back to List
            </Button>

            {loadingStats ? (
                <div className="text-center py-12 text-gray-400">Loading student statistics...</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Basic Info Card */}
                    <Card className="bg-white/5 border-white/10 md:w-1/3 h-fit">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                                <User className="h-10 w-10 text-black" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                                <p className="text-gray-400 flex items-center justify-center mt-1">
                                    <Mail className="h-3 w-3 mr-1" /> {selectedStudent.email}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                                <div className="bg-white/5 p-2 rounded">
                                    <div className="text-xs text-gray-400">Avg Score</div>
                                    <div className={`font-bold ${getPerformanceColor(studentStats?.overallAverage)}`}>
                                        {studentStats?.overallAverage ? `${Math.round(studentStats.overallAverage)}%` : 'N/A'}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <div className="text-xs text-gray-400">Tests Taken</div>
                                    <div className="font-bold text-blue-400">{studentStats?.totalTestsAttempted || 0}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Tabs */}
                    <div className="md:w-2/3">
                        <Tabs defaultValue="academic" className="w-full">
                            <TabsList className="bg-white/5 border border-white/10 w-full justify-start">
                                <TabsTrigger value="academic">Academic Record</TabsTrigger>
                            </TabsList>

                            <TabsContent value="academic" className="space-y-4 mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "Tests Attempted", value: studentStats?.totalTestsAttempted || 0, icon: GraduationCap },
                                        { label: "Highest Score", value: `${studentStats?.highestScore || 0}%`, icon: CheckCircle },
                                        { label: "Lowest Score", value: `${studentStats?.lowestScore || 0}%`, icon: AlertTriangle }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                                            <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                                            <div className="text-lg font-bold text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h4 className="font-semibold text-white mb-4">Subject Performance</h4>
                                    {studentStats?.subjectPerformance && studentStats.subjectPerformance.length > 0 ? (
                                        <div className="space-y-4">
                                            {studentStats.subjectPerformance.map((subj, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>{subj.subject}</span>
                                                        <span className={getPerformanceColor(subj.averagePercentage)}>{Math.round(subj.averagePercentage)}%</span>
                                                    </div>
                                                    <Progress value={subj.averagePercentage} className="h-2" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">No subject data available.</div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-6">
            {!selectedStudent && (
                <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Select Batch:</span>
                    <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                        <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select a batch" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            {batches.map(batch => (
                                <SelectItem key={batch.id || batch._id} value={batch.id || batch._id}>
                                    {batch.batchName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading students...</div>
            ) : selectedStudent ? (
                renderStudentDetails()
            ) : (
                renderStudentList()
            )}
        </div>
    )
}
