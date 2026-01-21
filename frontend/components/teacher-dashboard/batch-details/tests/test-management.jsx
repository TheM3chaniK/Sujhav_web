"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, BookOpen, Clock, Calendar } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import CreateTestDialog from "./create-test-dialog"
import { useToast } from "@/hooks/use-toast"

export default function TestManagement({ batchId, batchName }) {
    const { toast } = useToast()
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`/api/tests/teacher/batch/${batchId}/subjects`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSubjects(data.data || [])
                // Auto select first subject
                if (data.data && data.data.length > 0) {
                    setSelectedSubject(data.data[0].name)
                }
            }
        } catch (error) {
            console.error("Error fetching subjects:", error)
        }
    }

    const fetchTests = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/tests/teacher/batch/${batchId}/subject/${encodeURIComponent(selectedSubject)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTests(data.data || [])
            } else {
                setTests([])
            }
        } catch (error) {
            console.error("Error fetching tests:", error)
            setTests([])
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTest = async (testId) => {
        if (!confirm("Are you sure you want to delete this test?")) return;

        try {
            const res = await fetch(`/api/tests/teacher/${testId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            if (res.ok) {
                toast({ title: "Success", description: "Test deleted successfully", className: "bg-green-600 text-white" })
                fetchTests()
            } else {
                throw new Error("Failed to delete")
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete test", variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <span className="text-gray-400 whitespace-nowrap">Subject:</span>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-full md:w-[200px] bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            {subjects.map(s => (
                                <SelectItem key={s._id || s.name} value={s.name}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 w-full md:w-auto"
                    onClick={() => setIsCreateDialogOpen(true)}
                    disabled={!selectedSubject}
                >
                    <Plus className="h-4 w-4 mr-2" /> Create New Test
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading tests...</div>
            ) : tests.length > 0 ? (
                <div className="grid gap-4">
                    {tests.map(test => (
                        <div key={test._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/30 transition-all">
                            <div className="space-y-1">
                                <h4 className="text-lg font-semibold text-white">{test.testTitle}</h4>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                    <span className="flex items-center"><BookOpen className="h-3 w-3 mr-1" /> Marks: {test.fullMarks}</span>
                                    <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> Assigned: {test.assignedStudents?.length || 0}</span>
                                    {test.dueDate && (
                                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Due: {new Date(test.dueDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Badge variant="outline" className={`
                             ${test.isActive ? 'border-green-500/30 text-green-400' : 'border-gray-500/30 text-gray-400'}
                           `}>
                                    {test.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <div className="flex gap-2 ml-auto">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        onClick={() => handleDeleteTest(test._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No tests created for this subject yet.</p>
                </div>
            )}

            <CreateTestDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                batchId={batchId}
                subjectName={selectedSubject}
                onSuccess={fetchTests}
            />
        </div>
    )
}
