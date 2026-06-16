"use client"

import { useState } from 'react'
import { ArrowLeft, Trophy, Users, MapPin, Star, Settings, Link, Info, Phone } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  time: string
}

export default function Pub2FranceBot() {
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

    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: "Merci pour ton message. Un agent va te répondre rapidement.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botReply])
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col max-w-[420px] mx-auto border-x border-white/10">
      
      {/* HEADER */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          {view === 'chat' && (
            <button onClick={() => setView('menu')} className="mr-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <img src="/logo.png" alt="PUB2FRANCE" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-1.5">
                PUB2FRANCE 
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">bot</span>
              </div>
              <div className="text-[10px] text-emerald-400">En ligne</div>
            </div>
          </div>
        </div>
        <div className="text-xl">⋯</div>
      </div>

      {/* MENU VIEW */}
      {view === 'menu' && (
        <div className="flex-1 overflow-y-auto">
          {/* Grande image circulaire */}
          <div className="px-4 pt-4">
            <div className="w-full aspect-square rounded-3xl overflow-hidden border border-white/10">
              <img 
                src="/logo.png" 
                alt="PUB2FRANCE" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Profil */}
          <div className="px-4 py-4 bg-[#1c1c1e] mt-3 mx-3 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-xl">🌍</div>
              <div>
                <div className="font-medium">PUB2FRANCE</div>
                <div className="text-sm text-white/60">Nouvelle-Aquitaine</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> <span>89</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> <span>2</span>
              </div>
            </div>

            <button 
              onClick={() => setView('chat')}
              className="w-full bg-[#2a2a2e] hover:bg-[#3a3a3e] py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Trophy className="w-4 h-4" /> Voir les certificats
            </button>
          </div>

          {/* Grille de boutons */}
          <div className="grid grid-cols-2 gap-2 p-3">
            {[
              { icon: "📢", label: "Tous les posts" },
              { icon: "📍", label: "Ma région" },
              { icon: "🔍", label: "Rechercher" },
              { icon: "🏆", label: "Classement" },
              { icon: "⭐", label: "Mes favoris" },
              { icon: "👤", label: "Mon profil" },
              { icon: "🔗", label: "Liens" },
              { icon: "ℹ️", label: "Infos" },
              { icon: "📱", label: "Mini App" },
              { icon: "📞", label: "Contact" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setView('chat')}
                className="bg-[#1c1c1e] hover:bg-[#2a2a2e] rounded-2xl p-4 flex items-center gap-3 text-left text-sm border border-white/5"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT VIEW */}
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
                  <div className="text-[10px] text-white/40 mt-1 text-right">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-[#1c1c1e] border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message"
              className="flex-1 bg-[#2a2a2e] border border-white/10 rounded-full px-5 py-3 text-sm outline-none"
            />
            <button 
              onClick={sendMessage}
              className="bg-[#3e6757] px-5 rounded-full flex items-center justify-center"
            >
              <span className="text-xl">↑</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}