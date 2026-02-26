import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, RARITY_COLORS } from '../lib/gameData'
import HangmanPixel from '../components/HangmanPixel'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Free body options ──────────────────────────────────
const SKIN_TONES = [
  { id: 'tan_1',    label: 'Light Tan',    color: '#f5e6d0' },
  { id: 'tan_2',    label: 'Medium Tan',   color: '#e8c99a' },
  { id: 'tan_3',    label: 'Dark Tan',     color: '#d4a96a' },
  { id: 'brown_1',  label: 'Light Brown',  color: '#c68642' },
  { id: 'brown_2',  label: 'Medium Brown', color: '#8d5524' },
  { id: 'brown_3',  label: 'Dark Brown',   color: '#5c3317' },
  { id: 'yellow_1', label: 'Light Gold',   color: '#f0d9a0' },
  { id: 'yellow_2', label: 'Medium Gold',  color: '#e8c870' },
  { id: 'yellow_3', label: 'Dark Gold',    color: '#d4aa50' },
]

const MOUTH_STYLES = [
  { id: 'happy',     label: 'Happy',      preview: '🙂' },
  { id: 'sad',       label: 'Sad',        preview: '🙁' },
  { id: 'straight',  label: 'Straight',   preview: '😐' },
  { id: 'open',      label: 'Open',       preview: '😮' },
  { id: 'tongue',    label: 'Tongue',     preview: '😛' },
  { id: 'buckteeth', label: 'Buck Teeth', preview: '😬' },
]

const HAIR_STYLES = [
  { id: 'short',    label: 'Short' },
  { id: 'long',     label: 'Long' },
  { id: 'curly',    label: 'Curly' },
  { id: 'mohawk',   label: 'Mohawk' },
  { id: 'bald',     label: 'Bald' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'spiky',    label: 'Spiky' },
  { id: 'afro',     label: 'Afro' },
]

const HAIR_COLORS = [
  { id: 'black',  label: 'Black',  color: '#1a0a00' },
  { id: 'brown',  label: 'Brown',  color: '#5c3317' },
  { id: 'blonde', label: 'Blonde', color: '#d4a030' },
  { id: 'orange', label: 'Orange', color: '#cc5500' },
]

const SHIRT_COLORS = [
  { id: 'blue',   label: 'Blue',   color: '#2a3a8a' },
  { id: 'red',    label: 'Red',    color: '#8a2a2a' },
  { id: 'yellow', label: 'Yellow', color: '#8a7a10' },
  { id: 'black',  label: 'Black',  color: '#1a1a1a' },
  { id: 'white',  label: 'White',  color: '#e8e8e8' },
]

const PANTS_COLORS = [
  { id: 'navy',   label: 'Navy',   color: '#1a2540' },
  { id: 'blue',   label: 'Blue',   color: '#2a3a8a' },
  { id: 'red',    label: 'Red',    color: '#8a2a2a' },
  { id: 'yellow', label: 'Yellow', color: '#8a7a10' },
  { id: 'black',  label: 'Black',  color: '#1a1a1a' },
  { id: 'white',  label: 'White',  color: '#e8e8e8' },
]

const STYLE_SLOTS = [
  { key: 'color',     label: 'BODY FX',    type: 'color' },
  { key: 'hat',       label: 'HAT',        type: 'hat' },
  { key: 'accessory', label: 'ACCESSORY',  type: 'accessory' },
  { key: 'gallows',   label: 'GALLOWS',    type: 'gallows' },
]

export default function LockerPage() {
  const { profile, user, unlockedItems, getApiHeaders, loadProfile, setActiveTab } = useStore()
  const [section, setSection] = useState('body')
  const [activeSlot, setActiveSlot] = useState('skin')
  const [saving, setSaving] = useState(false)
  const [eyeColorInput, setEyeColorInput] = useState(profile?.eye_color || '#4a90d9')

  const char = getChar()

  const [localChar, setLocalChar] = useState(null)

  const getChar = () => localChar || {
    skinTone:   profile?.skin_tone   || 'tan_2',
    eyeColor:   profile?.eye_color   || '#4a90d9',
    mouthStyle: profile?.mouth_style || 'happy',
    hairStyle:  profile?.hair_style  || 'short',
    hairColor:  profile?.hair_color  || 'brown',
    shirtColor: profile?.shirt_color || 'blue',
    pantsColor: profile?.pants_color || 'navy',
    hat:        profile?.equipped_hat       || 'none',
    color:      profile?.equipped_color     || 'white',
    accessory:  profile?.equipped_accessory || 'none',
    gallows:    profile?.equipped_gallows   || 'classic',
  }

  const save = async (updates) => {
    setSaving(true)
    // Map update keys to char keys
    const keyMap = { skin_tone: 'skinTone', eye_color: 'eyeColor', mouth_style: 'mouthStyle', hair_style: 'hairStyle', hair_color: 'hairColor', shirt_color: 'shirtColor', pants_color: 'pantsColor' }
    const charUpdates = {}
    for (const [k, v] of Object.entries(updates)) {
      if (keyMap[k]) charUpdates[keyMap[k]] = v
    }
    setLocalChar(prev => ({ ...(prev || getChar()), ...charUpdates }))
    try {
      const headers = await getApiHeaders()
      fetch(`${API}/api/game/character`, {
        method: 'POST', headers,
        body: JSON.stringify(updates)
      })
      toast.success('Saved!')
    } catch (e) { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const equip = async (slot, itemId) => {
    setSaving(true)
    setLocalChar(prev => ({ ...(prev || getChar()), [slot]: itemId }))
    try {
      const headers = await getApiHeaders()
      fetch(`${API}/api/game/equip`, { method: 'POST', headers, body: JSON.stringify({ slot, itemId }) })
      toast.success('Equipped!')
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const unequip = async (slot) => {
    const defaultVal = slot === 'color' ? 'white' : 'none'
    await equip(slot, defaultVal)
  }

  const slotItems = (type) => ALL_UNLOCKABLES.filter(i => i.type === type && unlockedItems.includes(i.id))

  const BODY_SLOTS = [
    { key: 'skin',       label: 'SKIN TONE' },
    { key: 'eyes',       label: 'EYE COLOR' },
    { key: 'mouth',      label: 'MOUTH' },
    { key: 'hair',       label: 'HAIR STYLE' },
    { key: 'hair_color', label: 'HAIR COLOR' },
  ]

  const CLOTHES_SLOTS = [
    { key: 'shirt',  label: 'SHIRT' },
    { key: 'pants',  label: 'PANTS' },
    ...STYLE_SLOTS.map(s => ({ key: s.key, label: s.label })),
  ]

  const currentSlots = section === 'body' ? BODY_SLOTS : CLOTHES_SLOTS

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="fn-heading text-3xl text-white">LOCKER</div>
        <button onClick={() => setActiveTab('store')} className="fn-btn fn-btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
          GET MORE ITEMS
        </button>
      </div>

      {/* Section toggle */}
      <div className="flex px-4 mb-4 gap-2">
        {['body', 'style'].map(s => (
          <button key={s} onClick={() => { setSection(s); setActiveSlot(s === 'body' ? 'skin' : 'shirt') }}
            className="fn-btn flex-1" style={{
              fontSize: 13, padding: '10px',
              background: section === s ? 'rgba(0,168,255,0.2)' : 'transparent',
              border: `1px solid ${section === s ? '#00a8ff' : 'rgba(192,200,216,0.2)'}`,
              color: section === s ? '#00a8ff' : 'rgba(192,200,216,0.5)',
              fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: 2,
            }}>
            {s === 'body' ? 'BODY' : 'STYLE'}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 px-4 pb-24">

        {/* Character Preview */}
        <div className="fn-card flex flex-col items-center p-5 md:w-56 flex-shrink-0"
          style={{ borderRadius: 4, background: 'radial-gradient(ellipse at 50% 80%, rgba(0,168,255,0.07) 0%, transparent 65%)' }}>
          <HangmanPixel
            wrongGuesses={0}
            equippedHat={char.hat}
            equippedColor={char.color}
            equippedAccessory={char.accessory}
            equippedGallows={char.gallows}
            skinTone={char.skinTone}
            eyeColor={char.eyeColor}
            mouthStyle={char.mouthStyle}
            hairStyle={char.hairStyle}
            hairColor={char.hairColor}
            shirtColor={char.shirtColor}
            pantsColor={char.pantsColor}
            size={160}
          />
          <div className="fn-heading text-base text-white mt-3">{profile?.username}</div>
          <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.15)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.3)' }}>
            LEVEL {profile?.level || 1}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          {/* Slot tabs */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {currentSlots.map(slot => (
              <button key={slot.key} onClick={() => setActiveSlot(slot.key)}
                style={{
                  fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, letterSpacing: 1,
                  padding: '6px 12px', borderRadius: 2, cursor: 'pointer', border: '1px solid',
                  borderColor: activeSlot === slot.key ? '#00a8ff' : 'rgba(192,200,216,0.15)',
                  background: activeSlot === slot.key ? 'rgba(0,168,255,0.15)' : 'rgba(255,255,255,0.03)',
                  color: activeSlot === slot.key ? '#00a8ff' : 'rgba(192,200,216,0.5)',
                }}>
                {slot.label}
              </button>
            ))}
          </div>

          {/* ── SKIN TONE ── */}
          {activeSlot === 'skin' && (
            <div className="grid grid-cols-3 gap-3">
              {SKIN_TONES.map(s => (
                <button key={s.id} onClick={() => save({ skin_tone: s.id })}
                  className="fn-card flex flex-col items-center p-3 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.skinTone === s.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.skinTone === s.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.color, border: '2px solid rgba(0,0,0,0.3)', marginBottom: 6 }} />
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, color: 'rgba(192,200,216,0.7)', textAlign: 'center' }}>{s.label}</div>
                  {char.skinTone === s.id && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>SELECTED</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── EYE COLOR ── */}
          {activeSlot === 'eyes' && (
            <div className="fn-card p-5" style={{ borderRadius: 4 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'rgba(192,200,216,0.5)', letterSpacing: 1, marginBottom: 16 }}>
                PICK EYE COLOR
              </div>
              <div className="flex items-center gap-4 mb-5">
                <input type="color" value={eyeColorInput}
                  onChange={e => setEyeColorInput(e.target.value)}
                  style={{ width: 64, height: 64, borderRadius: 4, border: '2px solid rgba(192,200,216,0.2)', cursor: 'pointer', background: 'none', padding: 2 }} />
                <div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 18, color: 'white' }}>{eyeColorInput.toUpperCase()}</div>
                  <div style={{ fontFamily: 'Barlow', fontSize: 13, color: 'rgba(192,200,216,0.4)', marginTop: 2 }}>Click the color wheel to pick any color</div>
                </div>
              </div>
              {/* Quick presets */}
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, marginBottom: 10 }}>QUICK PRESETS</div>
              <div className="flex gap-2 flex-wrap mb-5">
                {['#4a90d9','#2ecc40','#8B4513','#333333','#9B59B6','#e74c3c','#1abc9c','#ffd740'].map(c => (
                  <button key={c} onClick={() => setEyeColorInput(c)}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: eyeColorInput === c ? '3px solid white' : '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} />
                ))}
              </div>
              <button onClick={() => save({ eye_color: eyeColorInput })}
                className="fn-btn fn-btn-blue" style={{ fontSize: 13 }}>
                APPLY
              </button>
            </div>
          )}

          {/* ── MOUTH ── */}
          {activeSlot === 'mouth' && (
            <div className="grid grid-cols-3 gap-3">
              {MOUTH_STYLES.map(m => (
                <button key={m.id} onClick={() => save({ mouth_style: m.id })}
                  className="fn-card flex flex-col items-center p-4 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.mouthStyle === m.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.mouthStyle === m.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{m.preview}</div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, color: 'rgba(192,200,216,0.7)' }}>{m.label}</div>
                  {char.mouthStyle === m.id && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>SELECTED</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── HAIR STYLE ── */}
          {activeSlot === 'hair' && (
            <div className="grid grid-cols-4 gap-3">
              {HAIR_STYLES.map(h => (
                <button key={h.id} onClick={() => save({ hair_style: h.id })}
                  className="fn-card flex flex-col items-center p-3 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.hairStyle === h.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.hairStyle === h.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>
                    {h.id === 'short' ? '👦' : h.id === 'long' ? '👱' : h.id === 'curly' ? '🧑‍🦱' : h.id === 'mohawk' ? '🤘' : h.id === 'bald' ? '👨‍🦲' : h.id === 'ponytail' ? '💁' : h.id === 'spiky' ? '⚡' : '🌀'}
                  </div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, color: 'rgba(192,200,216,0.7)', textAlign: 'center' }}>{h.label}</div>
                  {char.hairStyle === h.id && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>ON</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── HAIR COLOR ── */}
          {activeSlot === 'hair_color' && (
            <div className="grid grid-cols-2 gap-3">
              {HAIR_COLORS.map(h => (
                <button key={h.id} onClick={() => save({ hair_color: h.id })}
                  className="fn-card flex items-center gap-3 p-4 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.hairColor === h.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.hairColor === h.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: h.color, border: '2px solid rgba(0,0,0,0.4)', flexShrink: 0 }} />
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: 'rgba(192,200,216,0.8)' }}>{h.label}</div>
                  {char.hairColor === h.id && <div className="fn-badge ml-auto" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>ON</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── SHIRT ── */}
          {activeSlot === 'shirt' && (
            <div className="grid grid-cols-3 gap-3">
              {SHIRT_COLORS.map(c => (
                <button key={c.id} onClick={() => save({ shirt_color: c.id })}
                  className="fn-card flex flex-col items-center p-3 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.shirtColor === c.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.shirtColor === c.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: c.color, border: '2px solid rgba(0,0,0,0.3)', marginBottom: 6 }} />
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, color: 'rgba(192,200,216,0.7)' }}>{c.label}</div>
                  {char.shirtColor === c.id && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>ON</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── PANTS ── */}
          {activeSlot === 'pants' && (
            <div className="grid grid-cols-3 gap-3">
              {PANTS_COLORS.map(c => (
                <button key={c.id} onClick={() => save({ pants_color: c.id })}
                  className="fn-card flex flex-col items-center p-3 transition-all"
                  style={{ borderRadius: 3, border: `2px solid ${char.pantsColor === c.id ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: char.pantsColor === c.id ? 'rgba(0,168,255,0.1)' : '' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: c.color, border: '2px solid rgba(0,0,0,0.3)', marginBottom: 6 }} />
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, color: 'rgba(192,200,216,0.7)' }}>{c.label}</div>
                  {char.pantsColor === c.id && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>ON</div>}
                </button>
              ))}
            </div>
          )}

          {/* ── STYLE SLOTS (color, hat, accessory, gallows) ── */}
          {['color','hat','accessory','gallows'].includes(activeSlot) && (() => {
            const items = slotItems(activeSlot === 'color' ? 'color' : activeSlot === 'hat' ? 'hat' : activeSlot === 'accessory' ? 'accessory' : 'gallows')
            const current = char[activeSlot]
            return (
              <div>
                {items.length === 0 ? (
                  <div className="fn-card p-10 text-center" style={{ borderRadius: 4 }}>
                    <div className="fn-heading text-xl mb-2" style={{ color: 'rgba(192,200,216,0.2)' }}>NO ITEMS</div>
                    <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 14, marginBottom: 20 }}>Visit the store to unlock items!</div>
                    <button onClick={() => setActiveTab('store')} className="fn-btn fn-btn-blue" style={{ fontSize: 13 }}>VISIT STORE</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    <button onClick={() => unequip(activeSlot)}
                      className="fn-card flex flex-col items-center p-3 transition-all"
                      style={{ borderRadius: 3, border: `2px solid ${current === 'none' || current === 'white' ? '#00a8ff' : 'rgba(192,200,216,0.1)'}`, background: current === 'none' || current === 'white' ? 'rgba(0,168,255,0.1)' : '' }}>
                      <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✕</div>
                      <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 10, color: 'rgba(192,200,216,0.5)', marginTop: 4 }}>NONE</div>
                    </button>
                    {items.map(item => {
                      const isEquipped = current === item.id
                      const rarityColor = RARITY_COLORS[item.rarity]
                      return (
                        <button key={item.id} onClick={() => equip(activeSlot, item.id)}
                          className="fn-card flex flex-col items-center p-3 transition-all"
                          style={{ borderRadius: 3, border: `2px solid ${isEquipped ? '#00a8ff' : `${rarityColor}44`}`, background: isEquipped ? 'rgba(0,168,255,0.12)' : '' }}>
                          <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: 'contain' }} /> : <span style={{ fontSize: 32 }}>?</span>}
                          </div>
                          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 10, color: isEquipped ? '#00a8ff' : 'rgba(192,200,216,0.7)', marginTop: 4, textAlign: 'center', lineHeight: 1.2 }}>{item.name}</div>
                          {isEquipped && <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>ON</div>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
