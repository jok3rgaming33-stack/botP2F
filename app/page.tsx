"use client"

import { useState } from 'react'

export default function Pub2FranceBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bienvenue sur PUB2FRANCE !", isBot: true },
    { id: 2, text: "Comment puis-je t'aider aujourd'hui ?", isBot: true },
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      isBot: false
    }])

    setInput("")

    // Réponse automatique du bot
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Merci pour ton message. Un agent va te répondre rapidement.",
        isBot: true
      }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#111] p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-[#3e6757] flex items-center justify-center font-bold">
          P2F
        </div>
        <div>
          <div className="font-semibold">PUB2FRANCE</div>
          <div className="text-xs text-emerald-400">En ligne</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm ${
              msg.isBot ? 'bg-[#1f1f1f]' : 'bg-[#3e6757]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#111] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Écris ton message..."
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-3 text-sm outline-none"
        />
        <button 
          onClick={sendMessage}
          className="bg-[#3e6757] px-6 rounded-full font-medium"
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}