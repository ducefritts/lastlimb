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
  matchmakingStatus: 'idle',

  // UI
  activeTab: 'lobby',

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSocket: (socket) => set({ socket }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentGame: (game) => set({ currentGame: game }),
  setMatchmakingStatus: (s) => set({ matchmakingStatus: s }),

  loadProfile: async (userId) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const { data: unlockedItems } = await supabase
        .from('unlocked_items')
        .select('*')
        .eq('user_id', userId)

      set({
        profile,
        unlockedItems: unlockedItems?.map(i => i.item_id) || [],
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
    const { data: { session } } = await supabase.auth.getSession()
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
