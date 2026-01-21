"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BatchDetailView from "./batch-details/batch-detail-view"

export default function MyBatchesSection() {
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedBatch, setSelectedBatch] = useState(null)

    useEffect(() => {
        fetchBatches()
    }, [])

    const fetchBatches = async () => {
        try {
            const res = await fetch('/api/batches/teacher/my-batches', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setBatches(data.data || [])
            }
        } catch (error) {
            console.error("Error fetching batches:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center text-gray-400">Loading batches...</div>
    }

    if (selectedBatch) {
        return <BatchDetailView batch={selectedBatch} onBack={() => setSelectedBatch(null)} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-green-400">My Batches</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch, index) => (
                    <motion.div
                        key={batch.id || batch._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl overflow-hidden transition-all duration-300"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                                        {batch.batchName}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1 capitalize">{batch.category} • Class {batch.classes?.join(", ")}</p>
                                </div>
                                <Badge variant={batch.isActive ? "default" : "secondary"} className={batch.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                                    {batch.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    <span>{batch.studentCount || 0} Students</span>
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    <span>{batch.subjectCount || 0} Subjects</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full bg-white/5 hover:bg-green-500/20 text-green-400 border border-green-500/20"
                                    onClick={() => setSelectedBatch(batch)}
                                >
                                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {batches.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No batches assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
