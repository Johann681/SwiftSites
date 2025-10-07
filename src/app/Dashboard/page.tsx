"use client"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AiAssistant from "../components/AiAssistant"
import AiDashboard from "../components/Dashboard"
export default function AiPage() {
  return (
    <div>
      <Navbar />
      <AiDashboard />
      <AiAssistant />
      <Footer />
    </div>
  )
}
