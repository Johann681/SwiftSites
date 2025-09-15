"use client"

import TemplateSection from "../components/TemplateSection"    
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function TemplatePage  () {
  return (
    <div>
      <Navbar />
    
        <TemplateSection />
    
      <Footer />
    </div>
  )
}