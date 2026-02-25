import React, { useState, useEffect } from 'react'
import { useStore } from '../lib/store'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function FriendsPage() {
  const { getApiHeaders, profile } = useStore()
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFriends = async () => {
    const headers = await getApiHeaders()
    const res = await fetch(`${API}/api/game/friends`, { headers })
    const data = await res.json()
    setFriends(data || [])
    setLoading(false)
  }

  useEffect(() => { loadFriends() }, [])

  const searchUsers = async (q) => {
    if (q.length < 2) { setSearchResults([]); return }
    const headers = await getApiHeaders()
    const res = await fetch(`${API}/api/game/search?q=${encodeURIComponent(q)}`, { headers })
    const data = await res.json()
    setSearchResults(data)
  }

  useEffect(() => {
    const t = setTimeout(() => searchUsers(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const sendRequest = async (userId) => {
    const headers = await getApiHeaders()
    await fetch(`${API}/api/game/friends/request`, {
      method: 'POST', headers,
      body: JSON.stringify({ targetId: userId })
    })
    toast.success('Friend request sent!')
    setSearchResults(r => r.filter(u => u.id !== userId))
  }

  const acceptRequest = async (requesterId) => {
    const headers = await getApiHeaders()
    await fetch(`${API}/api/game/friends/accept`, {
      method: 'POST', headers,
      body: JSON.stringify({ requesterId })
    })
    toast.success('Friend added!')
    loadFriends()
  }

  const statusDot = (status) => (
    <div className={`w-2 h-2 rounded-full ${
      status === 'online' ? 'bg-green-400' :
      status === 'in_game' ? 'bg-yellow-400' : 'bg-gray-600'
    }`} title={status} />
  )

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">👥</div>
        <h1 className="font-pixel text-xl" style={{ color: '#8338ec' }}>FRIENDS</h1>
      </div>

      {/* Search */}
      <div className="arcade-card p-4 mb-6">
        <div className="font-pixel text-xs text-gray-400 mb-3" style={{ fontSize: 8 }}>FIND PLAYERS</div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by username..."
          className="w-full bg-black border text-white p-3 outline-none font-mono text-sm"
          style={{ borderColor: 'rgba(131,56,236,0.4)' }} />
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.filter(u => u.id !== profile?.id).map(u => (
              <div key={u.id} className="flex items-center justify-between p-2 border border-gray-800">
                <div className="flex items-center gap-2">
                  {statusDot(u.status)}
                  <span className="font-mono text-sm">{u.username}</span>
                  <span className="font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>LVL {u.level}</span>
                </div>
                <button onClick={() => sendRequest(u.id)} className="btn-pixel btn-purple" style={{ fontSize: 8, padding: '6px 10px', color: '#8338ec', borderColor: '#8338ec' }}>
                  + ADD
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends list */}
      <div className="arcade-card p-4">
        <div className="font-pixel text-xs text-gray-400 mb-3" style={{ fontSize: 8 }}>
          FRIENDS ({friends.length})
        </div>
        {loading ? (
          <div className="text-xs text-gray-600 font-mono">Loading...</div>
        ) : friends.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🤝</div>
            <div className="font-mono text-xs text-gray-600">No friends yet. Search for players above!</div>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map(f => {
              const friend = f.requester_id === profile?.id ? f.addressee : f.requester
              return (
                <div key={f.id} className="flex items-center justify-between p-3 border border-gray-800 hover:border-purple-800 transition-all">
                  <div className="flex items-center gap-3">
                    {statusDot(friend?.status)}
                    <div>
                      <div className="font-mono text-sm text-white">{friend?.username}</div>
                      <div className="font-pixel text-xs mt-0.5" style={{
                        color: friend?.status === 'online' ? '#06d6a0' :
                               friend?.status === 'in_game' ? '#ffbe0b' : '#555',
                        fontSize: 7
                      }}>
                        {friend?.status === 'in_game' ? '🎮 IN GAME' :
                         friend?.status === 'online' ? '🟢 ONLINE' : '⬜ OFFLINE'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {friend?.status === 'online' && (
                      <button className="btn-pixel" style={{ fontSize: 7, padding: '5px 8px', color: '#00fff5', borderColor: '#00fff5' }}>
                        INVITE
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
