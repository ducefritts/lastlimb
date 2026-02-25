import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, GEM_PACKS, RARITY_COLORS } from '../lib/gameData'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function StorePage() {
  const { profile, unlockedItems, getApiHeaders, loadProfile, user, refreshGems } = useStore()
  const [tab, setTab] = useState('gems')
  const [loading, setLoading] = useState(null)

  const buyGems = async (pack) => {
    setLoading(pack.id)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/stripe/create-checkout`, {
        method: 'POST', headers,
        body: JSON.stringify({ itemId: pack.id })
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) {
      toast.error(e.message || 'Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  const buyWithGems = async (item) => {
    if (unlockedItems.includes(item.id)) return toast('Already owned!')
    if (!item.gem_price) return
    if ((profile?.gems || 0) < item.gem_price) return toast.error('Not enough gems!')

    setLoading(item.id)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/stripe/buy-with-gems`, {
        method: 'POST', headers,
        body: JSON.stringify({ itemId: item.id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`${item.name} unlocked!`)
        await loadProfile(user.id)
      } else {
        throw new Error(data.error)
      }
    } catch (e) {
      toast.error(e.message || 'Purchase failed')
    } finally {
      setLoading(null)
    }
  }

  const tabs = [
    { id: 'gems', label: '💎 GEM PACKS' },
    { id: 'hats', label: '🎩 HATS' },
    { id: 'colors', label: '🎨 COLORS' },
    { id: 'accessories', label: '🕶️ ACCESSORIES' },
    { id: 'gallows', label: '🪢 GALLOWS' },
    { id: 'fonts', label: '🔤 FONTS' },
  ]

  const filterItems = (type) => ALL_UNLOCKABLES.filter(i => i.type === type)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-xl" style={{ color: '#00fff5' }}>STORE</h1>
          <p className="font-mono text-xs text-gray-500 mt-1">Customize your LastLimb experience</p>
        </div>
        <div className="arcade-card px-4 py-2 flex items-center gap-2">
          <span className="text-lg">💎</span>
          <span className="font-pixel text-sm" style={{ color: '#00e5ff' }}>{profile?.gems || 0}</span>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-800 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn whitespace-nowrap ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'gems' && (
        <div>
          <p className="font-mono text-xs text-gray-500 mb-4">Purchase gems to unlock cosmetics, fonts, and more.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {GEM_PACKS.map(pack => (
              <div key={pack.id} className={`arcade-card p-5 relative ${pack.popular ? 'border-yellow-500' : ''}`}
                style={pack.popular ? { borderColor: '#ffbe0b', boxShadow: '0 0 15px rgba(255,190,11,0.3)' } : {}}>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 font-pixel text-xs px-3 py-1"
                    style={{ background: '#ffbe0b', color: '#000', fontSize: 7 }}>
                    BEST VALUE
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-1">💎</div>
                  <div className="font-pixel text-lg" style={{ color: '#00e5ff' }}>{pack.gems.toLocaleString()}</div>
                  {pack.bonus && <div className="font-mono text-xs text-green-400">{pack.bonus}</div>}
                  <div className="font-mono text-xs text-gray-400 mt-1">{pack.name}</div>
                </div>
                <button onClick={() => buyGems(pack)} disabled={loading === pack.id}
                  className="btn-pixel btn-yellow w-full" style={{ fontSize: 10 }}>
                  {loading === pack.id ? 'LOADING...' : pack.price}
                </button>
              </div>
            ))}
          </div>

          <div className="arcade-card p-6 text-center" style={{ borderColor: '#ffbe0b' }}>
            <div className="text-4xl mb-2">🎫</div>
            <div className="font-pixel text-sm mb-1 text-white">SEASON PASS</div>
            <div className="font-mono text-xs text-gray-400 mb-4">30 tiers of rewards · 15 days · Unlock exclusive cosmetics</div>
            <div className="font-pixel text-2xl mb-4" style={{ color: '#ffbe0b' }}>$4.99</div>
            <button onClick={async () => {
              const headers = await useStore.getState().getApiHeaders()
              const res = await fetch(`${API}/api/stripe/create-checkout`, {
                method: 'POST', headers,
                body: JSON.stringify({ itemId: 'season_pass' })
              })
              const { url } = await res.json()
              window.location.href = url
            }} className="btn-pixel btn-yellow" style={{ fontSize: 10, padding: '14px 40px' }}>
              GET PASS
            </button>
          </div>
        </div>
      )}

      {['hats', 'colors', 'accessories', 'gallows', 'fonts'].includes(tab) && (
        <CosmeticGrid
          items={filterItems(tab === 'hats' ? 'hat' : tab === 'colors' ? 'color' : tab === 'accessories' ? 'accessory' : tab === 'gallows' ? 'gallows' : 'font')}
          unlockedItems={unlockedItems}
          gems={profile?.gems || 0}
          onBuy={buyWithGems}
          loading={loading}
        />
      )}
    </div>
  )
}

function CosmeticGrid({ items, unlockedItems, gems, onBuy, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map(item => {
        const owned = unlockedItems.includes(item.id)
        const canAfford = gems >= (item.gem_price || 0)
        const rarityColor = RARITY_COLORS[item.rarity]

        return (
          <div key={item.id} className="arcade-card p-4 flex flex-col items-center text-center"
            style={{ borderColor: owned ? '#06d6a0' : `${rarityColor}44` }}>
            <div className="text-xs font-pixel mb-2 self-end" style={{ color: rarityColor, fontSize: 7 }}>
              {item.rarity.toUpperCase()}
            </div>
            <div className="mb-2 flex items-center justify-center" style={{width:64,height:64}}>
              {item.fontPreview
                ? <span style={{fontSize:32,color:"#fff"}}>A</span>
                : item.image
                  ? <img src={item.image} alt={item.name} style={{width:56,height:56,objectFit:"contain"}} />
                  : <span className="text-4xl">{item.emoji || "?"}</span>
              }
            </div>
            <div className="font-mono text-xs text-white mb-1">{item.name}</div>
            {owned ? (
              <div className="font-pixel text-xs mt-2" style={{ color: '#06d6a0', fontSize: 8 }}>✓ OWNED</div>
            ) : (
              <button onClick={() => onBuy(item)} disabled={loading === item.id || !canAfford}
                className={`btn-pixel mt-2 w-full ${canAfford ? 'btn-cyan' : ''}`}
                style={{ fontSize: 8, padding: '6px 8px', opacity: canAfford ? 1 : 0.4 }}>
                {loading === item.id ? '...' : `💎 ${item.gem_price}`}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
