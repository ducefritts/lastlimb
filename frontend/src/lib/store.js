import { create } from 'zustand'
import { supabase } from './supabase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  profile: null,
  unlockedItems: [],
  achievements: [],
  badges: [],
  loading: true,

  // Game
  socket: null,
  currentGame: null,
  matchmakingStatus: 'idle', // idle, searching, found

  // UI
  activeTab: 'lobby',

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSocket: (socket) => set({ socket }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentGame: (game) => set({ currentGame: game }),
  setMatchmakingStatus: (s) => set({ matchmakingStatus: s }),

  loadProfile: async (userId) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) return

    try {
      const res = await fetch(`${API}/api/game/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({
        profile: data.profile,
        unlockedItems: data.unlockedItems?.map(i => i.item_id) || [],
        achievements: data.achievements || [],
        badges: data.badges || [],
      })
    } catch (e) {
      console.error('Failed to load profile', e)
    }
  },

  initAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: session.user })
      await get().loadProfile(session.user.id)
    }
    set({ loading: false })

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ user: session.user })
        await get().loadProfile(session.user.id)
      } else {
        set({ user: null, profile: null, unlockedItems: [], achievements: [], badges: [] })
      }
    })
  },

  hasItem: (itemId) => get().unlockedItems.includes(itemId),

  getApiHeaders: async () => {
    let { data: { session } } = await supabase.auth.getSession()
    // If token is expired or close to expiring, refresh it
    if (!session?.access_token || (session.expires_at && session.expires_at * 1000 < Date.now() + 60000)) {
      const { data: refreshed } = await supabase.auth.refreshSession()
      if (refreshed?.session) session = refreshed.session
    }
    return { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' }
  },

  equipItem: async (slot, itemId) => {
    const headers = await get().getApiHeaders()
    await fetch(`${API}/api/game/equip`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ slot, itemId })
    })
    set(s => ({ profile: { ...s.profile, [`equipped_${slot}`]: itemId } }))
  },

  refreshGems: async () => {
    const { user } = get()
    if (!user) return
    const { data } = await supabase.from('profiles').select('gems').eq('id', user.id).single()
    if (data) set(s => ({ profile: { ...s.profile, gems: data.gems } }))
  }
}))
