"use client"

import dynamic from "next/dynamic"
import AboutHero from "@/components/about-hero"

const WhySujhav = dynamic(() => import("@/components/why-sujhav"), {
    loading: () => <div className="h-96 bg-black" />,
})
const WhatWeThink = dynamic(() => import("@/components/what-we-think"), {
    loading: () => <div className="h-96 bg-black" />,
})
const SujhavSolution = dynamic(() => import("@/components/sujhav-solution"), {
    loading: () => <div className="h-96 bg-black" />,
})
const LogoSignificance = dynamic(() => import("@/components/logo-significance"), {
    loading: () => <div className="h-96 bg-black" />,
})
const Footer = dynamic(() => import("@/components/footer"), {
    loading: () => <div className="h-20 bg-black" />,
})

export default function AboutContent() {
    return (
        <>
            <AboutHero />
            <WhySujhav />
            <WhatWeThink />
            <SujhavSolution />
            <LogoSignificance />
            <Footer />
        </>
    )
}
