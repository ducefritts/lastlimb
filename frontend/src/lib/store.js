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
    // Refresh session to ensure token is valid
    const { data: { session } } = await supabase.auth.refreshSession()
    const token = session?.access_token
    if (!token) {
      // Fall back to current session
      const { data: { session: current } } = await supabase.auth.getSession()
      return { Authorization: `Bearer ${current?.access_token}`, 'Content-Type': 'application/json' }
    }
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
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
