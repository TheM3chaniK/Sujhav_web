"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Users, BookOpen, Check, X, Ban } from 'lucide-react'
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function MarkAttendanceAction() {
    const { toast } = useToast()
    const [batches, setBatches] = useState([])
    const [selectedBatchId, setSelectedBatchId] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [attendanceDate, setAttendanceDate] = useState(new Date())

    // Attendance state map: { studentId: 'present' | 'absent' | 'no_class' }
    const [attendanceState, setAttendanceState] = useState({})

    useEffect(() => {
        fetchBatches()
    }, [])

    useEffect(() => {
        if (selectedBatchId) {
            const batch = batches.find(b => (b.id || b._id) === selectedBatchId)
            if (batch) {
                // Filter subjects where the current teacher is assigned
                // For now, listing all subjects or filtering if teacher ID was available in context
                // Assuming the backed filters 'my-batches' correctly, we can show all subjects of this batch
                setSubjects(batch.subjects || [])
                // Reset subject selection
                setSelectedSubject("")
            }
            fetchBatchStudents(selectedBatchId)
        }
    }, [selectedBatchId, batches])

    const fetchBatches = async () => {
        try {
            const res = await fetch('/api/batches/teacher/my-batches', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setBatches(data.data || [])
            }
        } catch (error) {
            console.error("Error fetching batches:", error)
        }
    }

    // Logic to fetch student data AND existing attendance
    const fetchBatchStudents = async (batchId) => {
        setLoading(true)
        try {
            // 1. Fetch Students
            const res = await fetch(`/api/batches/teacher/batch/${batchId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                const batchData = data.data
                let studentList = []
                if (batchData.studentAssignments) {
                    studentList = batchData.studentAssignments.map(sa => sa.student)
                } else if (batchData.students) {
                    studentList = batchData.students
                }
                setStudents(studentList)

                // 2. Fetch Existing Attendance if subject & date selected
                if (selectedSubject) {
                    fetchAttendanceForDate(batchId, selectedSubject, attendanceDate, studentList)
                } else {
                    // Default init
                    const initialAttendance = {}
                    studentList.forEach(s => { initialAttendance[s._id || s.id] = 'present' })
                    setAttendanceState(initialAttendance)
                }
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAttendanceForDate = async (batchId, subject, date, studentList) => {
        try {
            const dateStr = format(date, 'yyyy-MM-dd')
            const res = await fetch(`/api/attendance/date/${batchId}/${encodeURIComponent(subject)}/${dateStr}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            const initialAttendance = {}
            // Default all to present first
            studentList.forEach(s => { initialAttendance[s._id || s.id] = 'present' })

            if (res.ok) {
                const data = await res.json()
                const record = data.data
                if (record && record.studentAttendance) {
                    record.studentAttendance.forEach(sa => {
                        // sa.student is usually ID here
                        initialAttendance[sa.student] = sa.status
                    })
                }
            }
            setAttendanceState(initialAttendance)
        } catch (error) {
            console.error("Error fetching attendance:", error)
        }
    }

    // Effect to refetch attendance when date/subject changes
    useEffect(() => {
        if (selectedBatchId && selectedSubject) {
            fetchAttendanceForDate(selectedBatchId, selectedSubject, attendanceDate, students)
        }
    }, [attendanceDate, selectedSubject, selectedBatchId, students]) // Added selectedBatchId and students to dependencies

    const handleMarkAll = (status) => {
        const newState = { ...attendanceState }
        students.forEach(s => {
            newState[s._id || s.id] = status
        })
        setAttendanceState(newState)
    }

    const toggleStudentStatus = (studentId, status) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: status
        }))
    }

    const submitAttendance = async () => {
        if (!selectedBatchId || !selectedSubject) {
            toast({
                title: "Error",
                description: "Please select a batch and subject",
                variant: "destructive"
            })
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                batchId: selectedBatchId,
                subject: selectedSubject,
                date: format(attendanceDate, 'yyyy-MM-dd'),
                attendance: Object.entries(attendanceState).map(([studentId, status]) => ({
                    studentId,
                    status
                }))
            }

            const res = await fetch('/api/attendance/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast({
                    title: "Success",
                    description: "Attendance marked successfully",
                    variant: "default",
                    className: "bg-green-600 text-white border-none"
                })
            } else {
                throw new Error("Failed to submit")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark attendance",
                variant: "destructive"
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-2"><Users className="h-5 w-5 text-blue-400" /></div>
                        <div className="text-2xl font-bold text-white">{batches.length}</div>
                        <div className="text-xs text-gray-400">Total Batches</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-2"><BookOpen className="h-5 w-5 text-purple-400" /></div>
                        {/* Simplified count */}
                        <div className="text-2xl font-bold text-white">
                            {batches.reduce((acc, b) => acc + (b.subjectCount || b.subjects?.length || 0), 0)}
                        </div>
                        <div className="text-xs text-gray-400">Total Subjects</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-2"><Users className="h-5 w-5 text-green-400" /></div>
                        <div className="text-2xl font-bold text-white">
                            {batches.reduce((acc, b) => acc + (b.studentCount || 0), 0)}
                        </div>
                        <div className="text-xs text-gray-400">Total Students</div>
                    </CardContent>
                </Card>
            </div>

            {/* Selection Controls */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm text-gray-400">Select Batch</label>
                        <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Choose Batch" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                {batches.map(b => (
                                    <SelectItem key={b.id || b._id} value={b.id || b._id}>{b.batchName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm text-gray-400">Select Subject</label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedBatchId}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Choose Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                {subjects.map(s => (
                                    <SelectItem key={s._id || s.name} value={s.name}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm text-gray-400">Date</label>
                        <div className="flex items-center h-10 px-3 rounded-md border border-white/20 bg-white/10 text-white">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {format(attendanceDate, "PPP")}
                        </div>
                    </div>
                </div>
            </div>

            {/* Student List */}
            {selectedBatchId && selectedSubject && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Mark Attendance</h3>
                        <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleMarkAll('present')} className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                                All Present
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleMarkAll('absent')} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                All Absent
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-[1fr,auto] gap-4 p-4 border-b border-white/10 bg-white/5 font-medium text-gray-400 text-sm">
                            <div>Student Name</div>
                            <div className="flex space-x-8 pr-4">
                                <span className="text-green-400">Present</span>
                                <span className="text-red-400">Absent</span>
                                <span className="text-gray-400">No Class</span>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading students...</div>
                            ) : (
                                students.map(student => (
                                    <div key={student._id || student.id} className="grid grid-cols-[1fr,auto] gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                                        <div className="font-medium text-white">{student.name}</div>
                                        <div className="flex items-center space-x-4 bg-black/20 p-1 rounded-lg">
                                            <button
                                                onClick={() => toggleStudentStatus(student._id || student.id, 'present')}
                                                className={`p-2 rounded-md transition-all ${attendanceState[student._id || student.id] === 'present' ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-green-400'}`}
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleStudentStatus(student._id || student.id, 'absent')}
                                                className={`p-2 rounded-md transition-all ${attendanceState[student._id || student.id] === 'absent' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-red-400'}`}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleStudentStatus(student._id || student.id, 'no_class')}
                                                className={`p-2 rounded-md transition-all ${attendanceState[student._id || student.id] === 'no_class' ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-6"
                        onClick={submitAttendance}
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save Attendance"}
                    </Button>
                </div>
            )}
        </div>
    )
}
