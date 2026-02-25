import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, RARITY_COLORS, getItemById } from '../lib/gameData'
import HangmanPixel from '../components/HangmanPixel'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { profile, unlockedItems, achievements, badges, equipItem } = useStore()
  const [tab, setTab] = useState('customize')

  const equip = async (slot, itemId) => {
    await equipItem(slot, itemId)
    toast.success('Equipped!')
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const levelProgress = profile ? (profile.xp % 500) / 500 : 0
  const level = profile?.level || 1

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="arcade-card p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Hangman preview */}
          <div className="w-32 flex-shrink-0">
            <HangmanPixel
              wrongGuesses={0}
              equippedHat={profile?.equipped_hat}
              equippedColor={profile?.equipped_color}
              equippedAccessory={profile?.equipped_accessory}
              equippedGallows={profile?.equipped_gallows}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-pixel text-lg text-white">{profile?.username}</h2>
              {badges.slice(0, 3).map(b => (
                <span key={b.badge_id} title={b.badge?.name} className="text-lg">{b.badge?.icon}</span>
              ))}
            </div>
            <div className="font-mono text-xs text-gray-400 mb-3">Level {level} · {profile?.xp || 0} XP</div>
            <div className="progress-bar mb-2" style={{ width: '200px' }}>
              <div className="progress-fill" style={{ width: `${levelProgress * 100}%` }} />
            </div>
            <div className="flex gap-6 mt-3">
              <Stat label="WINS" value={profile?.wins || 0} color="#06d6a0" />
              <Stat label="LOSSES" value={profile?.losses || 0} color="#ff4444" />
              <Stat label="STREAK" value={profile?.best_streak || 0} color="#ffbe0b" />
              <Stat label="GEMS" value={profile?.gems || 0} color="#00e5ff" prefix="💎" />
            </div>
          </div>
          <button onClick={logout} className="btn-pixel btn-pink" style={{ fontSize: 8, padding: '8px 12px' }}>LOGOUT</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 mb-6">
        {[
          { id: 'customize', label: '🎨 CUSTOMIZE' },
          { id: 'achievements', label: '🏅 ACHIEVEMENTS' },
          { id: 'badges', label: '🏷️ BADGES' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {/* Customize */}
      {tab === 'customize' && (
        <div className="space-y-6">
          {[
            { slot: 'hat', label: 'HATS', type: 'hat' },
            { slot: 'color', label: 'COLORS', type: 'color' },
            { slot: 'accessory', label: 'ACCESSORIES', type: 'accessory' },
            { slot: 'gallows', label: 'GALLOWS', type: 'gallows' },
            { slot: 'font', label: 'FONTS', type: 'font' },
          ].map(({ slot, label, type }) => {
            const slotItems = ALL_UNLOCKABLES.filter(i => i.type === type && (unlockedItems.includes(i.id)))
            const equipped = profile?.[`equipped_${slot}`]

            return (
              <div key={slot} className="arcade-card p-4">
                <div className="font-pixel text-xs text-gray-400 mb-3" style={{ fontSize: 8 }}>{label}</div>
                <div className="flex flex-wrap gap-2">
                  {/* Default option */}
                  <button onClick={() => equip(slot, 'none')}
                    className={`tier-box ${equipped === 'none' || !equipped ? 'unlocked' : ''}`}>
                    <span className="text-xs">∅</span>
                    <span className="font-pixel mt-1" style={{ fontSize: 6 }}>NONE</span>
                  </button>

                  {slotItems.map(item => (
                    <button key={item.id} onClick={() => equip(slot, item.id)}
                      className={`tier-box ${equipped === item.id ? 'unlocked' : ''}`}
                      title={item.name}
                      style={equipped === item.id ? { borderColor: RARITY_COLORS[item.rarity] } : {}}>
                      <span className="text-xl">{item.emoji}</span>
                    </button>
                  ))}

                  {slotItems.length === 0 && (
                    <span className="font-mono text-xs text-gray-600">No items unlocked yet. Visit the Store!</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Achievements */}
      {tab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(a => (
            <div key={a.achievement_id} className="arcade-card p-4 flex items-center gap-3"
              style={{ borderColor: RARITY_COLORS[a.achievement?.rarity] + '66' }}>
              <div className="text-3xl">{a.achievement?.icon}</div>
              <div>
                <div className="font-pixel text-xs text-white" style={{ fontSize: 9 }}>{a.achievement?.name}</div>
                <div className="font-mono text-xs text-gray-400 mt-0.5">{a.achievement?.description}</div>
                <div className="flex gap-2 mt-1">
                  <span className="font-pixel text-xs" style={{ color: '#8338ec', fontSize: 7 }}>+{a.achievement?.xp_reward} XP</span>
                  {a.achievement?.gem_reward > 0 && (
                    <span className="font-pixel text-xs" style={{ color: '#00e5ff', fontSize: 7 }}>+{a.achievement.gem_reward} 💎</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-pixel text-xs text-gray-600">No achievements yet. Start playing!</div>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {tab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map(b => (
            <div key={b.badge_id} className="arcade-card p-4 text-center">
              <div className="text-4xl mb-2">{b.badge?.icon}</div>
              <div className="font-pixel text-xs text-white" style={{ fontSize: 8 }}>{b.badge?.name}</div>
              <div className="font-mono text-xs text-gray-500 mt-1">{b.badge?.description}</div>
            </div>
          ))}
          {badges.length === 0 && (
            <div className="col-span-4 text-center py-8">
              <div className="text-4xl mb-2">🏷️</div>
              <div className="font-pixel text-xs text-gray-600">No badges yet. Keep playing!</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color, prefix = '' }) {
  return (
    <div>
      <div className="font-pixel text-xs text-gray-600" style={{ fontSize: 7 }}>{label}</div>
      <div className="font-pixel text-sm" style={{ color }}>{prefix}{value}</div>
    </div>
  )
}
