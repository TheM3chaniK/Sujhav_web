"use client"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { format, isSameDay, parseISO } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function EventsCalendarAction() {
    const [batches, setBatches] = useState([])
    const [selectedBatchId, setSelectedBatchId] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Load batches on mount
    useEffect(() => {
        fetchBatches()
    }, [])

    // Load events when batch changes
    useEffect(() => {
        if (selectedBatchId) {
            fetchEvents(selectedBatchId)
        } else {
            setEvents([])
        }
    }, [selectedBatchId])

    const fetchBatches = async () => {
        try {
            const res = await fetch('/api/batches/teacher/my-batches', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                const fetchedBatches = data.data || []
                setBatches(fetchedBatches)
                if (fetchedBatches.length > 0) {
                    setSelectedBatchId(fetchedBatches[0].id || fetchedBatches[0]._id)
                }
            }
        } catch (error) {
            console.error("Error fetching batches:", error)
        }
    }

    const fetchEvents = async (batchId) => {
        setLoading(true)
        try {
            // Assuming multiple event endpoints or a combined one. 
            // Based on typical REST patterns, we might filter by batchId
            // NOTE: Adjusted endpoint to match /api/calendar mount point
            const res = await fetch(`/api/calendar/events/${batchId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data.data || [])
            } else {
                // Fallback for demo or if endpoint structure differs
                setEvents([])
            }
        } catch (error) {
            console.error("Error fetching events:", error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    // --- Derived State & Helpers ---

    const today = new Date()

    const totalEvents = events.length
    const todayEventsCount = events.filter(e => isSameDay(parseISO(e.date), today)).length
    const upcomingEventsCount = events.filter(e => parseISO(e.date) > today).length

    // Modifiers for the calendar (Red dots for event dates)
    const eventDays = events.map(e => parseISO(e.date))

    // Custom modifiers styles
    const modifiersStyles = {
        hasEvent: {
            color: 'white',
            fontWeight: 'bold',
            position: 'relative'
        }
    }

    const selectedDateEvents = events.filter(e =>
        selectedDate && isSameDay(parseISO(e.date), selectedDate)
    )

    const EventDot = () => <div className="w-1.5 h-1.5 bg-red-500 rounded-full mx-auto mt-1"></div>;

    return (
        <div className="space-y-6">
            {/* Batch Selection */}
            <div className="flex items-center space-x-4">
                <span className="text-gray-300">Select Batch:</span>
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                    <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {batches.map(batch => (
                            <SelectItem key={batch.id || batch._id} value={batch.id || batch._id}>
                                {batch.batchName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading events...</div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Overview & Calendar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{totalEvents}</div>
                                    <div className="text-xs text-gray-400">Total Events</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">{todayEventsCount}</div>
                                    <div className="text-xs text-gray-400">Today</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{upcomingEventsCount}</div>
                                    <div className="text-xs text-gray-400">Upcoming</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Calendar */}
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-center">
                            <style>{`
                      .rdp-day_selected { background-color: #22c55e !important; color: black !important; font-weight: bold; }
                      .rdp-day_today { color: #22c55e; font-weight: bold; }
                      .rdp-day:hover:not(.rdp-day_selected) { background-color: rgba(255,255,255,0.1) !important; }
                    `}</style>
                            <DayPicker
                                mode="single"
                                required
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                modifiers={{ hasEvent: eventDays }}
                                modifiersStyles={modifiersStyles}
                                components={{
                                    DayContent: (props) => {
                                        const isEventDay = eventDays.some(d => isSameDay(d, props.date));
                                        return (
                                            <div className="relative flex flex-col items-center justify-center p-2">
                                                <span>{format(props.date, 'd')}</span>
                                                {isEventDay && <EventDot />}
                                            </div>
                                        )
                                    }
                                }}
                                className="text-white"
                                classNames={{
                                    head_cell: 'text-gray-400 font-normal opacity-0.8',
                                    caption: 'text-green-400',
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Column: Events List for Selected Date */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full min-h-[400px]">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-green-400" />
                            Events for {format(selectedDate, 'MMM d, yyyy')}
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {selectedDateEvents.length > 0 ? (
                                selectedDateEvents.map((event, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-green-300">{event.title}</h4>
                                            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 capitalize">
                                                {event.type}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-300 mb-2">{event.description}</div>
                                        <div className="flex items-center text-xs text-gray-400 space-x-3">
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {event.startTime} - {event.endTime}
                                            </span>
                                            {event.location && (
                                                <span className="flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {event.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p>No events scheduled for this day.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
