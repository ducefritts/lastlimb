import React, { useState } from 'react'
import { useStore } from '../lib/store'
import HangmanPixel from '../components/HangmanPixel'
import { getItemById } from '../lib/gameData'

export default function LobbyPage() {
  const { profile, setActiveTab, user, loadProfile } = useStore()
  const [showPlayMenu, setShowPlayMenu] = useState(false)

  React.useEffect(() => {
    if (user?.id) loadProfile(user.id)
  }, [])

  const equippedHat       = profile?.equipped_hat || 'none'
  const equippedColor     = profile?.equipped_color || 'white'
  const equippedAccessory = profile?.equipped_accessory || 'none'
  const equippedGallows   = profile?.equipped_gallows || 'classic'

  const hatItem       = getItemById(equippedHat)
  const colorItem     = getItemById(equippedColor)
  const accessoryItem = getItemById(equippedAccessory)

  const level = profile?.level || 1
  const xp    = profile?.xp || 0
  const xpForNext = level * 500

  const stats = [
    { label: 'WINS',   value: profile?.wins   || 0 },
    { label: 'LOSSES', value: profile?.losses  || 0 },
    { label: 'STREAK', value: profile?.win_streak || 0 },
    { label: 'GEMS',   value: profile?.gems    || 0 },
  ]

  const playModes = [
    {
      id: 'practice',
      icon: '🎯',
      label: 'PRACTICE',
      desc: 'Solo mode vs the computer',
      color: '#00e676',
      tab: 'practice',
    },
    {
      id: 'online',
      icon: '⚔️',
      label: 'ONLINE MATCH',
      desc: 'Find a random opponent',
      color: '#00a8ff',
      tab: 'play',
    },
    {
      id: 'friends',
      icon: '👥',
      label: 'PLAY WITH FRIENDS',
      desc: 'Create or join a private room',
      color: '#ff9800',
      tab: 'play',
    },
  ]

  return (
    <div className="lobby-bg min-h-screen flex flex-col">

      {/* Play Mode Modal */}
      {showPlayMenu && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowPlayMenu(false)}
        >
          <div
            className="w-full max-w-lg p-4 pb-8"
            style={{ background: 'linear-gradient(180deg, #0d1426 0%, #080c16 100%)', borderTop: '1px solid rgba(192,200,216,0.1)', borderRadius: '16px 16px 0 0' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="fn-heading text-2xl text-white">SELECT MODE</div>
              <button onClick={() => setShowPlayMenu(false)}
                style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'rgba(192,200,216,0.4)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: 1 }}>
                ✕ CLOSE
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {playModes.map(mode => (
                <button key={mode.id}
                  onClick={() => { setShowPlayMenu(false); setActiveTab(mode.tab) }}
                  className="fn-card flex items-center gap-4 p-4 transition-all text-left"
                  style={{ borderRadius: 4, border: `1px solid ${mode.color}22`, background: `${mode.color}08` }}>
                  <div style={{ fontSize: 32, width: 44, textAlign: 'center', flexShrink: 0 }}>{mode.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="fn-heading text-lg" style={{ color: mode.color }}>{mode.label}</div>
                    <div style={{ fontFamily: 'Barlow', fontSize: 13, color: 'rgba(192,200,216,0.4)', marginTop: 2 }}>{mode.desc}</div>
                  </div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 20, color: `${mode.color}66` }}>▶</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-4 relative">

        <div style={{
          position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(0,168,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="text-center mb-6">
          <div className="fn-heading text-3xl text-white mb-1">{profile?.username || 'PLAYER'}</div>
          <div className="flex items-center gap-2 justify-center">
            <div className="fn-badge" style={{ background: 'rgba(0,168,255,0.15)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.3)' }}>
              LEVEL {level}
            </div>
            {profile?.win_streak >= 3 && (
              <div className="fn-badge" style={{ background: 'rgba(255,215,64,0.15)', color: '#ffd740', border: '1px solid rgba(255,215,64,0.3)' }}>
                🔥 {profile.win_streak} STREAK
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between mb-1" style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.5)', letterSpacing: 1 }}>
            <span>XP</span>
            <span>{xp} / {xpForNext}</span>
          </div>
          <div className="fn-progress">
            <div className="fn-progress-fill" style={{ width: `${Math.min((xp / xpForNext) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="relative" style={{ width: 220, height: 240 }}>
          <HangmanPixel
            wrongGuesses={0}
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
            pantsColor={profile?.pants_color || 'navy'}
          />
        </div>

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          {[
            { item: colorItem,     label: 'COLOR' },
            { item: hatItem,       label: 'HAT' },
            { item: accessoryItem, label: 'ACCESSORY' },
          ].map(({ item, label }) => item ? (
            <div key={label} className="fn-card flex flex-col items-center p-2" style={{ minWidth: 70 }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                : <span style={{ fontSize: 28 }}>🎨</span>
              }
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 9, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, marginTop: 4 }}>{label}</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, color: 'rgba(192,200,216,0.8)', textAlign: 'center' }}>{item.name}</div>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Stats bar */}
      <div className="fn-card mx-4 mb-4 grid grid-cols-4" style={{ borderRadius: 4 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center py-4"
            style={{ borderRight: i < 3 ? '1px solid rgba(192,200,216,0.08)' : 'none' }}>
            <div className="fn-heading text-xl" style={{ color: 'white' }}>{s.value.toLocaleString()}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.4)', letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 px-4 mb-6">
        <button onClick={() => setShowPlayMenu(true)} className="fn-btn fn-btn-blue flex-1" style={{ fontSize: 16 }}>
          PLAY NOW
        </button>
        <button onClick={() => setActiveTab('locker')} className="fn-btn fn-btn-outline" style={{ padding: '12px 20px' }}>
          CUSTOMIZE
        </button>
      </div>

    </div>
  )
}
