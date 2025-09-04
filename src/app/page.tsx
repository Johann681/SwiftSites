"use client"
import React, { Suspense } from "react"
import Navbar from "./components/Navbar"
import dynamic from "next/dynamic"

const Hero = dynamic(() => import("./components/home/Hero"), { ssr: false })
const Features = dynamic(() => import("./components/home/Features"), { ssr: false })
const FrameWorks = dynamic(() => import("./components/home/FrameWorks"), { ssr: false })

const Page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <FrameWorks />
      </Suspense>
    </div>
  )
}

export default Page
 