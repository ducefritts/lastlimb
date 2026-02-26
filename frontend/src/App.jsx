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
import LobbyPage from './pages/LobbyPage'
import LockerPage from './pages/LockerPage'
import PracticePage from './pages/PracticePage'
import './styles/index.css'

const NAV_ITEMS = [
  { id: 'lobby',       icon: '🏠', label: 'LOBBY' },
  { id: 'leaderboard', icon: '🏆', label: 'RANKS' },
  { id: 'store',       icon: '🛒', label: 'STORE' },
  { id: 'season',      icon: '🎫', label: 'PASS' },
  { id: 'friends',     icon: '👥', label: 'SOCIAL' },
  { id: 'profile',     icon: '👤', label: 'PROFILE' },
]

export default function App() {
  const { user, loading, initAuth, activeTab, setActiveTab, profile } = useStore()

  useEffect(() => { initAuth() }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080c16' }}>
      <div className="text-center">
        <div className="fn-heading text-5xl mb-3" style={{ color: 'white' }}>
          LAST<span style={{ color: '#00a8ff' }}>LIMB</span>
        </div>
        <div style={{ color: 'rgba(192,200,216,0.4)', fontFamily: 'Barlow Condensed', letterSpacing: 3, fontSize: 12 }}>LOADING...</div>
      </div>
    </div>
  )

  if (!user) return <AuthPage />

  const pages = {
    lobby:       <LobbyPage />,
    locker:      <LockerPage />,
    practice:    <PracticePage />,
    play:        <PlayPage />,
    leaderboard: <LeaderboardPage />,
    store:       <StorePage />,
    season:      <SeasonPassPage />,
    friends:     <FriendsPage />,
    profile:     <ProfilePage />,
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#161d2e', color: '#fff', border: '1px solid rgba(0,168,255,0.2)', fontFamily: 'Barlow, sans-serif', fontSize: '13px', borderRadius: '3px' }
      }} />

      <header className="flex items-center justify-between px-5 py-3 sticky top-0 z-50"
        style={{ background: 'rgba(8,12,22,0.95)', borderBottom: '1px solid rgba(192,200,216,0.08)', backdropFilter: 'blur(10px)' }}>
        <div className="fn-heading text-2xl cursor-pointer" onClick={() => setActiveTab('lobby')}
          style={{ color: 'white', fontSize: 22 }}>
          LAST<span style={{ color: '#00a8ff' }}>LIMB</span>
        </div>
        <div className="flex items-center gap-4">
          {profile?.season_pass_active && new Date(profile.season_pass_expires_at) > new Date() && (
            <div className="fn-badge" style={{ background: 'rgba(255,215,64,0.15)', color: '#ffd740', border: '1px solid rgba(255,215,64,0.3)' }}>
              PASS ACTIVE
            </div>
          )}
          <div className="flex items-center gap-2 fn-card px-3 py-1.5" style={{ borderRadius: 3 }}>
            <span style={{ fontSize: 14 }}>💎</span>
            <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, color: '#00c8ff', fontSize: 15 }}>{profile?.gems || 0}</span>
          </div>
          <div style={{ color: 'rgba(192,200,216,0.6)', fontFamily: 'Barlow Condensed', fontWeight: 600, fontSize: 13, letterSpacing: 1 }}>
            {profile?.username}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {pages[activeTab] || pages.lobby}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50"
        style={{ background: 'rgba(8,12,22,0.97)', borderTop: '1px solid rgba(192,200,216,0.08)', backdropFilter: 'blur(10px)' }}>
        <div className="flex max-w-lg mx-auto">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`fn-nav-btn flex-1 ${activeTab === item.id ? 'active' : ''}`}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
