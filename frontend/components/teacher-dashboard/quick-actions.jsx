"use client"

import { useState } from "react"
import { Calendar, UserCheck, GraduationCap } from 'lucide-react'
import EventsCalendarAction from "./actions/events-calendar-action"
import StudentReportsAction from "./actions/student-reports-action"
import MarkAttendanceAction from "./actions/mark-attendance-action"

export default function QuickActions() {
    const [activeAction, setActiveAction] = useState(null)

    const actions = [
        {
            id: "events",
            title: "Events & Calendar",
            icon: Calendar,
            description: "Manage batch events and schedule",
            color: "from-pink-500 to-rose-500",
            component: EventsCalendarAction
        },
        {
            id: "reports",
            title: "Student Reports",
            icon: GraduationCap,
            description: "View attendance and academic records",
            color: "from-violet-500 to-purple-500",
            component: StudentReportsAction
        },
        {
            id: "attendance",
            title: "Mark Attendance",
            icon: UserCheck,
            description: "Record daily class attendance",
            color: "from-orange-500 to-amber-500",
            component: MarkAttendanceAction
        }
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400">Quick Actions</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {actions.map((action, index) => {
                    const Icon = action.icon
                    const isActive = activeAction === action.id

                    return (
                        <div
                            key={action.id}
                            onClick={() => setActiveAction(isActive ? null : action.id)}
                            className={`
                relative overflow-hidden rounded-xl p-6 cursor-pointer border transition-all duration-300
                ${isActive
                                    ? "bg-white/10 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                                }
              `}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                                <p className="text-gray-400 text-sm">{action.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Expandable Action Area */}
            {activeAction && (
                <div className="mt-8 animate-in fade-in slide-in-from-top duration-300">
                    {actions.find(a => a.id === activeAction)?.component && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            {(() => {
                                const Component = actions.find(a => a.id === activeAction).component
                                return <Component />
                            })()}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
