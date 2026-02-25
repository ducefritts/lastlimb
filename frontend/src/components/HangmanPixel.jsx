import React from 'react'

// Pixel-art style hangman SVG
export default function HangmanPixel({ wrongGuesses = 0, equippedHat = 'none', equippedColor = 'white', equippedAccessory = 'none', equippedGallows = 'classic' }) {
  const maxWrong = 6
  const parts = ['head', 'body', 'left_arm', 'right_arm', 'left_leg', 'right_leg']
  const visibleParts = parts.slice(0, wrongGuesses)

  const gallowsColors = {
    classic: { stroke: '#aaaaaa', glow: 'none' },
    haunted: { stroke: '#9944cc', glow: '0 0 10px #9944cc' },
    neon: { stroke: '#00fff5', glow: '0 0 15px #00fff5' },
    fire: { stroke: '#ff6600', glow: '0 0 15px #ff6600' },
    space: { stroke: '#4488ff', glow: '0 0 10px #4488ff' },
  }

  const bodyColors = {
    white: '#ffffff',
    color_blue: '#00aaff',
    color_red: '#ff2244',
    color_green: '#00ff88',
    color_gold: '#ffbe0b',
    color_purple: '#8338ec',
    color_rainbow: 'url(#rainbowGrad)',
    color_cosmic: 'url(#cosmicGrad)',
  }

  const gc = gallowsColors[equippedGallows] || gallowsColors.classic
  const bodyColor = bodyColors[equippedColor] || '#ffffff'
  const isAlive = wrongGuesses < maxWrong

  const strokeProps = { stroke: gc.stroke, strokeWidth: "3", strokeLinecap: "round", fill: "none" }

  return (
    <svg viewBox="0 0 200 220" width="100%" style={{ maxWidth: 200, filter: gc.glow !== 'none' ? `drop-shadow(0 0 6px ${gc.stroke})` : undefined }}>
      <defs>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff006e" />
          <stop offset="33%" stopColor="#ffbe0b" />
          <stop offset="66%" stopColor="#06d6a0" />
          <stop offset="100%" stopColor="#8338ec" />
        </linearGradient>
        <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f3460" />
          <stop offset="50%" stopColor="#8338ec" />
          <stop offset="100%" stopColor="#00fff5" />
        </linearGradient>
      </defs>

      {/* GALLOWS */}
      <line x1="20" y1="210" x2="180" y2="210" {...strokeProps} strokeWidth="4" />
      <line x1="60" y1="210" x2="60" y2="10" {...strokeProps} strokeWidth="4" />
      <line x1="60" y1="10" x2="130" y2="10" {...strokeProps} strokeWidth="4" />
      <line x1="130" y1="10" x2="130" y2="40" {...strokeProps} strokeWidth="3" />

      {/* ROPE KNOT */}
      <rect x="126" y="38" width="8" height="4" fill={gc.stroke} opacity="0.5" />

      {/* HEAD */}
      {visibleParts.includes('head') && (
        <g>
          <rect x="114" y="42" width="32" height="32" fill="none" stroke={bodyColor} strokeWidth="3"
            style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
          {/* Eyes - Xs when dead */}
          {wrongGuesses >= 6 ? (
            <>
              <line x1="120" y1="50" x2="125" y2="55" stroke="#ff4444" strokeWidth="2" />
              <line x1="125" y1="50" x2="120" y2="55" stroke="#ff4444" strokeWidth="2" />
              <line x1="132" y1="50" x2="137" y2="55" stroke="#ff4444" strokeWidth="2" />
              <line x1="137" y1="50" x2="132" y2="55" stroke="#ff4444" strokeWidth="2" />
            </>
          ) : (
            <>
              <rect x="121" y="51" width="4" height="4" fill={bodyColor} />
              <rect x="133" y="51" width="4" height="4" fill={bodyColor} />
            </>
          )}
          {/* Mouth */}
          {wrongGuesses >= 6
            ? <line x1="121" y1="65" x2="138" y2="65" stroke="#ff4444" strokeWidth="2" />
            : <line x1="121" y1="66" x2="138" y2="62" stroke={bodyColor} strokeWidth="2" />
          }
        </g>
      )}

      {/* BODY */}
      {visibleParts.includes('body') && (
        <line x1="130" y1="74" x2="130" y2="130" stroke={bodyColor} strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
      )}

      {/* LEFT ARM */}
      {visibleParts.includes('left_arm') && (
        <line x1="130" y1="90" x2="105" y2="115" stroke={bodyColor} strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
      )}

      {/* RIGHT ARM */}
      {visibleParts.includes('right_arm') && (
        <line x1="130" y1="90" x2="155" y2="115" stroke={bodyColor} strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
      )}

      {/* LEFT LEG */}
      {visibleParts.includes('left_leg') && (
        <line x1="130" y1="130" x2="108" y2="160" stroke={bodyColor} strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
      )}

      {/* RIGHT LEG */}
      {visibleParts.includes('right_leg') && (
        <line x1="130" y1="130" x2="152" y2="160" stroke={bodyColor} strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 4px ${bodyColor})` }} />
      )}

      {/* HAT */}
      {visibleParts.includes('head') && equippedHat !== 'none' && (
        <text x="130" y="44" textAnchor="middle" fontSize="18" style={{ userSelect: 'none' }}>
          {equippedHat === 'hat_cap' ? '🧢' :
           equippedHat === 'hat_tophat' ? '🎩' :
           equippedHat === 'hat_wizard' ? '🧙' :
           equippedHat === 'hat_pirate' ? '🏴‍☠️' :
           equippedHat === 'hat_crown_bronze' || equippedHat === 'hat_crown_silver' || equippedHat === 'hat_crown_gold' ? '👑' : ''}
        </text>
      )}

      {/* ACCESSORY */}
      {visibleParts.includes('head') && equippedAccessory !== 'none' && (
        <text x="145" y="68" textAnchor="middle" fontSize="12" style={{ userSelect: 'none' }}>
          {equippedAccessory === 'accessory_glasses' ? '🕶️' :
           equippedAccessory === 'accessory_scarf' ? '🧣' :
           equippedAccessory === 'accessory_monocle' ? '🧐' :
           equippedAccessory === 'accessory_cape' ? '🦸' :
           equippedAccessory === 'accessory_wings' ? '👼' :
           equippedAccessory === 'accessory_halo' ? '😇' : ''}
        </text>
      )}

      {/* Wrong guess counter */}
      <text x="20" y="25" fill={gc.stroke} fontSize="9" fontFamily="'Press Start 2P', monospace">
        {wrongGuesses}/{maxWrong}
      </text>
    </svg>
  )
}
