"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, Users, Star, Link as LinkIcon, Info, Phone, MapPin, Search, Award } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  time: string
}

interface Plug {
  id: number
  name: string
  region: string
  votes: number
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
        className="bg-[#1c1c1e] w-full max-w-[420px] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-3xl leading-none text-white/60 hover:text-white">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

function Toast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#2a2a2e] text-white px-6 py-2.5 rounded-full text-sm shadow-xl z-[60]">
      {message}
    </div>
  )
}

export default function Pub2FranceWithVoting() {
  const [view, setView] = useState<'menu' | 'chat'>('menu')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bienvenue sur PUB2FRANCE !", isBot: true, time: "17:53" },
  ])
  const [input, setInput] = useState("")
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // === FAVORIS ===
  const [favorites, setFavorites] = useState<number[]>([])

  // === VOTES (nouveau) ===
  const [votes, setVotes] = useState<Record<number, number>>({})

  // Charger favoris + votes depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pub2france_favorites')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

    const savedVotes = localStorage.getItem('pub2france_votes')
    if (savedVotes) setVotes(JSON.parse(savedVotes))
  }, [])

  // Sauvegarder les votes
  const saveVotes = (newVotes: Record<number, number>) => {
    setVotes(newVotes)
    localStorage.setItem('pub2france_votes', JSON.stringify(newVotes))
  }

  // Voter pour un plug
  const voteForPlug = (plugId: number, plugName: string) => {
    const newVotes = { ...votes }
    newVotes[plugId] = (newVotes[plugId] || 0) + 1
    
    saveVotes(newVotes)
    
    setToast(`+1 vote pour ${plugName} !`)
    setTimeout(() => setToast(""), 1800)
  }

  // Liste des plugs avec votes dynamiques
  const plugs: Plug[] = [
    { id: 1, name: "Côté Quartier studio", region: "Île-de-France", votes: votes[1] || 0 },
    { id: 2, name: "La PEUFRA", region: "Grand Est", votes: votes[2] || 0 },
    { id: 3, name: "Plug Bordeaux Centre", region: "Nouvelle-Aquitaine", votes: votes[3] || 0 },
    { id: 4, name: "Plug Toulouse Sud", region: "Occitanie", votes: votes[4] || 0 },
  ]

  // === FAVORIS (même logique que avant) ===
  const toggleFavorite = (plugId: number, plugName: string) => {
    let newFavorites: number[]
    let message = ""

    if (favorites.includes(plugId)) {
      newFavorites = favorites.filter(id => id !== plugId)
      message = `${plugName} retiré des favoris`
    } else {
      newFavorites = [...favorites, plugId]
      message = `${plugName} ajouté aux favoris ⭐`
    }

    setFavorites(newFavorites)
    localStorage.setItem('pub2france_favorites', JSON.stringify(newFavorites))
    setToast(message)
    setTimeout(() => setToast(""), 1800)
  }

  const isFavorite = (plugId: number) => favorites.includes(plugId)

  // Recherche
  const filteredPlugs = plugs.filter(plug =>
    plug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plug.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (modal: string) => {
    setActiveModal(modal)
    if (modal !== 'search') setSearchTerm("")
  }
  const closeModal = () => {
    setActiveModal(null)
    setSearchTerm("")
  }

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
    { icon: <Search className="w-5 h-5" />, label: "Rechercher", modal: "search" },
    { icon: <Trophy className="w-5 h-5" />, label: "Classement", modal: "classement" },
    { icon: <Star className="w-5 h-5" />, label: `Mes favoris (${favorites.length})`, modal: "favoris" },
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
        {view === 'chat' && <button onClick={() => setView('menu')}><ArrowLeft /></button>}
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

      <Toast message={toast} show={!!toast} />

      {/* ==================== MODALES ==================== */}

      {/* Certificats */}
      <Modal isOpen={activeModal === 'certificats'} onClose={closeModal} title="Certificats">
        <div className="space-y-3">
          {plugs.map(plug => (
            <div key={plug.id} className="bg-[#252528] p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="font-medium">{plug.name}</div>
                <div className="text-xs text-white/60">{plug.region} • {plug.votes} votes</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => voteForPlug(plug.id, plug.name)} className="bg-[#3e6757] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" /> Voter
                </button>
                <button onClick={() => toggleFavorite(plug.id, plug.name)}>
                  <Star className={`w-5 h-5 ${isFavorite(plug.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/50'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Classement */}
      <Modal isOpen={activeModal === 'classement'} onClose={closeModal} title="Classement">
        <div className="space-y-2">
          {plugs.sort((a, b) => b.votes - a.votes).map((plug, index) => (
            <div key={plug.id} className="bg-[#252528] p-3.5 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg w-6">{index + 1}</span>
                <span>{plug.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">{plug.votes} votes</span>
                <button onClick={() => voteForPlug(plug.id, plug.name)} className="bg-[#3e6757] px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> +1
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Recherche */}
      <Modal isOpen={activeModal === 'search'} onClose={closeModal} title="Rechercher">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher un plug ou une région..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#252528] pl-11 pr-4 py-3 rounded-2xl text-sm outline-none placeholder:text-white/40"
            />
          </div>
        </div>
        <div className="space-y-2">
          {filteredPlugs.length > 0 ? (
            filteredPlugs.map(plug => (
              <div key={plug.id} className="bg-[#252528] p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-medium">{plug.name}</div>
                  <div className="text-xs text-white/60">{plug.region} • {plug.votes} votes</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => voteForPlug(plug.id, plug.name)} className="bg-[#3e6757] px-3 py-1 rounded-full text-sm">Voter</button>
                  <button onClick={() => toggleFavorite(plug.id, plug.name)}>
                    <Star className={`w-5 h-5 ${isFavorite(plug.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/50'}`} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-white/50">Aucun résultat</div>
          )}
        </div>
      </Modal>

      {/* Mes Favoris */}
      <Modal isOpen={activeModal === 'favoris'} onClose={closeModal} title="Mes Favoris">
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-white/60">⭐ Tu n'as pas encore de favoris</div>
        ) : (
          <div className="space-y-2">
            {plugs.filter(p => favorites.includes(p.id)).map(plug => (
              <div key={plug.id} className="bg-[#252528] p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <div>{plug.name}</div>
                  <div className="text-xs text-white/60">{plug.region} • {plug.votes} votes</div>
                </div>
                <button onClick={() => toggleFavorite(plug.id, plug.name)} className="text-red-400 text-sm">Retirer</button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Liens */}
      <Modal isOpen={activeModal === 'liens'} onClose={closeModal} title="Liens Officiels">
        <div className="space-y-3 text-sm">
          <div>🔴 Scam Alert</div>
          <div>🌍 Actu Monde</div>
          <div>💬 Chat</div>
          <div>📋 Certificats</div>
          <div>📷 Instagram</div>
        </div>
      </Modal>

      {/* Infos */}
      <Modal isOpen={activeModal === 'infos'} onClose={closeModal} title="Infos">
        <div className="space-y-2 text-sm">
          <p>Équipe spécialisée charbons</p>
          <p>Qualité • Référence</p>
          <p className="text-red-400 mt-3">⚠️ Attention aux scams</p>
        </div>
      </Modal>

      {/* Profil */}
      <Modal isOpen={activeModal === 'profil'} onClose={closeModal} title="Mon Profil">
        <div className="space-y-3 text-sm">
          <div>🆔 ID: 870325...</div>
          <div>📍 Nouvelle-Aquitaine</div>
          <div>⭐ {favorites.length} favoris</div>
          <div>🔌 0 plugs région</div>
        </div>
      </Modal>

      {/* Plugs */}
      <Modal isOpen={activeModal === 'plugs'} onClose={closeModal} title="Tous les Plugs">
        <div className="space-y-3">
          {plugs.map(plug => (
            <div key={plug.id} className="bg-[#252528] p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="font-medium">{plug.name}</div>
                <div className="text-xs text-white/60">{plug.region} • {plug.votes} votes</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => voteForPlug(plug.id, plug.name)} className="bg-[#3e6757] px-3 py-1 rounded-full text-sm">Voter</button>
                <button onClick={() => toggleFavorite(plug.id, plug.name)}>
                  <Star className={`w-5 h-5 ${isFavorite(plug.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/50'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Région */}
      <Modal isOpen={activeModal === 'region'} onClose={closeModal} title="Ma Région">
        <div>
          <p className="mb-4">Tu es actuellement en <strong>Nouvelle-Aquitaine</strong></p>
          <button className="w-full bg-[#252528] py-2.5 rounded-2xl">Changer de région</button>
        </div>
      </Modal>

      {/* Mini App */}
      <Modal isOpen={activeModal === 'miniapp'} onClose={closeModal} title="Mini App">
        <div className="text-center py-10">Mini Application en cours de développement 📱</div>
      </Modal>

      {/* Contact */}
      <Modal isOpen={activeModal === 'contact'} onClose={closeModal} title="Contact">
        <div className="space-y-3 text-sm">
          <div>📧 Contact : @tonpseudo</div>
          <div>🤖 Bot : @PUB2FRANCE_BOT</div>
        </div>
      </Modal>

    </div>
  )
}