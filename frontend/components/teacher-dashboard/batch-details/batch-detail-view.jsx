"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import StudentsTab from "./students-tab"
import DetailsTab from "./details-tab"
import TestsReportsTab from "./tests-reports-tab"

export default function BatchDetailView({ batch, onBack }) {
    if (!batch) return null

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Batches
                </Button>
                <h1 className="text-2xl font-bold text-white">{batch.batchName}</h1>
            </div>

            <Tabs defaultValue="tests" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="students" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">Students</TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">Details</TabsTrigger>
                    <TabsTrigger value="tests" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">Tests & Reports</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="students">
                        <StudentsTab batchId={batch.id || batch._id} />
                    </TabsContent>
                    <TabsContent value="details">
                        <DetailsTab batch={batch} />
                    </TabsContent>
                    <TabsContent value="tests">
                        <TestsReportsTab batchId={batch.id || batch._id} batchName={batch.batchName} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
