import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, RARITY_COLORS } from '../lib/gameData'
import HangmanPixel from '../components/HangmanPixel'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const SLOTS = [
  { key: 'color',     label: 'BODY COLOR',  type: 'color',     defaultId: 'none' },
  { key: 'hat',       label: 'HAT',         type: 'hat',       defaultId: 'none' },
  { key: 'accessory', label: 'ACCESSORY',   type: 'accessory', defaultId: 'none' },
  { key: 'gallows',   label: 'GALLOWS',     type: 'gallows',   defaultId: 'none' },
]

export default function LockerPage() {
  const { profile, user, unlockedItems, getApiHeaders, loadProfile, setActiveTab } = useStore()
  const [activeSlot, setActiveSlot] = useState('color')
  const [saving, setSaving] = useState(false)

  const equipped = {
    color:     profile?.equipped_color     || 'white',
    hat:       profile?.equipped_hat       || 'none',
    accessory: profile?.equipped_accessory || 'none',
    gallows:   profile?.equipped_gallows   || 'classic',
  }

  const equipItem = async (slot, itemId) => {
    setSaving(true)
    try {
      const headers = await getApiHeaders()
      await fetch(`${API}/api/game/equip`, { method: 'POST', headers, body: JSON.stringify({ slot, itemId }) })
      await loadProfile(user.id)
      toast.success('Equipped!')
    } catch { toast.error('Failed to equip') }
    finally { setSaving(false) }
  }

  const unequipItem = async (slot) => {
    setSaving(true)
    try {
      const headers = await getApiHeaders()
      const defaultVal = slot === 'color' ? 'white' : 'none'
      await fetch(`${API}/api/game/equip`, { method: 'POST', headers, body: JSON.stringify({ slot, itemId: defaultVal }) })
      await loadProfile(user.id)
      toast.success('Removed!')
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const currentSlot = SLOTS.find(s => s.key === activeSlot)
  const slotItems = ALL_UNLOCKABLES.filter(i => i.type === currentSlot.type && unlockedItems.includes(i.id))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="fn-heading text-3xl text-white">LOCKER</div>
        <button onClick={() => setActiveTab('store')} className="fn-btn fn-btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
          GET MORE ITEMS
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 px-4 pb-24">

        {/* Character Preview */}
        <div className="fn-card flex flex-col items-center justify-center p-6 md:w-64 flex-shrink-0"
          style={{ borderRadius: 4, background: 'radial-gradient(ellipse at 50% 80%, rgba(0,168,255,0.07) 0%, transparent 65%)' }}>
          <HangmanPixel
            wrongGuesses={0}
            equippedHat={equipped.hat}
            equippedColor={equipped.color}
            equippedAccessory={equipped.accessory}
            equippedGallows={equipped.gallows}
            size={180}
          />
          <div className="fn-heading text-lg text-white mt-4">{profile?.username}</div>
          <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.15)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.3)' }}>
            LEVEL {profile?.level || 1}
          </div>

          {/* Current equipped summary */}
          <div className="w-full mt-5" style={{ borderTop: '1px solid rgba(192,200,216,0.08)', paddingTop: 16 }}>
            {SLOTS.map(slot => {
              const equippedId = equipped[slot.key]
              const item = ALL_UNLOCKABLES.find(i => i.id === equippedId)
              return (
                <div key={slot.key} className="flex items-center justify-between mb-2">
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>{slot.label}</div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, color: item ? 'white' : 'rgba(192,200,216,0.2)' }}>
                    {item ? item.name : 'NONE'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col">
          {/* Slot selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {SLOTS.map(slot => {
              const equippedId = equipped[slot.key]
              const hasItem = equippedId && equippedId !== 'none' && equippedId !== 'white'
              return (
                <button key={slot.key} onClick={() => setActiveSlot(slot.key)}
                  className="fn-card flex flex-col items-center p-3 flex-1 transition-all"
                  style={{
                    borderRadius: 3, minWidth: 70, cursor: 'pointer', border: '1px solid',
                    borderColor: activeSlot === slot.key ? '#00a8ff' : 'rgba(192,200,216,0.12)',
                    background: activeSlot === slot.key ? 'rgba(0,168,255,0.1)' : '',
                  }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, color: activeSlot === slot.key ? '#00a8ff' : 'rgba(192,200,216,0.5)', letterSpacing: 1 }}>
                    {slot.label}
                  </div>
                  {hasItem && (
                    <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.4)', marginTop: 2 }}>
                      {ALL_UNLOCKABLES.find(i => i.id === equippedId)?.name || ''}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Items grid */}
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: 'rgba(192,200,216,0.4)', letterSpacing: 1.5, marginBottom: 12 }}>
            {currentSlot.label} — {slotItems.length} ITEM{slotItems.length !== 1 ? 'S' : ''} OWNED
          </div>

          {slotItems.length === 0 ? (
            <div className="fn-card p-10 text-center flex-1 flex flex-col items-center justify-center" style={{ borderRadius: 4 }}>
              <div className="fn-heading text-xl mb-2" style={{ color: 'rgba(192,200,216,0.2)' }}>NO ITEMS</div>
              <div style={{ color: 'rgba(192,200,216,0.3)', fontFamily: 'Barlow', fontSize: 14, marginBottom: 20 }}>
                You don't own any {currentSlot.label.toLowerCase()} items yet.
              </div>
              <button onClick={() => setActiveTab('store')} className="fn-btn fn-btn-blue" style={{ fontSize: 13 }}>
                VISIT STORE
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {/* None/Remove option */}
              <button
                onClick={() => unequipItem(activeSlot)}
                disabled={saving}
                className="fn-card flex flex-col items-center p-3 transition-all"
                style={{
                  borderRadius: 3, cursor: 'pointer', border: '1px solid',
                  borderColor: (equipped[activeSlot] === 'none' || equipped[activeSlot] === 'white') ? '#00a8ff' : 'rgba(192,200,216,0.12)',
                  background: (equipped[activeSlot] === 'none' || equipped[activeSlot] === 'white') ? 'rgba(0,168,255,0.1)' : '',
                }}>
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✕</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 10, color: 'rgba(192,200,216,0.5)', marginTop: 4 }}>NONE</div>
              </button>

              {slotItems.map(item => {
                const isEquipped = equipped[activeSlot] === item.id
                const rarityColor = RARITY_COLORS[item.rarity]
                return (
                  <button key={item.id} onClick={() => equipItem(activeSlot, item.id)} disabled={saving}
                    className="fn-card flex flex-col items-center p-3 transition-all"
                    style={{
                      borderRadius: 3, cursor: 'pointer', border: '2px solid',
                      borderColor: isEquipped ? '#00a8ff' : `${rarityColor}44`,
                      background: isEquipped ? 'rgba(0,168,255,0.12)' : '',
                    }}>
                    <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                        : <span style={{ fontSize: 32 }}>?</span>
                      }
                    </div>
                    <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 10, color: isEquipped ? '#00a8ff' : 'rgba(192,200,216,0.7)', marginTop: 4, textAlign: 'center', lineHeight: 1.2 }}>
                      {item.name}
                    </div>
                    {isEquipped && (
                      <div className="fn-badge mt-1" style={{ background: 'rgba(0,168,255,0.2)', color: '#00a8ff', border: '1px solid rgba(0,168,255,0.4)', fontSize: 8 }}>
                        EQUIPPED
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
