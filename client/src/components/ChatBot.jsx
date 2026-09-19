import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { queryRAG } from '../services/ragService'
import './ChatBot.css'

const SUGGESTIONS = [
  "Which vehicles do you have?",
  "Do you have buses?",
  "How can I book a bus?",
  "What tours are available?",
  "Tell me about your travel services.",
  "What information do I need for booking?",
]

export default function ChatBot({ isOpen, onClose, onOpen }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I'm the Sri Veerabhadra Travel Assistant. How can I help you today? You can ask me about our vehicles, tours, booking process, or any travel-related questions.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const response = await queryRAG(userMsg)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please contact Sri Veerabhadra Tours and Travels directly at 9542659999.",
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button className="chatbot-fab" onClick={onOpen} id="chatbot-fab" aria-label="Open AI Chat">
          <FiMessageCircle size={24} />
          <span>AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window" id="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">SV</div>
              <div>
                <h4>Sri Veerabhadra</h4>
                <span>Travel Assistant</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={onClose} aria-label="Close chat">
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" id="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.role}`}>
                <div className="chatbot-msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg assistant">
                <div className="chatbot-msg-bubble chatbot-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chatbot-suggestion" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about vehicles, tours, booking..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              id="chatbot-input"
            />
            <button type="submit" disabled={loading || !input.trim()} id="chatbot-send">
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
