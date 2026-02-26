import React, { useState } from 'react'
import { useStore } from '../lib/store'
import HangmanPixel from '../components/HangmanPixel'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const WORD_LISTS = {
  easy: [
    { word: 'cat', category: 'Animals' },
    { word: 'dog', category: 'Animals' },
    { word: 'sun', category: 'Nature' },
    { word: 'hat', category: 'Clothing' },
    { word: 'map', category: 'Objects' },
    { word: 'cup', category: 'Objects' },
    { word: 'bed', category: 'Furniture' },
    { word: 'car', category: 'Vehicles' },
    { word: 'fish', category: 'Animals' },
    { word: 'bird', category: 'Animals' },
    { word: 'tree', category: 'Nature' },
    { word: 'book', category: 'Objects' },
    { word: 'cake', category: 'Food' },
    { word: 'door', category: 'Objects' },
    { word: 'fire', category: 'Nature' },
    { word: 'gold', category: 'Materials' },
    { word: 'hand', category: 'Body' },
    { word: 'jump', category: 'Actions' },
    { word: 'king', category: 'People' },
    { word: 'lake', category: 'Nature' },
    { word: 'moon', category: 'Space' },
    { word: 'nose', category: 'Body' },
    { word: 'open', category: 'Actions' },
    { word: 'park', category: 'Places' },
    { word: 'rain', category: 'Weather' },
    { word: 'ship', category: 'Vehicles' },
    { word: 'star', category: 'Space' },
    { word: 'time', category: 'Concepts' },
    { word: 'wave', category: 'Nature' },
    { word: 'wind', category: 'Weather' },
  ],
  medium: [
    { word: 'bridge', category: 'Structures' },
    { word: 'castle', category: 'Structures' },
    { word: 'danger', category: 'Concepts' },
    { word: 'empire', category: 'Concepts' },
    { word: 'forest', category: 'Nature' },
    { word: 'garden', category: 'Nature' },
    { word: 'harbor', category: 'Places' },
    { word: 'island', category: 'Geography' },
    { word: 'jungle', category: 'Nature' },
    { word: 'knight', category: 'People' },
    { word: 'lantern', category: 'Objects' },
    { word: 'marble', category: 'Materials' },
    { word: 'needle', category: 'Objects' },
    { word: 'orange', category: 'Food' },
    { word: 'palace', category: 'Structures' },
    { word: 'planet', category: 'Space' },
    { word: 'rabbit', category: 'Animals' },
    { word: 'saddle', category: 'Objects' },
    { word: 'shadow', category: 'Concepts' },
    { word: 'silver', category: 'Materials' },
    { word: 'spider', category: 'Animals' },
    { word: 'summer', category: 'Seasons' },
    { word: 'throne', category: 'Furniture' },
    { word: 'tigers', category: 'Animals' },
    { word: 'tunnel', category: 'Structures' },
    { word: 'valley', category: 'Geography' },
    { word: 'velvet', category: 'Materials' },
    { word: 'winter', category: 'Seasons' },
    { word: 'wisdom', category: 'Concepts' },
    { word: 'zombie', category: 'Fantasy' },
  ],
  hard: [
    { word: 'alchemy', category: 'Science' },
    { word: 'blizzard', category: 'Weather' },
    { word: 'calendar', category: 'Objects' },
    { word: 'conquest', category: 'History' },
    { word: 'diameter', category: 'Math' },
    { word: 'elephant', category: 'Animals' },
    { word: 'fracture', category: 'Science' },
    { word: 'gravity', category: 'Science' },
    { word: 'horizon', category: 'Nature' },
    { word: 'jealousy', category: 'Emotions' },
    { word: 'labyrinth', category: 'Structures' },
    { word: 'magnetic', category: 'Science' },
    { word: 'nitrogen', category: 'Science' },
    { word: 'obstacle', category: 'Concepts' },
    { word: 'pentagon', category: 'Shapes' },
    { word: 'quicksand', category: 'Nature' },
    { word: 'republic', category: 'Politics' },
    { word: 'skeleton', category: 'Body' },
    { word: 'strategy', category: 'Concepts' },
    { word: 'treasure', category: 'Objects' },
    { word: 'umbrella', category: 'Objects' },
    { word: 'vacation', category: 'Concepts' },
    { word: 'volcanic', category: 'Nature' },
    { word: 'warlocks', category: 'Fantasy' },
    { word: 'xenon', category: 'Science' },
    { word: 'yearning', category: 'Emotions' },
    { word: 'zeppelin', category: 'Vehicles' },
    { word: 'absolute', category: 'Concepts' },
    { word: 'bravery', category: 'Emotions' },
    { word: 'crimson', category: 'Colors' },
  ],
  expert: [
    { word: 'abysmal', category: 'Adjectives' },
    { word: 'bequeath', category: 'Actions' },
    { word: 'cataclysm', category: 'Events' },
    { word: 'dystopia', category: 'Concepts' },
    { word: 'epiphany', category: 'Concepts' },
    { word: 'fjord', category: 'Geography' },
    { word: 'gauze', category: 'Materials' },
    { word: 'havoc', category: 'Concepts' },
    { word: 'imbue', category: 'Actions' },
    { word: 'jinx', category: 'Concepts' },
    { word: 'knave', category: 'People' },
    { word: 'lymph', category: 'Biology' },
    { word: 'myrrh', category: 'Plants' },
    { word: 'nymph', category: 'Fantasy' },
    { word: 'oblivion', category: 'Concepts' },
    { word: 'paradigm', category: 'Concepts' },
    { word: 'quorum', category: 'Politics' },
    { word: 'rhapsody', category: 'Music' },
    { word: 'syzygy', category: 'Astronomy' },
    { word: 'tycoon', category: 'People' },
    { word: 'ubiquitous', category: 'Adjectives' },
    { word: 'vortex', category: 'Science' },
    { word: 'whimsy', category: 'Concepts' },
    { word: 'xylophone', category: 'Music' },
    { word: 'yachting', category: 'Sports' },
    { word: 'zealous', category: 'Adjectives' },
    { word: 'abyss', category: 'Nature' },
    { word: 'bazaar', category: 'Places' },
    { word: 'czar', category: 'People' },
    { word: 'dexterity', category: 'Concepts' },
  ],
}

const DIFFICULTY_CONFIG = {
  easy:   { label: 'EASY',   color: '#00e676', maxWrong: 6, description: 'Short common words' },
  medium: { label: 'MEDIUM', color: '#ffd740', maxWrong: 6, description: 'Medium length words' },
  hard:   { label: 'HARD',   color: '#ff9800', maxWrong: 6, description: 'Longer harder words' },
  expert: { label: 'EXPERT', color: '#ff5252', maxWrong: 6, description: 'Rare tricky words' },
}

function getRandomWord(difficulty) {
  const list = WORD_LISTS[difficulty]
  return list[Math.floor(Math.random() * list.length)]
}

export default function PracticePage() {
  const { profile } = useStore()
  const [phase, setPhase] = useState('select')
  const [difficulty, setDifficulty] = useState(null)
  const [word, setWord] = useState('')
  const [category, setCategory] = useState('')
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState({ wins: 0, losses: 0, streak: 0 })

  const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : null
  const maxWrong = 6

  const startGame = (diff) => {
    const { word: w, category: cat } = getRandomWord(diff)
    setDifficulty(diff)
    setWord(w)
    setCategory(cat)
    setGuessedLetters([])
    setWrongGuesses(0)
    setResult(null)
    setPhase('game')
  }

  const guessLetter = (letter) => {
    if (result) return
    const l = letter.toLowerCase()
    if (guessedLetters.includes(l)) return

    const newGuessed = [...guessedLetters, l]
    setGuessedLetters(newGuessed)

    const isCorrect = word.includes(l)
    const newWrong = isCorrect ? wrongGuesses : wrongGuesses + 1
    if (!isCorrect) setWrongGuesses(newWrong)

    const allRevealed = word.split('').every(c => newGuessed.includes(c))
    if (allRevealed) {
      setResult('win')
      setStats(s => ({ ...s, wins: s.wins + 1, streak: s.streak + 1 }))
      setPhase('result')
    } else if (newWrong >= maxWrong) {
      setResult('lose')
      setStats(s => ({ ...s, losses: s.losses + 1, streak: 0 }))
      setPhase('result')
    }
  }

  const displayWord = word.split('').map(l => guessedLetters.includes(l) ? l.toUpperCase() : '_').join(' ')

  if (phase === 'select') return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 100%)' }}>
      <div className="px-5 pt-6 pb-4">
        <div className="fn-heading text-3xl text-white mb-1">PRACTICE</div>
        <div style={{ fontFamily: 'Barlow', fontSize: 14, color: 'rgba(192,200,216,0.4)' }}>Solo mode — no internet required</div>
      </div>

      {stats.wins + stats.losses > 0 && (
        <div className="mx-5 mb-4 fn-card p-4 flex gap-6" style={{ borderRadius: 4 }}>
          <div className="text-center flex-1">
            <div className="fn-heading text-2xl" style={{ color: '#00e676' }}>{stats.wins}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>WINS</div>
          </div>
          <div className="text-center flex-1">
            <div className="fn-heading text-2xl" style={{ color: '#ff5252' }}>{stats.losses}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>LOSSES</div>
          </div>
          <div className="text-center flex-1">
            <div className="fn-heading text-2xl" style={{ color: '#ffd740' }}>{stats.streak}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>STREAK</div>
          </div>
        </div>
      )}

      <div className="px-5 pb-24 flex flex-col gap-3">
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 11, color: 'rgba(192,200,216,0.3)', letterSpacing: 2, marginBottom: 4 }}>SELECT DIFFICULTY</div>
        {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => startGame(key)}
            className="fn-card flex items-center justify-between p-5 transition-all"
            style={{ borderRadius: 4, border: `1px solid ${cfg.color}22`, background: `${cfg.color}08` }}>
            <div className="flex items-center gap-4">
              <div style={{ width: 6, height: 40, background: cfg.color, borderRadius: 3 }} />
              <div>
                <div className="fn-heading text-xl" style={{ color: cfg.color }}>{cfg.label}</div>
                <div style={{ fontFamily: 'Barlow', fontSize: 13, color: 'rgba(192,200,216,0.4)', marginTop: 2 }}>{cfg.description}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 24, color: `${cfg.color}44` }}>▶</div>
          </button>
        ))}
      </div>
    </div>
  )

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 100%)' }}>
      <div className="fn-card p-10 text-center w-full max-w-sm" style={{ borderRadius: 6,
        border: `2px solid ${result === 'win' ? '#00e676' : '#ff5252'}22`,
        background: `radial-gradient(ellipse at 50% 0%, ${result === 'win' ? 'rgba(0,230,118,0.06)' : 'rgba(255,82,82,0.06)'} 0%, transparent 60%)` }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{result === 'win' ? '🎉' : '💀'}</div>
        <div className="fn-heading text-3xl mb-2" style={{ color: result === 'win' ? '#00e676' : '#ff5252' }}>
          {result === 'win' ? 'YOU WIN!' : 'GAME OVER'}
        </div>
        <div style={{ fontFamily: 'Barlow Condensed', fontSize: 13, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, marginBottom: 8 }}>THE WORD WAS</div>
        <div className="fn-heading text-2xl mb-6" style={{ color: 'white', letterSpacing: 6 }}>{word.toUpperCase()}</div>
        <div className="flex gap-2 mb-6">
          <div className="fn-card flex-1 p-3 text-center" style={{ borderRadius: 3 }}>
            <div className="fn-heading text-lg" style={{ color: '#00e676' }}>{stats.wins}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 9, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>WINS</div>
          </div>
          <div className="fn-card flex-1 p-3 text-center" style={{ borderRadius: 3 }}>
            <div className="fn-heading text-lg" style={{ color: '#ffd740' }}>{stats.streak}</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 9, color: 'rgba(192,200,216,0.4)', letterSpacing: 1 }}>STREAK</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startGame(difficulty)} className="fn-btn fn-btn-blue flex-1" style={{ fontSize: 13 }}>
            PLAY AGAIN
          </button>
          <button onClick={() => setPhase('select')} className="fn-btn fn-btn-outline" style={{ fontSize: 13, padding: '10px 16px' }}>
            MENU
          </button>
        </div>
      </div>
    </div>
  )

  const livesLeft = maxWrong - wrongGuesses
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0a101e 100%)' }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button onClick={() => setPhase('select')} style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 12, color: 'rgba(192,200,216,0.4)', letterSpacing: 1, background: 'none', border: 'none', cursor: 'pointer' }}>
          ← QUIT
        </button>
        <div className="fn-badge" style={{ background: `${config.color}22`, color: config.color, border: `1px solid ${config.color}44`, fontSize: 11 }}>
          {config.label}
        </div>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 13, color: livesLeft <= 2 ? '#ff5252' : 'rgba(192,200,216,0.6)' }}>
          ❤️ {livesLeft} LEFT
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 px-4 pb-24">
        <div className="fn-card flex flex-col items-center p-5 md:w-48 flex-shrink-0"
          style={{ borderRadius: 4, background: 'radial-gradient(ellipse at 50% 80%, rgba(0,168,255,0.05) 0%, transparent 60%)' }}>
          <HangmanPixel
            wrongGuesses={wrongGuesses}
            equippedHat={profile?.equipped_hat || 'none'}
            equippedColor={profile?.equipped_color || 'white'}
            equippedAccessory={profile?.equipped_accessory || 'none'}
            equippedGallows={profile?.equipped_gallows || 'classic'}
            skinTone={profile?.skin_tone || 'tan_2'}
            eyeColor={profile?.eye_color || '#4a90d9'}
            mouthStyle={profile?.mouth_style || 'happy'}
            hairStyle={profile?.hair_style || 'short'}
            hairColor={profile?.hair_color || 'brown'}
            shirtColor={profile?.shirt_color || 'blue'}
            pantsColor={profile?.pants_color || 'navy'}
            size={140}
          />
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.3)', letterSpacing: 1, marginTop: 8 }}>CATEGORY</div>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14, color: config.color, marginTop: 2 }}>{category.toUpperCase()}</div>
          <div className="flex gap-1 mt-3 flex-wrap justify-center">
            {Array.from({ length: maxWrong }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < livesLeft ? config.color : 'rgba(192,200,216,0.1)' }} />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="fn-card p-6 flex items-center justify-center flex-1" style={{ borderRadius: 4, minHeight: 100 }}>
            <div style={{
              fontFamily: 'Barlow Condensed', fontWeight: 700,
              fontSize: Math.max(20, Math.min(36, 200 / word.length)),
              color: 'white', letterSpacing: 8, wordBreak: 'break-all', textAlign: 'center'
            }}>
              {displayWord}
            </div>
          </div>

          {guessedLetters.filter(l => !word.includes(l)).length > 0 && (
            <div className="fn-card px-4 py-3" style={{ borderRadius: 4 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(192,200,216,0.3)', letterSpacing: 1, marginBottom: 6 }}>WRONG GUESSES</div>
              <div className="flex gap-2 flex-wrap">
                {guessedLetters.filter(l => !word.includes(l)).map(l => (
                  <span key={l} style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 16, color: '#ff5252' }}>{l.toUpperCase()}</span>
                ))}
              </div>
            </div>
          )}

          <div className="fn-card p-4" style={{ borderRadius: 4 }}>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {LETTERS.map(l => {
                const lower = l.toLowerCase()
                const guessed = guessedLetters.includes(lower)
                const correct = guessed && word.includes(lower)
                const wrong = guessed && !word.includes(lower)
                return (
                  <button key={l} onClick={() => guessLetter(l)} disabled={guessed}
                    style={{
                      width: 34, height: 34, borderRadius: 3,
                      fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 14,
                      cursor: guessed ? 'default' : 'pointer',
                      border: '1px solid',
                      borderColor: correct ? '#00e676' : wrong ? 'rgba(255,82,82,0.2)' : 'rgba(192,200,216,0.15)',
                      background: correct ? 'rgba(0,230,118,0.15)' : wrong ? 'rgba(255,82,82,0.05)' : 'rgba(255,255,255,0.04)',
                      color: correct ? '#00e676' : wrong ? 'rgba(255,82,82,0.3)' : 'rgba(192,200,216,0.8)',
                    }}>
                    {l}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
