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

  const rankColor = (rank) => {
    if (rank === 1) return '#ffbe0b'
    if (rank === 2) return '#aaaaaa'
    if (rank === 3) return '#cd7f32'
    return '#555'
  }
  const rankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🏆</div>
        <h1 className="font-pixel text-xl" style={{ color: '#ffbe0b' }}>LEADERBOARD</h1>
        <p className="font-mono text-xs text-gray-500 mt-1">Top players ranked by XP</p>
      </div>

      {loading ? (
        <div className="text-center font-pixel text-xs text-gray-500">LOADING...</div>
      ) : (
        <div className="space-y-2">
          {/* Column headers */}
          <div className="flex items-center gap-3 px-4 pb-2 border-b border-gray-800">
            <div className="w-10 font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>RANK</div>
            <div className="flex-1 font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>PLAYER</div>
            <div className="w-16 text-right font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>WINS</div>
            <div className="w-16 text-right font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>W/R %</div>
            <div className="w-16 text-right font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>XP</div>
          </div>

          {leaderboard.map((player, i) => (
            <div key={player.id} className={`arcade-card flex items-center gap-3 p-4 transition-all ${
              player.id === user?.id ? 'border-cyan-600' : ''
            }`} style={player.id === user?.id ? { boxShadow: '0 0 10px rgba(0,255,245,0.2)' } : {}}>
              
              {/* Rank */}
              <div className="w-10 text-center">
                {player.rank <= 3 ? (
                  <span className="text-xl">{rankIcon(player.rank)}</span>
                ) : (
                  <span className="font-pixel text-xs" style={{ color: rankColor(player.rank), fontSize: 8 }}>
                    #{player.rank}
                  </span>
                )}
              </div>

              {/* Player info */}
              <div className="flex-1 flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">
                      {player.username}
                      {player.id === user?.id && <span className="text-xs text-gray-500 ml-2">(you)</span>}
                    </span>
                  </div>
                  <div className="font-pixel text-xs text-gray-600 mt-0.5" style={{ fontSize: 7 }}>
                    LVL {player.level}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="w-16 text-right">
                <span className="font-pixel text-xs" style={{ color: '#06d6a0', fontSize: 9 }}>{player.wins}</span>
              </div>
              <div className="w-16 text-right">
                <span className="font-pixel text-xs" style={{ color: '#ffbe0b', fontSize: 9 }}>{player.win_rate}%</span>
              </div>
              <div className="w-16 text-right">
                <span className="font-pixel text-xs" style={{ color: '#8338ec', fontSize: 9 }}>{player.xp?.toLocaleString()}</span>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <div className="font-pixel text-xs text-gray-600">NO PLAYERS YET</div>
              <div className="font-mono text-xs text-gray-700 mt-2">Play some games to appear here!</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
