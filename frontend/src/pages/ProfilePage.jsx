import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, RARITY_COLORS, FONT_STYLES } from '../lib/gameData'
import toast from 'react-hot-toast'
import HangmanPixel from '../components/HangmanPixel'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ProfilePage() {
  const { profile, user, unlockedItems, getApiHeaders, loadProfile, signOut } = useStore()
  const [tab, setTab] = useState('customize')
  const [saving, setSaving] = useState(false)

  const equippedHat       = profile?.equipped_hat       || 'none'
  const equippedColor     = profile?.equipped_color     || 'white'
  const equippedAccessory = profile?.equipped_accessory || 'none'
  const equippedGallows   = profile?.equipped_gallows   || 'classic'

  const equipItem = async (slot, id) => {
    setSaving(true)
    try {
      const headers = await getApiHeaders()
      await fetch(`${API}/api/game/equip`, { method: 'POST', headers, body: JSON.stringify({ slot, itemId: id }) })
      await loadProfile(user.id)
      toast.success('Equipped!')
    } catch { toast.error('Failed to equip') }
    finally { setSaving(false) }
  }

  const unlockedSet = new Set(unlockedItems)
  const getSlotItems = (type) => ALL_UNLOCKABLES.filter(i => i.type === type && unlockedSet.has(i.id))

  const tabs = [
    { id: 'customize', label: 'CUSTOMIZE' },
    { id: 'stats',     label: 'STATS' },
    { id: 'account',   label: 'ACCOUNT' },
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

      {tab === 'customize' && (
        <div className="flex flex-col gap-6">
          <div className="fn-card p-6 flex justify-center" style={{ borderRadius: 4, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,168,255,0.06) 0%, transparent 60%)' }}>
            <div style={{ width: 180 }}>
              <HangmanPixel wrongGuesses={0}
                equippedHat={equippedHat}
                equippedColor={equippedColor}
                equippedAccessory={equippedAccessory}
                equippedGallows={equippedGallows}
                skinTone={profile?.skin_tone || 'tan_2'}
                eyeColor={profile?.eye_color || '#4a90d9'}
                mouthStyle={profile?.mouth_style || 'happy'}
                hairStyle={profile?.hair_style || 'short'}
                hairColor={profile?.hair_color || 'brown'}
                shirtColor={profile?.shirt_color || 'blue'}
                pantsColor={profile?.pants_color || 'navy'} />
            </div>
          </div>

          {[
            { label: 'COLOR', type: 'color', slot: 'color', current: equippedColor },
            { label: 'HAT', type: 'hat', slot: 'hat', current: equippedHat },
            { label: 'ACCESSORY', type: 'accessory', slot: 'accessory', current: equippedAccessory },
            { label: 'GALLOWS', type: 'gallows', slot: 'gallows', current: equippedGallows },
          ].map(({ label, type, slot, current }) => {
            const items = getSlotItems(type)
            if (items.length === 0) return (
              <div key={slot}>
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'rgba(192,200,216,0.4)', letterSpacing: 1.5, marginBottom: 8 }}>{label}</div>
                <div className="fn-card p-4 text-center" style={{ borderRadius: 3 }}>
                  <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 13 }}>No items unlocked — visit the Store!</div>
                </div>
              </div>
            )
            return (
              <div key={slot}>
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'rgba(192,200,216,0.4)', letterSpacing: 1.5, marginBottom: 8 }}>{label}</div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {items.map(item => (
                    <button key={item.id} onClick={() => equipItem(slot, item.id)} disabled={saving}
                      className="fn-card flex flex-col items-center p-3 flex-shrink-0 transition-all"
                      style={{ borderRadius: 3, width: 80, border: current === item.id ? '2px solid #00a8ff' : '1px solid rgba(192,200,216,0.12)',
                        background: current === item.id ? 'rgba(0,168,255,0.1)' : '' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                        : <span style={{ fontSize: 32 }}>?</span>
                      }
                      <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.6)', marginTop: 4, textAlign: 'center', lineHeight: 1.2 }}>{item.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
