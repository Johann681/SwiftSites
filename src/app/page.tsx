"use client"
import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/home/Hero'
import Features from './components/home/Features'
import FrameWorks from './components/home/FrameWorks'

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <Features/>
      <FrameWorks/>
    </div>
  )
}

export default page