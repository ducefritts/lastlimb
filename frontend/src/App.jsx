import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useStore } from './lib/store'
import AuthPage from './pages/AuthPage'
import PlayPage from './pages/PlayPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import StorePage from './pages/StorePage'
import SeasonPassPage from './pages/SeasonPassPage'
import TournamentsPage from './pages/TournamentsPage'
import FriendsPage from './pages/FriendsPage'
import './styles/index.css'

const NAV_ITEMS = [
  { id: 'play',        icon: '🎮', label: 'PLAY' },
  { id: 'leaderboard', icon: '🏆', label: 'RANKS' },
  { id: 'tournaments', icon: '⚔️', label: 'EVENTS' },
  { id: 'store',       icon: '🛒', label: 'STORE' },
  { id: 'season',      icon: '🎫', label: 'PASS' },
  { id: 'friends',     icon: '👥', label: 'SOCIAL' },
  { id: 'profile',     icon: '👤', label: 'PROFILE' },
]

export default function App() {
  const { user, loading, initAuth, activeTab, setActiveTab, profile } = useStore()

  useEffect(() => { initAuth() }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-center">
        <div className="text-4xl mb-4 animate-float">🪢</div>
        <div className="font-pixel text-sm" style={{ color: '#00fff5', textShadow: '0 0 20px #00fff5' }}>LASTLIMB</div>
        <div className="font-mono text-xs text-gray-600 mt-2">LOADING...</div>
      </div>
    </div>
  )

  if (!user) return <AuthPage />

  const pages = {
    play: <PlayPage />,
    leaderboard: <LeaderboardPage />,
    tournaments: <TournamentsPage />,
    store: <StorePage />,
    season: <SeasonPassPage />,
    friends: <FriendsPage />,
    profile: <ProfilePage />,
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0f0f1a', color: '#fff', border: '1px solid rgba(0,255,245,0.2)', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px' }
      }} />

      {/* Top bar */}
      <header className="border-b flex items-center justify-between px-4 py-2 sticky top-0 z-50"
        style={{ borderColor: 'rgba(0,255,245,0.15)', background: '#0a0a0f' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🪢</span>
          <span className="font-pixel text-sm" style={{ color: '#00fff5', fontSize: 11 }}>
            LAST<span style={{ color: '#ff006e' }}>LIMB</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {profile?.season_pass_active && new Date(profile.season_pass_expires_at) > new Date() && (
            <div className="font-pixel text-xs px-2 py-1 border" style={{ color: '#ffbe0b', borderColor: '#ffbe0b', fontSize: 7 }}>
              🎫 PASS ACTIVE
            </div>
          )}
          <div className="flex items-center gap-1 arcade-card px-3 py-1">
            <span className="text-sm">💎</span>
            <span className="font-pixel text-xs" style={{ color: '#00e5ff', fontSize: 9 }}>{profile?.gems || 0}</span>
          </div>
          <div className="font-mono text-xs text-gray-400">{profile?.username}</div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1 overflow-y-auto pb-20">
        {pages[activeTab]}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: '#0a0a0f', borderColor: 'rgba(0,255,245,0.15)' }}>
        <div className="flex">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className="flex-1 flex flex-col items-center py-2 px-1 transition-all"
              style={{
                color: activeTab === item.id ? '#00fff5' : 'rgba(255,255,255,0.3)',
                borderTop: activeTab === item.id ? '2px solid #00fff5' : '2px solid transparent',
              }}>
              <span className="text-lg mb-0.5">{item.icon}</span>
              <span className="font-pixel" style={{ fontSize: 6 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
