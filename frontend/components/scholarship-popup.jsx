"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

export default function ScholarshipPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Delay popup for better UX
        const timer = setTimeout(() => {
            setIsOpen(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[90vw] md:max-w-[500px] p-0 overflow-hidden bg-transparent border-none">
                <DialogTitle className="sr-only">SAMARTH Scholarship Test</DialogTitle>
                <div className="relative group overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                    {/* Close Button Override */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all border border-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Flyer Image */}
                    <div className="relative aspect-[3/4] w-full">
                        <Image
                            src="/scholarship-flyer.jpg"
                            alt="SAMARTH Scholarship Test"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* CTA Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col items-center space-y-4">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-green-400">SAMARTH Scholarship Test</h3>
                            <p className="text-sm text-gray-200">Upto 100% Tuition Fee Waiver!</p>
                        </div>
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold text-lg py-6 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            <Link href="/scholarship" onClick={() => setIsOpen(false)}>
                                REGISTER NOW FOR FREE !
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
