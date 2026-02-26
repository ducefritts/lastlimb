import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, RARITY_COLORS, FONT_STYLES } from '../lib/gameData'
import toast from 'react-hot-toast'
import HangmanPixel from '../components/HangmanPixel'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ProfilePage() {
  const { profile, user, unlockedItems, getApiHeaders, loadProfile, signOut } = useStore()
  const [tab, setTab] = useState('stats')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'stats',   label: 'STATS' },
    { id: 'account', label: 'ACCOUNT' },
  ]

  const stats = [
    { label: 'Level',      value: profile?.level || 1, color: '#00a8ff' },
    { label: 'XP',         value: (profile?.xp || 0).toLocaleString(), color: '#ce93d8' },
    { label: 'Wins',       value: profile?.wins || 0, color: '#00e676' },
    { label: 'Losses',     value: profile?.losses || 0, color: '#ff5252' },
    { label: 'Win Rate',   value: `${profile?.win_rate || 0}%`, color: '#ffd740' },
    { label: 'Win Streak', value: profile?.win_streak || 0, color: '#ff9800' },
    { label: 'Gems',       value: (profile?.gems || 0).toLocaleString(), color: '#00c8ff' },
    { label: 'Items',      value: unlockedItems.length, color: '#c0c8d8' },
  ]

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="fn-card flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', fontSize: 24 }}>
          {profile?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div className="fn-heading text-2xl text-white">{profile?.username}</div>
          <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.15)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.3)' }}>
            LEVEL {profile?.level || 1}
          </div>
        </div>
      </div>

      <div className="flex border-b mb-5" style={{ borderColor: 'rgba(192,200,216,0.1)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`fn-tab ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="fn-card p-4" style={{ borderRadius: 3 }}>
              <div className="fn-heading text-2xl" style={{ color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, marginTop: 2 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'account' && (
        <div className="fn-card p-5" style={{ borderRadius: 4 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, marginBottom: 4 }}>EMAIL</div>
            <div style={{ fontFamily: 'Barlow', fontSize: 14, color: 'rgba(192,200,216,0.7)' }}>{user?.email}</div>
          </div>
          <div className="fn-divider" />
          <button onClick={signOut} className="fn-btn fn-btn-outline" style={{ color: '#ff5252', borderColor: 'rgba(255,82,82,0.3)' }}>
            SIGN OUT
          </button>
        </div>
      )}
    </div>
  )
}
