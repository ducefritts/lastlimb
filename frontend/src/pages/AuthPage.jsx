import React, { useState } from 'react'
import { useStore } from '../lib/store'

export default function AuthPage() {
  const { signIn, signUp } = useStore()
  const [mode, setMode]       = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handle = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, username)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 50%, #080c16 100%)' }}>

      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(0,168,255,0.06) 0%, transparent 60%)',
      }} />

      <div className="w-full max-w-sm relative">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="fn-heading mb-2" style={{ fontSize: 48, color: 'white', lineHeight: 1 }}>
            LAST<span style={{ color: '#00a8ff' }}>LIMB</span>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed', color: 'rgba(192,200,216,0.4)', fontSize: 12, letterSpacing: 3 }}>
            MULTIPLAYER HANGMAN
          </div>
        </div>

        {/* Card */}
        <div className="fn-card p-6" style={{ borderRadius: 4 }}>

          {/* Mode toggle */}
          <div className="flex mb-6" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 3, padding: 3 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 transition-all"
                style={{
                  fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, letterSpacing: 1.5,
                  textTransform: 'uppercase', borderRadius: 2, border: 'none', cursor: 'pointer',
                  background: mode === m ? 'rgba(0,168,255,0.2)' : 'transparent',
                  color: mode === m ? '#00a8ff' : 'rgba(192,200,216,0.4)',
                }}>
                {m === 'login' ? 'LOG IN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input className="fn-input" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)} />
            )}
            <input className="fn-input" placeholder="Email" type="email" value={email}
              onChange={e => setEmail(e.target.value)} />
            <input className="fn-input" placeholder="Password" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>

          {error && (
            <div className="mt-3 p-3 text-sm" style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)', borderRadius: 3, color: '#ff6b6b', fontFamily: 'Barlow', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button onClick={handle} disabled={loading}
            className="fn-btn fn-btn-blue w-full mt-5" style={{ fontSize: 15 }}>
            {loading ? 'LOADING...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </div>
      </div>
    </div>
  )
}
