"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Save, CheckCircle } from 'lucide-react'

export default function TestScores({ batchId }) {
    const { toast } = useToast()
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [tests, setTests] = useState([])
    const [selectedTestId, setSelectedTestId] = useState(null)
    const [students, setStudents] = useState([]) // From test assignedStudents
    const [marks, setMarks] = useState({}) // { studentId: marks }
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchSubjects()
    }, [batchId])

    useEffect(() => {
        if (selectedSubject) {
            fetchTests()
        } else {
            setTests([])
        }
    }, [selectedSubject])

    useEffect(() => {
        if (selectedTestId) {
            const test = tests.find(t => t._id === selectedTestId)
            if (test) {
                // Initialize marks
                const initialMarks = {}
                const studentList = test.assignedStudents.map(s => {
                    initialMarks[s.student._id] = s.marksScored || ""
                    return {
                        id: s.student._id,
                        name: s.student.name,
                        email: s.student.email,
                        marksScored: s.marksScored,
                        maxMarks: test.fullMarks
                    }
                })
                setStudents(studentList)
                setMarks(initialMarks)
            }
        }
    }, [selectedTestId, tests])

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`/api/tests/teacher/batch/${batchId}/subjects`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSubjects(data.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchTests = async () => {
        try {
            const res = await fetch(`/api/tests/teacher/batch/${batchId}/subject/${encodeURIComponent(selectedSubject)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTests(data.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleMarkChange = (studentId, value) => {
        setMarks(prev => ({ ...prev, [studentId]: value }))
    }

    const handleSaveMarks = async (studentId) => {
        const mark = marks[studentId]
        if (mark === "" || mark === null) return

        try {
            const res = await fetch(`/api/tests/teacher/${selectedTestId}/marks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    studentId,
                    marksScored: Number(mark)
                })
            })

            if (res.ok) {
                toast({ title: "Saved", description: "Marks updated", className: "bg-green-600 text-white" })
            } else {
                throw new Error("Failed to save")
            }
        } catch (error) {
            toast({ title: "Error", variant: "destructive", description: "Could not save marks" })
        }
    }

    // Filter students
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                    <label className="text-sm text-gray-400 mb-2 block">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            {subjects.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-1/3">
                    <label className="text-sm text-gray-400 mb-2 block">Test</label>
                    <Select value={selectedTestId} onValueChange={setSelectedTestId} disabled={!selectedSubject}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select Test" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            {tests.map(t => <SelectItem key={t._id} value={t._id}>{t.testTitle}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedTestId && (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/5 border-white/20 text-white"
                            />
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">Student</th>
                                    <th className="p-4 font-medium">Full Marks</th>
                                    <th className="p-4 font-medium">Marks Scored</th>
                                    <th className="p-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{student.name}</div>
                                            <div className="text-xs text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-300">{student.maxMarks}</td>
                                        <td className="p-4">
                                            <Input
                                                type="number"
                                                className="w-24 bg-black/20 border-white/10 text-white"
                                                value={marks[student.id]}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                max={student.maxMarks}
                                                min={0}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveMarks(student.id)}
                                                className="bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                            >
                                                <Save className="h-4 w-4 mr-2" /> Save
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No students found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
