import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { SEASON_PASS_TIERS, getItemById } from '../lib/gameData'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function SeasonPassPage() {
  const { profile, getApiHeaders, loadProfile, user } = useStore()
  const [loading, setLoading] = useState(false)

  const hasSP = profile?.season_pass_active && new Date(profile?.season_pass_expires_at) > new Date()
  const currentTier = profile?.season_pass_tier || 0

  const daysLeft = hasSP ? Math.ceil((new Date(profile.season_pass_expires_at) - new Date()) / (1000 * 60 * 60 * 24)) : 0

  const buySeasonPass = async () => {
    setLoading(true)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/stripe/create-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ itemId: 'season_pass' })
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (e) {
      toast.error('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  const claimTier = async (tier) => {
    if (tier.tier > currentTier + 1) return
    const headers = await getApiHeaders()
    const res = await fetch(`${API}/api/game/season-pass/advance`, { method: 'POST', headers })
    const data = await res.json()
    if (data.success) {
      toast.success(`Tier ${tier.tier} claimed!`)
      loadProfile(user.id)
    } else {
      toast.error(data.error || 'Failed to claim')
    }
  }

  const renderReward = (reward, isFree) => {
    if (!reward) return <span className="text-gray-700 text-xs">—</span>
    if (reward.type === 'gems') return <span style={{ color: '#00e5ff' }}>💎 {reward.amount}</span>
    const item = getItemById(reward.id)
    if (item) return <span title={item.name}>{item.emoji}</span>
    return <span>?</span>
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🎫</div>
        <h1 className="font-pixel text-xl mb-2" style={{ color: '#ffbe0b' }}>SEASON PASS</h1>
        <p className="font-mono text-sm text-gray-400">15 days · 30 tiers · 16 FREE prizes</p>
      </div>

      {/* Status Banner */}
      {hasSP ? (
        <div className="arcade-card p-4 mb-6 text-center" style={{ borderColor: '#ffbe0b', boxShadow: '0 0 15px rgba(255,190,11,0.3)' }}>
          <div className="font-pixel text-xs" style={{ color: '#ffbe0b' }}>✅ SEASON PASS ACTIVE</div>
          <div className="font-mono text-sm text-gray-300 mt-1">⏱ {daysLeft} days remaining · Tier {currentTier}/30</div>
        </div>
      ) : (
        <div className="arcade-card p-6 mb-6 text-center" style={{ borderColor: '#ffbe0b' }}>
          <div className="font-pixel text-sm mb-2 text-white">UNLOCK ALL 30 TIERS</div>
          <div className="font-mono text-xs text-gray-400 mb-4">Tiers 17-30 require Season Pass · 15 days access</div>
          <div className="font-pixel text-2xl mb-4" style={{ color: '#ffbe0b' }}>$4.99</div>
          <button onClick={buySeasonPass} disabled={loading} className="btn-pixel btn-yellow" style={{ fontSize: 10, padding: '14px 30px' }}>
            {loading ? 'LOADING...' : '🎫 BUY SEASON PASS'}
          </button>
          <div className="mt-3 text-xs text-gray-600 font-mono">Valid for 15 days from purchase</div>
        </div>
      )}

      {/* Tier grid */}
      <div className="arcade-card p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-pixel text-xs text-gray-400" style={{ fontSize: 8 }}>FREE TRACK</span>
          <span className="font-pixel text-xs" style={{ color: '#ffbe0b', fontSize: 8 }}>PASS TRACK</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-6">
          <div className="progress-fill" style={{ width: `${(currentTier / 30) * 100}%`, background: 'linear-gradient(90deg, #ffbe0b, #ff006e)' }} />
        </div>

        <div className="space-y-3">
          {SEASON_PASS_TIERS.map((tier) => {
            const unlocked = tier.tier <= currentTier
            const available = tier.tier === currentTier + 1
            const isPaidOnly = !tier.free
            const needsPass = tier.tier > 16 && !hasSP

            return (
              <div key={tier.tier} className={`flex items-center gap-3 p-3 border transition-all ${
                unlocked ? 'border-green-800 bg-green-900/10' :
                available ? 'border-cyan-700 bg-cyan-900/10' :
                'border-gray-800'
              }`}>
                {/* Tier number */}
                <div className="font-pixel text-xs w-8 text-center" style={{
                  color: unlocked ? '#06d6a0' : available ? '#00fff5' : '#555'
                }}>
                  {tier.tier}
                </div>

                {/* Free reward */}
                <div className={`flex-1 flex items-center justify-center p-2 border text-lg ${
                  !tier.free ? 'border-transparent' :
                  unlocked ? 'border-green-700 bg-green-900/20' :
                  available ? 'border-cyan-700' : 'border-gray-800'
                }`}>
                  {tier.free ? renderReward(tier.free, true) : <span className="text-gray-800 text-xs">FREE</span>}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-700" />

                {/* Paid reward */}
                <div className={`flex-1 flex items-center justify-center p-2 border text-lg ${
                  needsPass ? 'border-gray-800 opacity-40' :
                  unlocked ? 'border-yellow-700 bg-yellow-900/20' :
                  available ? 'border-yellow-600' : 'border-gray-800'
                }`} style={!needsPass && !unlocked && available ? { borderColor: '#ffbe0b' } : {}}>
                  {needsPass ? '🔒' : renderReward(tier.paid, false)}
                </div>

                {/* Claim button */}
                <div className="w-20 flex justify-center">
                  {unlocked ? (
                    <span className="font-pixel text-xs" style={{ color: '#06d6a0', fontSize: 8 }}>✓ DONE</span>
                  ) : available && (!isPaidOnly || hasSP) ? (
                    <button onClick={() => claimTier(tier)} className="btn-pixel btn-cyan" style={{ fontSize: 7, padding: '6px 8px' }}>
                      CLAIM
                    </button>
                  ) : needsPass ? (
                    <span className="font-pixel text-xs" style={{ color: '#ffbe0b', fontSize: 7 }}>PASS</span>
                  ) : (
                    <span className="font-pixel text-xs text-gray-700" style={{ fontSize: 7 }}>LOCKED</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center text-xs text-gray-700 font-mono">
        * Tier unlocks by gaining XP, winning games, or making purchases. Each action advances 1 tier.
      </div>
    </div>
  )
}
