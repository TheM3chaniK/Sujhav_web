"use client"

import { Layers, Book, Users, Clock } from 'lucide-react'

export default function DetailsTab({ batch }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Batch Information</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                        <Layers className="h-5 w-5 text-green-400" />
                        <span className="font-semibold text-white">Batch Name:</span>
                        <span>{batch.batchName}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <Book className="h-5 w-5 text-blue-400" />
                        <span className="font-semibold text-white">Category:</span>
                        <span className="capitalize">{batch.category}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <Users className="h-5 w-5 text-purple-400" />
                        <span className="font-semibold text-white">Classes:</span>
                        <span>{batch.classes?.join(", ")}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-gray-300">
                        <Clock className="h-5 w-5 text-yellow-400 mt-1" />
                        <div>
                            <span className="font-semibold text-white block">Schedule:</span>
                            <p className="text-sm mt-1">{batch.schedule || "No schedule details available."}</p>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold text-white block mb-2">Subjects:</span>
                        <div className="flex flex-wrap gap-2">
                            {batch.subjects?.map((subj, i) => (
                                <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300 border border-white/10">
                                    {subj.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <span className="font-semibold text-white block mb-2">Description:</span>
                <p className="text-gray-400 text-sm bg-black/20 p-4 rounded-lg">
                    {batch.description || "No description provided."}
                </p>
            </div>
        </div>
    )
}
