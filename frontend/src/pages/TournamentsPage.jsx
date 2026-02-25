import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function TournamentsPage() {
  const { getApiHeaders, user } = useStore()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/tournaments`)
      .then(r => r.json())
      .then(data => { setTournaments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const join = async (id) => {
    setJoining(id)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/tournaments/${id}/join`, { method: 'POST', headers })
      const data = await res.json()
      if (data.success) { toast.success('Joined tournament!'); setTournaments(t => t.map(x => x.id === id ? { ...x, joined: true } : x)) }
      else throw new Error(data.error)
    } catch (e) { toast.error(e.message || 'Failed to join') }
    finally { setJoining(null) }
  }

  const statusColor = (s) => s === 'active' ? '#00e676' : s === 'upcoming' ? '#ffd740' : 'rgba(192,200,216,0.3)'
  const statusLabel = (s) => s === 'active' ? 'LIVE' : s === 'upcoming' ? 'UPCOMING' : 'ENDED'

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="fn-heading text-3xl text-white">EVENTS</div>
        <div style={{ color: 'rgba(192,200,216,0.4)', fontFamily: 'Barlow', fontSize: 14, marginTop: 2 }}>Compete for exclusive rewards</div>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow Condensed', letterSpacing: 2 }}>LOADING...</div>
      ) : tournaments.length === 0 ? (
        <div className="fn-card p-12 text-center" style={{ borderRadius: 4 }}>
          <div className="fn-heading text-2xl mb-2" style={{ color: 'rgba(192,200,216,0.2)' }}>NO EVENTS</div>
          <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 14 }}>Check back soon for upcoming tournaments!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tournaments.map(t => (
            <div key={t.id} className="fn-card p-5" style={{ borderRadius: 4, ...(t.status === 'active' ? { borderColor: '#00e676', boxShadow: '0 0 20px rgba(0,230,118,0.05)' } : {}) }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="fn-heading text-xl text-white">{t.name}</div>
                    <div className="fn-badge" style={{ color: statusColor(t.status), background: `${statusColor(t.status)}18`, border: `1px solid ${statusColor(t.status)}44` }}>
                      {statusLabel(t.status)}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(192,200,216,0.5)', fontFamily: 'Barlow', fontSize: 13, marginBottom: 12 }}>{t.description}</div>
                  <div className="flex gap-4 flex-wrap">
                    <div style={{ fontFamily: 'Barlow Condensed', fontSize: 13 }}>
                      <span style={{ color: 'rgba(192,200,216,0.4)' }}>PLAYERS: </span>
                      <span style={{ color: 'white', fontWeight: 700 }}>{t.participant_count || 0}</span>
                    </div>
                    {t.prize_pool && (
                      <div style={{ fontFamily: 'Barlow Condensed', fontSize: 13 }}>
                        <span style={{ color: 'rgba(192,200,216,0.4)' }}>PRIZE: </span>
                        <span style={{ color: '#ffd740', fontWeight: 700 }}>💎 {t.prize_pool}</span>
                      </div>
                    )}
                  </div>
                </div>
                {t.status !== 'ended' && !t.joined && (
                  <button onClick={() => join(t.id)} disabled={joining === t.id}
                    className="fn-btn fn-btn-blue flex-shrink-0" style={{ fontSize: 13, padding: '10px 20px' }}>
                    {joining === t.id ? '...' : 'JOIN'}
                  </button>
                )}
                {t.joined && (
                  <div className="fn-badge" style={{ color: '#00e676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', flexShrink: 0 }}>
                    JOINED ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
