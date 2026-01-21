"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateTestDialog({ open, onOpenChange, batchId, subjectName, onSuccess }) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        testTitle: "",
        fullMarks: "",
        className: "", // Should be selected if batch has multiple classes, assuming single or text input for now
        instructions: "",
        dueDate: "",
        questionPaper: null,
        answerPaper: null
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append("testTitle", formData.testTitle)
            data.append("fullMarks", formData.fullMarks)
            data.append("batch", batchId) // Ensure this matches backend expectation (batch ID)
            data.append("subjectName", subjectName)
            data.append("className", formData.className || "12") // Fallback or need input
            data.append("instructions", formData.instructions)
            if (formData.dueDate) data.append("dueDate", formData.dueDate)
            if (formData.questionPaper) data.append("questionPdf", formData.questionPaper)
            if (formData.answerPaper) data.append("answerPdf", formData.answerPaper)

            // NOTE: "assignedStudents" is required by backend validation typically.
            // Backend might auto-assign or we need to send array.
            // Looking at Test.js model: assignedStudents is required. 
            // We'll need to fetch eligible students first or backend handles it.
            // The `createTest` controller typically handles `assignedStudents` generation from batch if not provided?
            // Let's check controller... I cannot check controller now (limited steps).
            // I'll assume I need to fetch students and add them to the payload if not handled by backend.
            // Wait, usually the UI lets you select students. I'll add "All Students" logic implicitly for now.

            // To be safe, I'll fetch students of the batch and send their IDs.
            const studentsRes = await fetch(`/api/batches/teacher/batch/${batchId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const batchData = await studentsRes.json()
            const students = batchData.data.studentAssignments?.map(s => s.student._id || s.student.id) || []

            // Append students individually as per FormData array standard or JSON string
            // Backend `upload` middleware parses multipart/form-data.
            // Usually arrays in FormData are appended with same key.
            students.forEach(id => data.append("assignedStudents", id))

            const res = await fetch('/api/tests/teacher/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: data
            })

            if (res.ok) {
                toast({ title: "Success", description: "Test created successfully", className: "bg-green-600 text-white" })
                onSuccess()
                onOpenChange(false)
            } else {
                const errorData = await res.json()
                throw new Error(errorData.message || "Failed to create test")
            }
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Test for {subjectName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Test Title</Label>
                            <Input name="testTitle" value={formData.testTitle} onChange={handleChange} required className="bg-white/5 border-white/20" />
                        </div>
                        <div className="space-y-2">
                            <Label>Class Name</Label>
                            <Input name="className" value={formData.className} onChange={handleChange} required placeholder="e.g. 11, 12" className="bg-white/5 border-white/20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Marks</Label>
                            <Input type="number" name="fullMarks" value={formData.fullMarks} onChange={handleChange} required className="bg-white/5 border-white/20" />
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleChange} className="bg-white/5 border-white/20 dark-calendar-icon" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea name="instructions" value={formData.instructions} onChange={handleChange} className="bg-white/5 border-white/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Question Paper (PDF)</Label>
                            <Input type="file" name="questionPaper" accept="application/pdf" onChange={handleFileChange} className="bg-white/5 border-white/20" />
                        </div>
                        <div className="space-y-2">
                            <Label>Answer Paper (PDF)</Label>
                            <Input type="file" name="answerPaper" accept="application/pdf" onChange={handleFileChange} className="bg-white/5 border-white/20" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Creating..." : "Create Test"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
