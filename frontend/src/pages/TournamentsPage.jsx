import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function TournamentsPage() {
  const { getApiHeaders, profile } = useStore()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/tournaments`)
      .then(r => r.json())
      .then(data => { setTournaments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const joinTournament = async (tournament) => {
    if ((profile?.gems || 0) < tournament.entry_fee) {
      return toast.error(`Need ${tournament.entry_fee} gems to enter!`)
    }
    setJoining(tournament.id)
    const headers = await getApiHeaders()
    const res = await fetch(`${API}/api/tournaments/${tournament.id}/join`, { method: 'POST', headers })
    const data = await res.json()
    if (data.success) {
      toast.success('Entered tournament!')
      setTournaments(t => t.map(tt => tt.id === tournament.id
        ? { ...tt, current_players: tt.current_players + 1 } : tt))
    } else {
      toast.error(data.error || 'Failed to join')
    }
    setJoining(null)
  }

  const formatDate = (d) => {
    if (!d) return 'TBD'
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">⚔️</div>
        <h1 className="font-pixel text-xl" style={{ color: '#ff006e' }}>TOURNAMENTS</h1>
        <p className="font-mono text-xs text-gray-500 mt-1">Compete for glory and gems</p>
      </div>

      {loading ? (
        <div className="text-center font-pixel text-xs text-gray-500">LOADING...</div>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => (
            <div key={t.id} className="arcade-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-pixel text-sm text-white">{t.name}</h3>
                    <span className={`font-pixel px-2 py-0.5 text-xs ${
                      t.status === 'open' ? 'text-green-400 border border-green-700' :
                      t.status === 'active' ? 'text-yellow-400 border border-yellow-700' : 'text-gray-500'
                    }`} style={{ fontSize: 7 }}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-gray-400">Starts: {formatDate(t.starts_at)}</div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-xs" style={{ color: '#00e5ff', fontSize: 9 }}>
                    💎 {t.prize_gems} PRIZE
                  </div>
                  <div className="font-mono text-xs text-gray-500 mt-1">Entry: {t.entry_fee} gems</div>
                </div>
              </div>

              {/* Player count */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                  <span>Players</span>
                  <span>{t.current_players}/{t.max_players}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${(t.current_players / t.max_players) * 100}%`,
                    background: 'linear-gradient(90deg, #ff006e, #8338ec)'
                  }} />
                </div>
              </div>

              {/* Player slots */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.max_players }).map((_, i) => (
                  <div key={i} className={`flex-1 h-2 ${i < t.current_players ? 'bg-pink-600' : 'bg-gray-800'}`} />
                ))}
              </div>

              {t.status === 'open' && (
                <button onClick={() => joinTournament(t)} disabled={joining === t.id}
                  className="btn-pixel btn-pink w-full" style={{ fontSize: 9 }}>
                  {joining === t.id ? 'JOINING...' : `⚔️ JOIN TOURNAMENT · 💎 ${t.entry_fee}`}
                </button>
              )}
              {t.status === 'active' && (
                <div className="text-center font-pixel text-xs" style={{ color: '#ffbe0b', fontSize: 8 }}>
                  🔴 TOURNAMENT IN PROGRESS
                </div>
              )}
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="text-center py-12 arcade-card p-8">
              <div className="text-5xl mb-4">⚔️</div>
              <div className="font-pixel text-xs text-gray-500 mb-2">NO ACTIVE TOURNAMENTS</div>
              <div className="font-mono text-xs text-gray-700">Check back soon for new tournaments!</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
