import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function FriendsPage() {
  const { getApiHeaders, user } = useStore()
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('friends')

  const loadFriends = async () => {
    try {
      const headers = await getApiHeaders()
      const [fr, rq] = await Promise.all([
        fetch(`${API}/api/social/friends`, { headers }).then(r => r.json()),
        fetch(`${API}/api/social/requests`, { headers }).then(r => r.json()),
      ])
      setFriends(fr); setRequests(rq)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { loadFriends() }, [])

  const searchUsers = async () => {
    if (!search.trim()) return
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/social/search?q=${encodeURIComponent(search)}`, { headers })
      setSearchResults(await res.json())
    } catch { toast.error('Search failed') }
  }

  const sendRequest = async (id) => {
    try {
      const headers = await getApiHeaders()
      await fetch(`${API}/api/social/friend-request`, { method: 'POST', headers, body: JSON.stringify({ targetId: id }) })
      toast.success('Friend request sent!')
      setSearchResults(r => r.map(u => u.id === id ? { ...u, requestSent: true } : u))
    } catch { toast.error('Failed to send request') }
  }

  const respond = async (id, accept) => {
    try {
      const headers = await getApiHeaders()
      await fetch(`${API}/api/social/respond`, { method: 'POST', headers, body: JSON.stringify({ requestId: id, accept }) })
      toast.success(accept ? 'Friend added!' : 'Request declined')
      await loadFriends()
    } catch { toast.error('Failed') }
  }

  const tabs = [
    { id: 'friends', label: `FRIENDS ${friends.length > 0 ? `(${friends.length})` : ''}` },
    { id: 'requests', label: `REQUESTS ${requests.length > 0 ? `(${requests.length})` : ''}` },
    { id: 'search', label: 'ADD FRIENDS' },
  ]

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="fn-heading text-3xl text-white mb-5">SOCIAL</div>

      <div className="flex border-b mb-5" style={{ borderColor: 'rgba(192,200,216,0.1)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`fn-tab ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'friends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? <div className="text-center py-10" style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow Condensed', letterSpacing: 2 }}>LOADING...</div>
          : friends.length === 0 ? (
            <div className="fn-card p-10 text-center" style={{ borderRadius: 4 }}>
              <div className="fn-heading text-xl mb-2" style={{ color: 'rgba(192,200,216,0.2)' }}>NO FRIENDS YET</div>
              <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 14 }}>Search for players to add them!</div>
            </div>
          ) : friends.map(f => (
            <div key={f.id} className="fn-card flex items-center gap-3 px-4 py-3" style={{ borderRadius: 3 }}>
              <div className="fn-card flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {f.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, color: 'white' }}>{f.username}</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>LEVEL {f.level}</div>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 13, color: '#00e676' }}>W: {f.wins}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {requests.length === 0 ? (
            <div className="fn-card p-10 text-center" style={{ borderRadius: 4 }}>
              <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 14 }}>No pending requests</div>
            </div>
          ) : requests.map(r => (
            <div key={r.id} className="fn-card flex items-center gap-3 px-4 py-3" style={{ borderRadius: 3 }}>
              <div className="fn-card flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {r.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, color: 'white' }}>{r.username}</div>
              <div className="flex gap-2">
                <button onClick={() => respond(r.id, true)} className="fn-btn fn-btn-blue" style={{ fontSize: 12, padding: '8px 16px' }}>ACCEPT</button>
                <button onClick={() => respond(r.id, false)} className="fn-btn fn-btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>DECLINE</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'search' && (
        <div>
          <div className="flex gap-3 mb-5">
            <input className="fn-input" placeholder="Search by username..." value={search}
              onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchUsers()} />
            <button onClick={searchUsers} className="fn-btn fn-btn-blue" style={{ fontSize: 13, padding: '10px 20px', flexShrink: 0 }}>SEARCH</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {searchResults.filter(r => r.id !== user?.id).map(r => (
              <div key={r.id} className="fn-card flex items-center gap-3 px-4 py-3" style={{ borderRadius: 3 }}>
                <div className="fn-card flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {r.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, color: 'white' }}>{r.username}</div>
                <button onClick={() => sendRequest(r.id)} disabled={r.requestSent}
                  className="fn-btn fn-btn-outline" style={{ fontSize: 12, padding: '8px 16px', opacity: r.requestSent ? 0.5 : 1 }}>
                  {r.requestSent ? 'SENT' : 'ADD'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
