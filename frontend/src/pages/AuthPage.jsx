import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username.toLowerCase().replace(/\s/g, '_'),
          display_name: username,
          gems: 100
        })

        // Grant newcomer badge
        await supabase.from('user_badges').insert({ user_id: data.user.id, badge_id: 'newcomer' })

        toast.success('Account created! Welcome to LastLimb!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      {/* Background grid */}
      <div className="fixed inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(0,255,245,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,245,0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-float">🪢</div>
          <h1 className="font-pixel text-3xl text-white mb-2" style={{ textShadow: '0 0 20px #00fff5, 0 0 40px #00fff5' }}>
            LAST<span style={{ color: '#ff006e' }}>LIMB</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono tracking-widest">THE ULTIMATE HANGMAN ARENA</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-800">
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`tab-btn flex-1 text-center capitalize ${mode === m ? 'active' : ''}`}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="arcade-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-pixel" style={{ fontSize: 9 }}>USERNAME</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="CoolPlayer99"
                  required
                  className="w-full bg-black border border-gray-700 focus:border-cyan-400 text-white p-3 outline-none font-mono text-sm"
                  style={{ borderColor: 'rgba(0,255,245,0.3)' }}
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-pixel" style={{ fontSize: 9 }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-black border text-white p-3 outline-none font-mono text-sm"
                style={{ borderColor: 'rgba(0,255,245,0.3)' }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-pixel" style={{ fontSize: 9 }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black border text-white p-3 outline-none font-mono text-sm"
                style={{ borderColor: 'rgba(0,255,245,0.3)' }}
              />
            </div>
            <button type="submit" disabled={loading}
              className="btn-pixel btn-cyan w-full mt-4" style={{ padding: '14px', fontSize: 11 }}>
              {loading ? 'LOADING...' : mode === 'login' ? 'ENTER ARENA' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-gray-600 mt-4 font-mono">
              No account?{' '}
              <span onClick={() => setMode('register')} className="cursor-pointer" style={{ color: '#00fff5' }}>
                Register now
              </span>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-700 mt-6 font-mono">
          © 2025 LastLimb Arena · All rights reserved
        </p>
      </div>
    </div>
  )
}
