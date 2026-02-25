import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function LeaderboardPage() {
  const { user } = useStore()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/game/leaderboard`)
      .then(r => r.json())
      .then(data => { setLeaderboard(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const rankMedal = (rank) => {
    if (rank === 1) return { icon: '🥇', color: '#ffd740' }
    if (rank === 2) return { icon: '🥈', color: '#c0c8d8' }
    if (rank === 3) return { icon: '🥉', color: '#cd7f32' }
    return { icon: `#${rank}`, color: 'rgba(192,200,216,0.3)' }
  }

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="fn-heading text-3xl text-white">LEADERBOARD</div>
        <div style={{ color: 'rgba(192,200,216,0.4)', fontFamily: 'Barlow', fontSize: 14, marginTop: 2 }}>Top players ranked by XP</div>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow Condensed', letterSpacing: 2 }}>LOADING...</div>
      ) : (
        <div>
          {/* Header row */}
          <div className="flex items-center gap-3 px-4 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(192,200,216,0.08)' }}>
            <div style={{ width: 48, fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>RANK</div>
            <div style={{ flex: 1, fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>PLAYER</div>
            <div style={{ width: 56, textAlign: 'right', fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>WINS</div>
            <div style={{ width: 56, textAlign: 'right', fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>W/R</div>
            <div style={{ width: 64, textAlign: 'right', fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>XP</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {leaderboard.map((player) => {
              const medal = rankMedal(player.rank)
              const isMe = player.id === user?.id
              return (
                <div key={player.id} className="fn-card flex items-center gap-3 px-4 py-3"
                  style={{ borderRadius: 3, ...(isMe ? { borderColor: '#00a8ff', boxShadow: '0 0 12px rgba(0,168,255,0.1)' } : {}) }}>
                  <div style={{ width: 48, textAlign: 'center' }}>
                    {player.rank <= 3
                      ? <span style={{ fontSize: 20 }}>{medal.icon}</span>
                      : <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: medal.color }}>{medal.icon}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, color: isMe ? '#00a8ff' : 'white' }}>
                      {player.username}
                      {isMe && <span style={{ fontSize: 11, color: 'rgba(0,168,255,0.6)', marginLeft: 8, fontWeight: 400 }}>YOU</span>}
                    </div>
                    <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 1 }}>LEVEL {player.level}</div>
                  </div>
                  <div style={{ width: 56, textAlign: 'right', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15, color: '#00e676' }}>{player.wins}</div>
                  <div style={{ width: 56, textAlign: 'right', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15, color: '#ffd740' }}>{player.win_rate}%</div>
                  <div style={{ width: 64, textAlign: 'right', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 15, color: '#ce93d8' }}>{player.xp?.toLocaleString()}</div>
                </div>
              )
            })}
            {leaderboard.length === 0 && (
              <div className="text-center py-20">
                <div className="fn-heading text-xl mb-2" style={{ color: 'rgba(192,200,216,0.2)' }}>NO PLAYERS YET</div>
                <div style={{ color: 'rgba(192,200,216,0.2)', fontFamily: 'Barlow', fontSize: 14 }}>Play some games to appear here!</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
