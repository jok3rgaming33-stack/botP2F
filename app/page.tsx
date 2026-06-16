"use client"

import { useState } from 'react'
import { ArrowLeft, Trophy, Users, Star, Link as LinkIcon, Info, Phone, MapPin } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  time: string
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c1c1e] w-full max-w-[420px] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default function Pub2FranceFullBot() {
  const [view, setView] = useState<'menu' | 'chat'>('menu')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bienvenue sur PUB2FRANCE !", isBot: true, time: "17:30" },
  ])
  const [input, setInput] = useState("")
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modal: string) => setActiveModal(modal)
  const closeModal = () => setActiveModal(null)

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
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Merci pour ton message. Un agent va te répondre rapidement.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1000)
  }

  const menuItems = [
    { icon: <Users className="w-5 h-5" />, label: "Tous les plugs", modal: "plugs" },
    { icon: <MapPin className="w-5 h-5" />, label: "Ma région", modal: "region" },
    { icon: "🔍", label: "Rechercher", modal: "search" },
    { icon: <Trophy className="w-5 h-5" />, label: "Classement", modal: "classement" },
    { icon: <Star className="w-5 h-5" />, label: "Mes favoris", modal: "favoris" },
    { icon: "👤", label: "Mon profil", modal: "profil" },
    { icon: <LinkIcon className="w-5 h-5" />, label: "Liens", modal: "liens" },
    { icon: <Info className="w-5 h-5" />, label: "Infos", modal: "infos" },
    { icon: "📱", label: "Mini App", modal: "miniapp" },
    { icon: <Phone className="w-5 h-5" />, label: "Contact", modal: "contact" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col max-w-[420px] mx-auto">
      
      {/* Header */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center gap-3 border-b border-white/10">
        {view === 'chat' && (
          <button onClick={() => setView('menu')}><ArrowLeft /></button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
            <img src="/logo.png" alt="PUB2FRANCE" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-semibold">PUB2FRANCE <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">bot</span></div>
            <div className="text-xs text-emerald-400">En ligne</div>
          </div>
        </div>
      </div>

      {/* MENU */}
      {view === 'menu' && (
        <div className="p-4">
          <div className="mb-6">
            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden mb-4 border border-white/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>

            <div className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">PUB2FRANCE</div>
                  <div className="text-sm text-white/60">Nouvelle-Aquitaine</div>
                </div>
                <div className="text-right text-sm">
                  <div>89 membres</div>
                  <div className="flex items-center gap-1 justify-end"><Trophy className="w-4 h-4" /> 2</div>
                </div>
              </div>
            </div>

            <button onClick={() => openModal('certificats')} className="w-full bg-[#2a2a2e] py-3 rounded-2xl flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-4 h-4" /> Voir les certificats
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => item.modal ? openModal(item.modal) : setView('chat')}
                className="bg-[#1c1c1e] hover:bg-[#252528] rounded-2xl p-4 flex items-center gap-3 text-left text-sm border border-white/5"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT */}
      {view === 'chat' && (
        <div className="flex flex-col flex-1">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-3xl text-sm ${msg.isBot ? 'bg-[#1f1f1f]' : 'bg-[#3e6757]'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1c1c1e] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Message"
              className="flex-1 bg-[#2a2a2e] rounded-full px-5 py-3 text-sm outline-none"
            />
            <button onClick={sendMessage} className="bg-[#3e6757] px-6 rounded-full">↑</button>
          </div>
        </div>
      )}

      {/* MODALES */}
      <Modal isOpen={activeModal === 'certificats'} onClose={closeModal} title="Certificats">
        <div className="space-y-3">
          <div className="bg-[#2a2a2e] p-4 rounded-xl">Côté Quartier studio - Île-de-France ★1</div>
          <div className="bg-[#2a2a2e] p-4 rounded-xl">La PEUFRA - Grand Est ★1</div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'classement'} onClose={closeModal} title="Classement">
        <div className="space-y-2">
          <div className="bg-[#2a2a2e] p-3 rounded-xl">1. Côté Quartier studio - 1 vote</div>
          <div className="bg-[#2a2a2e] p-3 rounded-xl">2. La PEUFRA - 1 vote</div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'liens'} onClose={closeModal} title="Liens Officiels">
        <div className="space-y-2 text-sm">
          <div>🔴 Scam Alert</div>
          <div>🌍 Actu Monde</div>
          <div>💬 Chat</div>
          <div>📋 Certificats</div>
          <div>📷 Instagram</div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'infos'} onClose={closeModal} title="Infos">
        <div>
          <p>Équipe spécialisée charbons</p>
          <p className="mt-2">Qualité • Référence</p>
          <p className="text-red-400 mt-3">⚠️ Attention aux scams</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'profil'} onClose={closeModal} title="Mon Profil">
        <div className="space-y-2 text-sm">
          <div>🆔 ID: 870325...</div>
          <div>📍 Nouvelle-Aquitaine</div>
          <div>⭐ 0 favoris</div>
          <div>🔌 0 plugs région</div>
        </div>
      </Modal>

    </div>
  )
}