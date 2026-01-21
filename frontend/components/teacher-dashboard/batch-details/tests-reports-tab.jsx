"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TestManagement from "./tests/test-management"
import ReportsAnalytics from "./tests/reports-analytics"
import TestScores from "./tests/test-scores"

export default function TestsReportsTab({ batchId, batchName }) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="management" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="management" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">Test Management</TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Reports & Analytics</TabsTrigger>
                    <TabsTrigger value="scores" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Test Scores</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="management">
                        <TestManagement batchId={batchId} batchName={batchName} />
                    </TabsContent>
                    <TabsContent value="reports">
                        <ReportsAnalytics batchId={batchId} />
                    </TabsContent>
                    <TabsContent value="scores">
                        <TestScores batchId={batchId} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
