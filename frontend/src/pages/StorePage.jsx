import React, { useState } from 'react'
import { useStore } from '../lib/store'
import { ALL_UNLOCKABLES, GEM_PACKS, RARITY_COLORS, FONT_STYLES } from '../lib/gameData'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function StorePage() {
  const { profile, unlockedItems, getApiHeaders, loadProfile, user } = useStore()
  const [tab, setTab] = useState('featured')
  const [loading, setLoading] = useState(null)

  const buyGems = async (pack) => {
    setLoading(pack.id)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/stripe/create-checkout`, { method: 'POST', headers, body: JSON.stringify({ itemId: pack.id }) })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) { toast.error(e.message || 'Failed to start checkout') }
    finally { setLoading(null) }
  }

  const buyWithGems = async (item) => {
    if (unlockedItems.includes(item.id)) return toast('Already owned!')
    if (!item.gem_price) return
    if ((profile?.gems || 0) < item.gem_price) return toast.error('Not enough gems!')
    setLoading(item.id)
    try {
      const headers = await getApiHeaders()
      const res = await fetch(`${API}/api/stripe/buy-with-gems`, { method: 'POST', headers, body: JSON.stringify({ itemId: item.id }) })
      const data = await res.json()
      if (data.success) { toast.success(`${item.name} unlocked!`); await loadProfile(user.id) }
      else throw new Error(data.error)
    } catch (e) { toast.error(e.message || 'Purchase failed') }
    finally { setLoading(null) }
  }

  const tabs = [
    { id: 'featured', label: 'FEATURED' },
    { id: 'hats',     label: 'HATS' },
    { id: 'colors',   label: 'COLORS' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'gallows',  label: 'GALLOWS' },
    { id: 'fonts',    label: 'FONTS' },
    { id: 'gems',     label: 'GEM PACKS' },
  ]

  const filterItems = (type) => ALL_UNLOCKABLES.filter(i => i.type === type)

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="fn-heading text-3xl text-white">ITEM SHOP</div>
        <div className="fn-card flex items-center gap-2 px-4 py-2" style={{ borderRadius: 3 }}>
          <span style={{ fontSize: 16 }}>💎</span>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, color: '#00c8ff', fontSize: 18 }}>{profile?.gems || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b mb-5" style={{ borderColor: 'rgba(192,200,216,0.1)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`fn-tab ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Featured - shows legendary + epic items */}
      {tab === 'featured' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {ALL_UNLOCKABLES.filter(i => i.rarity === 'legendary' || i.rarity === 'epic').map(item => (
              <ItemCard key={item.id} item={item} owned={unlockedItems.includes(item.id)}
                gems={profile?.gems || 0} onBuy={buyWithGems} loading={loading} featured />
            ))}
          </div>
        </div>
      )}

      {/* Cosmetic grids */}
      {['hats','colors','accessories','gallows','fonts'].includes(tab) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filterItems(tab === 'hats' ? 'hat' : tab === 'colors' ? 'color' : tab === 'accessories' ? 'accessory' : tab === 'gallows' ? 'gallows' : 'font').map(item => (
            <ItemCard key={item.id} item={item} owned={unlockedItems.includes(item.id)}
              gems={profile?.gems || 0} onBuy={buyWithGems} loading={loading} />
          ))}
        </div>
      )}

      {/* Gem packs */}
      {tab === 'gems' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {GEM_PACKS.map(pack => (
              <div key={pack.id} className="fn-card p-5 relative" style={{
                borderRadius: 4,
                ...(pack.popular ? { borderColor: '#ffd740', boxShadow: '0 0 20px rgba(255,215,64,0.1)' } : {})
              }}>
                {pack.popular && (
                  <div className="fn-badge absolute -top-3 left-4" style={{ background: '#ffd740', color: '#0a0e1a' }}>
                    BEST VALUE
                  </div>
                )}
                <div className="text-center mb-4">
                  <div style={{ fontSize: 32, marginBottom: 4 }}>💎</div>
                  <div className="fn-heading text-2xl" style={{ color: '#00c8ff' }}>{pack.gems.toLocaleString()}</div>
                  {pack.bonus && <div style={{ color: '#00e676', fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: 600 }}>{pack.bonus}</div>}
                  <div style={{ color: 'rgba(192,200,216,0.4)', fontFamily: 'Barlow Condensed', fontSize: 13, marginTop: 2 }}>{pack.name}</div>
                </div>
                <button onClick={() => buyGems(pack)} disabled={loading === pack.id}
                  className="fn-btn fn-btn-blue w-full" style={{ fontSize: 15 }}>
                  {loading === pack.id ? 'LOADING...' : pack.price}
                </button>
              </div>
            ))}
          </div>

          {/* Season Pass */}
          <div className="fn-card p-6 text-center" style={{ borderColor: '#ffd740', borderRadius: 4, boxShadow: '0 0 30px rgba(255,215,64,0.05)' }}>
            <div className="fn-heading text-2xl mb-1 text-white">SEASON PASS</div>
            <div style={{ color: 'rgba(192,200,216,0.5)', fontFamily: 'Barlow', fontSize: 14, marginBottom: 20 }}>
              30 tiers of rewards · 15 days · Exclusive cosmetics
            </div>
            <div className="fn-heading text-4xl mb-5" style={{ color: '#ffd740' }}>$4.99</div>
            <button onClick={async () => {
              const headers = await useStore.getState().getApiHeaders()
              const res = await fetch(`${API}/api/stripe/create-checkout`, { method: 'POST', headers, body: JSON.stringify({ itemId: 'season_pass' }) })
              const { url } = await res.json()
              window.location.href = url
            }} className="fn-btn fn-btn-silver" style={{ fontSize: 15, padding: '14px 48px' }}>
              GET PASS
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ItemCard({ item, owned, gems, onBuy, loading, featured }) {
  const rarityColor = RARITY_COLORS[item.rarity]
  const canAfford = gems >= (item.gem_price || 0)
  const fontStyle = FONT_STYLES?.[item.id]

  return (
    <div className={`fn-card flex flex-col items-center text-center p-4 rarity-bg-${item.rarity}`}
      style={{ borderRadius: 4, border: `1px solid`, position: 'relative', minHeight: featured ? 180 : 150 }}>
      {owned && (
        <div className="fn-badge absolute top-2 right-2" style={{ background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid rgba(0,230,118,0.3)' }}>
          OWNED
        </div>
      )}
      <div className="fn-badge mb-3 self-start" style={{ color: rarityColor, background: 'rgba(0,0,0,0.3)', border: `1px solid ${rarityColor}44` }}>
        {item.rarity.toUpperCase()}
      </div>

      <div className="flex items-center justify-center mb-3" style={{ width: 64, height: 64 }}>
        {item.fontPreview && fontStyle
          ? <span style={{ fontSize: 40, fontWeight: 900, ...fontStyle }}>A</span>
          : item.image
            ? <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'contain' }} />
            : <span style={{ fontSize: 40 }}>?</span>
        }
      </div>

      <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 2 }}>{item.name}</div>

      {!owned && (
        <button onClick={() => onBuy(item)} disabled={loading === item.id || !canAfford}
          className="fn-btn fn-btn-blue mt-auto w-full" style={{ fontSize: 12, padding: '8px 12px', opacity: canAfford ? 1 : 0.4 }}>
          {loading === item.id ? '...' : `💎 ${item.gem_price}`}
        </button>
      )}
    </div>
  )
}
