"use client"
import React, { Suspense } from "react"
import Navbar from "./components/Navbar"
import dynamic from "next/dynamic"
import Templates from "./components/home/Templates"
import LiveSection from "./components/home/LiveSection"
import Footer from "./components/Footer"


const Hero = dynamic(() => import("./components/home/Hero"), { ssr: false })
const Features = dynamic(() => import("./components/home/Features"), { ssr: false })
const FrameWorks = dynamic(() => import("./components/home/FrameWorks"), { ssr: false })
const TemplatesPreview = dynamic(() => import("./components/home/Templates"), { ssr: false })


const Page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <FrameWorks />
        <Templates />
        <LiveSection />
        <Footer />
      </Suspense>
      
    </div>
  )
}

export default Page
 