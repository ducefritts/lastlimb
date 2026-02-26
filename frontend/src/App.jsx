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

function NavIcon({ id, active }) {
  const stroke = active ? '#00a8ff' : 'rgba(192,200,216,0.5)'
  const s = { fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (id === 'lobby') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <polygon points="12,3 22,11 22,21 15,21 15,15 9,15 9,21 2,21 2,11" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <rect x="9" y="15" width="6" height="6" fill={active ? 'rgba(0,168,255,0.4)' : 'rgba(192,200,216,0.15)'} stroke={stroke} strokeWidth="1.5" />
      <line x1="12" y1="3" x2="7" y2="7.5" stroke={active ? 'rgba(100,200,255,0.6)' : 'rgba(255,255,255,0.15)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  if (id === 'leaderboard') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M6 2h12v8a6 6 0 01-12 0V2z" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 4H2v3a4 4 0 004 4" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 4h4v3a4 4 0 01-4 4" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="20" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="20" x2="16" y2="20" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="12,5 13,8 16,8 13.5,10 14.5,13 12,11 9.5,13 10.5,10 8,8 11,8" fill={active ? '#00a8ff' : 'rgba(192,200,216,0.3)'} stroke="none" />
    </svg>
  )

  if (id === 'store') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M3 9l1-7h16l1 7" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3" fill="none" stroke={stroke} strokeWidth="2" />
      <rect x="3" y="12" width="18" height="9" rx="1" fill={active ? 'rgba(0,168,255,0.15)' : 'rgba(192,200,216,0.06)'} stroke={stroke} strokeWidth="2" />
      <rect x="10" y="15" width="4" height="6" fill={active ? 'rgba(0,168,255,0.4)' : 'rgba(192,200,216,0.15)'} stroke={stroke} strokeWidth="1.5" />
      <line x1="5" y1="9" x2="5" y2="7" stroke={active ? 'rgba(100,200,255,0.7)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  if (id === 'season') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="2" y="6" width="20" height="12" rx="2" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" />
      <line x1="8" y1="6" x2="8" y2="18" stroke={stroke} strokeWidth="1.5" strokeDasharray="2,2" />
      <circle cx="15" cy="12" r="3" fill={active ? 'rgba(0,168,255,0.4)' : 'rgba(192,200,216,0.2)'} stroke={stroke} strokeWidth="1.5" />
      <line x1="15" y1="7" x2="15" y2="9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="15" x2="15" y2="17" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="12" x2="12" y2="12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="12" x2="20" y2="12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="10" x2="6" y2="10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="14" x2="6" y2="14" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="8" x2="7" y2="8" stroke={active ? 'rgba(100,200,255,0.6)' : 'rgba(255,255,255,0.15)'} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )

  if (id === 'friends') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="16" cy="7" r="3" fill={active ? 'rgba(0,168,255,0.15)' : 'rgba(192,200,216,0.06)'} stroke={stroke} strokeWidth="1.8" />
      <path d="M12 21v-2a5 5 0 015-5h2a5 5 0 015 5v2" fill={active ? 'rgba(0,168,255,0.1)' : 'rgba(192,200,216,0.04)'} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="8" r="3.5" fill={active ? 'rgba(0,168,255,0.25)' : 'rgba(192,200,216,0.1)'} stroke={stroke} strokeWidth="2" />
      <path d="M2 21v-2a6 6 0 016-6h2a6 6 0 016 6v2" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 6.5 Q9 5.5 11 6.5" fill="none" stroke={active ? 'rgba(100,200,255,0.6)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )

  if (id === 'profile') return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" fill={active ? 'rgba(0,168,255,0.25)' : 'rgba(192,200,216,0.1)'} stroke={stroke} strokeWidth="2" />
      <path d="M4 21v-2a8 8 0 0116 0v2" fill={active ? 'rgba(0,168,255,0.2)' : 'rgba(192,200,216,0.08)'} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 5.5 Q12 4 14.5 5.5" fill="none" stroke={active ? 'rgba(100,200,255,0.7)' : 'rgba(255,255,255,0.25)'} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="18" x2="16" y2="18" stroke={active ? 'rgba(0,168,255,0.5)' : 'rgba(192,200,216,0.2)'} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )

  return null
}

const NAV_ITEMS = [
  { id: 'lobby',       label: 'LOBBY' },
  { id: 'leaderboard', label: 'RANKS' },
  { id: 'store',       label: 'STORE' },
  { id: 'season',      label: 'PASS' },
  { id: 'friends',     label: 'SOCIAL' },
  { id: 'profile',     label: 'PROFILE' },
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
              <NavIcon id={item.id} active={activeTab === item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
