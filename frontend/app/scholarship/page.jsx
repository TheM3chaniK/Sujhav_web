"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, GraduationCap, Calendar, User, BookOpen } from "lucide-react"

const formSchema = z.object({
    studentName: z.string().min(2, "Student name is required"),
    parentName: z.string().min(2, "Parent name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Invalid email address"),
    currentClass: z.string().min(1, "Please select your class"),
    schoolName: z.string().min(2, "School name is required"),
    address: z.string().min(5, "Address is required"),
    preferredDate: z.string().min(1, "Please select a test date"),
    preferredTimeSlot: z.string().min(1, "Please select a time slot"),
    lastMarks: z.string().optional(),
    targetCourse: z.string().min(1, "Target course is required"),
    additionalNotes: z.string().optional(),
})

export default function ScholarshipPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentName: "",
            parentName: "",
            phone: "",
            email: "",
            currentClass: "",
            schoolName: "",
            address: "",
            preferredDate: "",
            preferredTimeSlot: "",
            lastMarks: "",
            targetCourse: "",
            additionalNotes: "",
        },
    })

    async function onSubmit(values) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/scholarship/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Registration Successful!",
                    description: "Our team will contact you soon with further details.",
                })
                form.reset()
            } else {
                throw new Error(data.message || "Failed to submit registration")
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Advanced Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)] pointer-events-none" />

            {/* Animated Decorative Elements */}
            <div className="absolute top-24 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
                                    SAMARTH Scholarship Test
                                </span>
                            </h1>
                            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                                Har Sapna, Ab Sambhav! Empowering your future through excellence.
                            </p>
                        </div>

                        <Card className="bg-black/40 backdrop-blur-2xl border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
                            <CardHeader className="border-b border-green-500/10 pb-8">
                                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                                    Registration Form
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-base">
                                    Please provide accurate details for the scholarship assessment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-10">
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                                    {/* Student Details Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 text-green-400 font-bold text-base sm:text-lg uppercase tracking-wider">
                                            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                                                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <span>Student Details</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="studentName" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Student Name *</Label>
                                                <Input id="studentName" {...form.register("studentName")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white transition-all duration-300" placeholder="Enter Full Name" />
                                                {form.formState.errors.studentName && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.studentName.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="parentName" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Parent/Guardian Name *</Label>
                                                <Input id="parentName" {...form.register("parentName")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white transition-all duration-300" placeholder="Enter Parent Name" />
                                                {form.formState.errors.parentName && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.parentName.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="phone" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Phone Number *</Label>
                                                <Input id="phone" {...form.register("phone")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white transition-all duration-300" placeholder="10-digit Mobile Number" />
                                                {form.formState.errors.phone && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.phone.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="email" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Email Address *</Label>
                                                <Input id="email" type="email" {...form.register("email")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white transition-all duration-300" placeholder="email@example.com" />
                                                {form.formState.errors.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.email.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="currentClass" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Current Class *</Label>
                                                <Select onValueChange={(v) => form.setValue("currentClass", v)}>
                                                    <SelectTrigger className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 text-white transition-all duration-300">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-950 border-green-500/30 text-white backdrop-blur-xl">
                                                        {["4", "5", "6", "7", "8", "9", "10", "11", "12", "Dropper"].map((cls) => (
                                                            <SelectItem key={cls} value={cls} className="focus:bg-green-500/20 focus:text-green-400 transition-colors">Class {cls}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.currentClass && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.currentClass.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="schoolName" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">School/College Name *</Label>
                                                <Input id="schoolName" {...form.register("schoolName")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white transition-all duration-300" placeholder="Enter School Name" />
                                                {form.formState.errors.schoolName && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.schoolName.message}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="address" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Full Address *</Label>
                                            <Textarea id="address" {...form.register("address")} className="bg-white/5 border-green-500/20 focus:border-green-400 focus:ring-green-400/20 text-white resize-none transition-all duration-300" rows={3} placeholder="Enter your full reachable address" />
                                            {form.formState.errors.address && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.address.message}</p>}
                                        </div>
                                    </div>

                                    {/* Test Preferences Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 text-green-400 font-bold text-base sm:text-lg uppercase tracking-wider">
                                            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <span>Test Preferences</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="preferredDate" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Preferred Test Date *</Label>
                                                <Input id="preferredDate" type="date" {...form.register("preferredDate")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 text-white transition-all duration-300 [color-scheme:dark]" />
                                                {form.formState.errors.preferredDate && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.preferredDate.message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="preferredTimeSlot" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Preferred Time Slot *</Label>
                                                <Select onValueChange={(v) => form.setValue("preferredTimeSlot", v)}>
                                                    <SelectTrigger className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 text-white transition-all duration-300">
                                                        <SelectValue placeholder="Select Slot" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-950 border-green-500/30 text-white backdrop-blur-xl">
                                                        <SelectItem value="10 am - 12 pm" className="focus:bg-green-500/20 focus:text-green-400 transition-colors">10 am - 12 pm</SelectItem>
                                                        <SelectItem value="2 pm - 4 pm" className="focus:bg-green-500/20 focus:text-green-400 transition-colors">2 pm - 4 pm</SelectItem>
                                                        <SelectItem value="4 pm - 6 pm" className="focus:bg-green-500/20 focus:text-green-400 transition-colors">4 pm - 6 pm</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.preferredTimeSlot && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.preferredTimeSlot.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 text-green-400 font-bold text-base sm:text-lg uppercase tracking-wider">
                                            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <span>Additional Information</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="lastMarks" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Last Appeared Exam Marks (%)</Label>
                                                <Input id="lastMarks" {...form.register("lastMarks")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 text-white transition-all duration-300" placeholder="e.g. 92.5" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="targetCourse" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Target Course *</Label>
                                                <Input id="targetCourse" {...form.register("targetCourse")} className="h-12 bg-white/5 border-green-500/20 focus:border-green-400 text-white transition-all duration-300" placeholder="e.g. JEE, NEET, Class 10 Boards" />
                                                {form.formState.errors.targetCourse && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{form.formState.errors.targetCourse.message}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="additionalNotes" className="text-gray-300 font-semibold tracking-wide ml-1 uppercase text-xs">Additional Notes</Label>
                                            <Textarea id="additionalNotes" {...form.register("additionalNotes")} className="bg-white/5 border-green-500/20 focus:border-green-400 text-white resize-none transition-all duration-300" rows={3} placeholder="Any other info you want to share" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-extrabold text-lg sm:text-xl py-6 sm:py-8 rounded-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:grayscale"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                SUBMITTING YOUR APPLICATION...
                                            </>
                                        ) : (
                                            "COMPLETE REGISTRATION"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}
