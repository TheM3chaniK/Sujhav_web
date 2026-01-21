"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentsTab({ batchId }) {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStudents()
    }, [batchId])

    const fetchStudents = async () => {
        try {
            const res = await fetch(`/api/batches/teacher/batch/${batchId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                const batchData = data.data
                let studentList = []
                if (batchData.studentAssignments) {
                    studentList = batchData.studentAssignments.map(sa => ({ ...sa.student, enrolledAt: sa.enrolledAt }))
                } else if (batchData.students) {
                    studentList = batchData.students
                }
                setStudents(studentList)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="text-gray-400 text-center py-8">Loading students...</div>

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.length > 0 ? students.map((student, i) => (
                <Card key={i} className="bg-white/5 border border-white/10 hover:border-green-500/30 transition-all">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="text-gray-300" />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-white font-semibold truncate">{student.name}</h4>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                <Mail className="h-3 w-3 mr-1" />
                                <span className="truncate">{student.email}</span>
                            </div>
                            {student.enrolledAt && (
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Joined {new Date(student.enrolledAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )) : <div className="col-span-full text-center text-gray-400 py-8">No students enrolled</div>}
        </div>
    )
}
