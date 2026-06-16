"use client"

import { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  time?: string
}

export default function Pub2FranceTelegram() {
  const [view, setView] = useState<'menu' | 'chat'>('menu')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bienvenue sur PUB2FRANCE !", isBot: true, time: "17:12" },
    { id: 2, text: "Comment puis-je t'aider aujourd'hui ?", isBot: true, time: "17:12" },
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    const newMsg: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMsg])
    setInput("")

    // Réponse automatique du bot
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: "Merci pour ton message. Un agent va te répondre rapidement.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botReply])
    }, 1200)
  }

  const quickReplies = ["Commander", "Statut commande", "Ma région", "Contact"]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view === 'chat' && (
            <button onClick={() => setView('menu')} className="text-white/70 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20">
              <img src="/logo.png" alt="PUB2FRANCE" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                PUB2FRANCE
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">bot</span>
              </div>
              <div className="text-xs text-emerald-400">En ligne</div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU PRINCIPAL */}
      {view === 'menu' && (
        <div className="p-4">
          {/* Section Profil */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-2xl font-bold">PUB2FRANCE</div>
                <div className="text-sm text-white/60">Nouvelle-Aquitaine • Certifié</div>
              </div>
            </div>
          </div>

          {/* Grille de boutons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              "Tous les posts", "Ma région", "Rechercher", "Classement",
              "Mes favoris", "Mon profil", "Liens", "Infos", "Mini App", "Contact"
            ].map((label, index) => (
              <button
                key={index}
                onClick={() => setView('chat')}
                className="bg-[#111] hover:bg-[#1a1a1a] active:bg-[#222] border border-white/10 rounded-2xl p-4 text-left text-sm transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT */}
      {view === 'chat' && (
        <div className="flex flex-col flex-1">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm ${
                  msg.isBot 
                    ? 'bg-[#1f1f1f] rounded-tl-none' 
                    : 'bg-[#3e6757] rounded-tr-none'
                }`}>
                  {msg.text}
                  {msg.time && (
                    <div className="text-[10px] text-white/40 mt-1 text-right">{msg.time}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-[#111]">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: reply,
                    isBot: false,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }])
                }}
                className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-xs px-4 py-2 rounded-full border border-white/10 whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-[#111] border-t border-white/10 flex gap-2">
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
              className="bg-[#3e6757] hover:bg-[#4a7a67] px-5 rounded-full flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}