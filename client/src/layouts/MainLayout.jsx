import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatBot from '../components/ChatBot'

export default function MainLayout() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="main-layout">
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Outlet />
      </main>
      <Footer />
      <ChatBot
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}
