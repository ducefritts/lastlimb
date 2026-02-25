import React from 'react'

export default function HangmanPixel({ 
  wrongGuesses = 0, 
  equippedHat = 'none', 
  equippedColor = 'white', 
  equippedAccessory = 'none', 
  equippedGallows = 'classic',
  size = 200
}) {
  const maxWrong = 6
  const remainingParts = maxWrong - wrongGuesses
  const showRightLeg  = remainingParts >= 1
  const showLeftLeg   = remainingParts >= 2
  const showRightArm  = remainingParts >= 3
  const showLeftArm   = remainingParts >= 4
  const showBody      = remainingParts >= 5
  const showHead      = remainingParts >= 6
  const isDead = wrongGuesses >= maxWrong

  const gallowsColors = {
    classic: { stroke: '#8899aa', glow: null },
    haunted: { stroke: '#9944cc', glow: '#9944cc' },
    neon:    { stroke: '#00fff5', glow: '#00fff5' },
    fire:    { stroke: '#ff6600', glow: '#ff6600' },
    space:   { stroke: '#4488ff', glow: '#4488ff' },
  }

  const skinColors = {
    white:         { fill: '#e8d5b0', stroke: '#c4a87a' },
    color_blue:    { fill: '#00aaff', stroke: '#0077cc' },
    color_red:     { fill: '#ff2244', stroke: '#cc0022' },
    color_green:   { fill: '#00ff88', stroke: '#00cc66' },
    color_gold:    { fill: '#ffbe0b', stroke: '#cc9500' },
    color_purple:  { fill: '#8338ec', stroke: '#6020c0' },
    color_rainbow: { fill: 'url(#rainbowGrad)', stroke: '#ff006e' },
    color_cosmic:  { fill: 'url(#cosmicGrad)', stroke: '#8338ec' },
  }

  const gc = gallowsColors[equippedGallows] || gallowsColors.classic
  const skin = skinColors[equippedColor] || skinColors.white

  const gallowsStyle = { 
    stroke: gc.stroke, 
    strokeWidth: 4, 
    strokeLinecap: 'round', 
    fill: 'none',
    filter: gc.glow ? `drop-shadow(0 0 4px ${gc.glow})` : undefined
  }

  // Clothing color based on skin
  const clothFill = '#1a2540'
  const clothStroke = '#0a1020'
  const shirtFill = '#2a3a6a'
  const shirtStroke = '#1a2540'

  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff006e" />
          <stop offset="33%"  stopColor="#ffbe0b" />
          <stop offset="66%"  stopColor="#06d6a0" />
          <stop offset="100%" stopColor="#8338ec" />
        </linearGradient>
        <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0f3460" />
          <stop offset="50%"  stopColor="#8338ec" />
          <stop offset="100%" stopColor="#00fff5" />
        </linearGradient>
        {/* Skin highlight gradient */}
        <radialGradient id="skinHighlight" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ── GALLOWS ── */}
      <line x1="10" y1="235" x2="100" y2="235" {...gallowsStyle} strokeWidth={5} />
      <line x1="40" y1="235" x2="40"  y2="10"  {...gallowsStyle} strokeWidth={5} />
      <line x1="40" y1="10"  x2="130" y2="10"  {...gallowsStyle} strokeWidth={5} />
      <line x1="130" y1="10" x2="130" y2="38"  {...gallowsStyle} strokeWidth={3} />
      {/* Rope knot */}
      <rect x="126" y="36" width="8" height="5" rx="1" fill={gc.stroke} opacity="0.7" />

      {/* ── RIGHT LEG ── */}
      {showRightLeg && (
        <g>
          {/* Pants */}
          <path d="M130 170 L145 210 L155 210 L142 170 Z" fill={clothFill} stroke={clothStroke} strokeWidth={2.5} strokeLinejoin="round" />
          {/* Shoe */}
          <ellipse cx="150" cy="212" rx="10" ry="5" fill="#222" stroke="#000" strokeWidth={2} />
          {/* Pants highlight */}
          <line x1="133" y1="175" x2="143" y2="205" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        </g>
      )}

      {/* ── LEFT LEG ── */}
      {showLeftLeg && (
        <g>
          <path d="M130 170 L115 210 L105 210 L118 170 Z" fill={clothFill} stroke={clothStroke} strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx="110" cy="212" rx="10" ry="5" fill="#222" stroke="#000" strokeWidth={2} />
          <line x1="127" y1="175" x2="117" y2="205" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        </g>
      )}

      {/* ── RIGHT ARM ── */}
      {showRightArm && (
        <g>
          {/* Upper arm */}
          <path d="M148 105 L165 135 L158 138 L142 108 Z" fill={shirtFill} stroke={shirtStroke} strokeWidth={2.5} strokeLinejoin="round" />
          {/* Forearm / hand */}
          <path d="M165 135 L172 155 L163 157 L158 138 Z" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} strokeLinejoin="round" />
          <circle cx="168" cy="158" r="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
        </g>
      )}

      {/* ── LEFT ARM ── */}
      {showLeftArm && (
        <g>
          <path d="M112 105 L95 135 L102 138 L118 108 Z" fill={shirtFill} stroke={shirtStroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M95 135 L88 155 L97 157 L102 138 Z" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} strokeLinejoin="round" />
          <circle cx="92" cy="158" r="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
        </g>
      )}

      {/* ── BODY / TORSO ── */}
      {showBody && (
        <g>
          {/* Shirt body */}
          <path d="M112 105 Q110 140 112 170 L148 170 Q150 140 148 105 Z" fill={shirtFill} stroke={shirtStroke} strokeWidth={2.5} strokeLinejoin="round" />
          {/* Shirt collar */}
          <path d="M125 105 L130 115 L135 105" fill="none" stroke={shirtStroke} strokeWidth={2} />
          {/* Shirt highlight */}
          <path d="M116 110 Q115 140 117 165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Neck */}
          <rect x="124" y="96" width="12" height="12" rx="3" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
          {/* Belt */}
          <rect x="112" y="163" width="36" height="7" rx="2" fill="#333" stroke="#111" strokeWidth={1.5} />
          <rect x="128" y="164" width="5" height="5" rx="1" fill="#888" stroke="#555" strokeWidth={1} />
        </g>
      )}

      {/* ── HEAD ── */}
      {showHead && (
        <g>
          {/* Head shape */}
          <ellipse cx="130" cy="78" rx="22" ry="24" fill={skin.fill} stroke={skin.stroke} strokeWidth={3} />
          {/* Highlight */}
          <ellipse cx="122" cy="70" rx="8" ry="7" fill="url(#skinHighlight)" />

          {isDead ? (
            /* X eyes when dead */
            <>
              <line x1="121" y1="72" x2="127" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="127" y1="72" x2="121" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="133" y1="72" x2="139" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="139" y1="72" x2="133" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <path d="M122 88 Q130 84 138 88" fill="none" stroke="#ff2244" strokeWidth={2} strokeLinecap="round" />
            </>
          ) : (
            /* Normal eyes and smile */
            <>
              {/* Eyes */}
              <ellipse cx="124" cy="75" rx="3.5" ry="4" fill="#1a1a2e" />
              <ellipse cx="136" cy="75" rx="3.5" ry="4" fill="#1a1a2e" />
              {/* Eye shine */}
              <circle cx="125.5" cy="73.5" r="1.2" fill="white" />
              <circle cx="137.5" cy="73.5" r="1.2" fill="white" />
              {/* Smile */}
              <path d="M122 86 Q130 92 138 86" fill="none" stroke={skin.stroke} strokeWidth={2} strokeLinecap="round" />
            </>
          )}

          {/* Ear */}
          <ellipse cx="108" cy="78" rx="4" ry="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
          <ellipse cx="152" cy="78" rx="4" ry="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />

          {/* Hair */}
          <path d="M110 68 Q115 52 130 54 Q145 52 150 68 Q145 58 130 60 Q115 58 110 68 Z" fill="#1a0a00" stroke="#0a0500" strokeWidth={1.5} />

          {/* HAT */}
          {equippedHat === 'hat_cap' && (
            <g>
              <ellipse cx="130" cy="56" rx="24" ry="6" fill="#cc2200" stroke="#881100" strokeWidth={2} />
              <rect x="110" y="44" width="40" height="14" rx="4" fill="#cc2200" stroke="#881100" strokeWidth={2} />
              <ellipse cx="154" cy="57" rx="10" ry="4" fill="#bb1100" stroke="#881100" strokeWidth={1.5} />
              <rect x="126" y="46" width="8" height="4" rx="1" fill="white" stroke="#ccc" strokeWidth={1} />
            </g>
          )}
          {equippedHat === 'hat_tophat' && (
            <g>
              <ellipse cx="130" cy="56" rx="26" ry="6" fill="#111" stroke="#333" strokeWidth={2} />
              <rect x="112" y="22" width="36" height="36" rx="2" fill="#111" stroke="#333" strokeWidth={2} />
              <rect x="114" y="53" width="32" height="4" fill="#222" stroke="#444" strokeWidth={1} />
            </g>
          )}
          {equippedHat === 'hat_wizard' && (
            <g>
              <ellipse cx="130" cy="58" rx="24" ry="6" fill="#4a0080" stroke="#2a0050" strokeWidth={2} />
              <path d="M130 8 L108 58 L152 58 Z" fill="#6600cc" stroke="#4400aa" strokeWidth={2} strokeLinejoin="round" />
              <circle cx="122" cy="40" r="4" fill="#ffd740" stroke="#cc9900" strokeWidth={1.5} />
              <circle cx="138" cy="48" r="3" fill="#ffd740" stroke="#cc9900" strokeWidth={1.5} />
            </g>
          )}
          {equippedHat === 'hat_pirate' && (
            <g>
              <ellipse cx="130" cy="58" rx="26" ry="7" fill="#111" stroke="#333" strokeWidth={2} />
              <path d="M108 56 Q130 36 152 56" fill="#111" stroke="#333" strokeWidth={2} />
              <circle cx="130" cy="50" r="8" fill="white" stroke="#ccc" strokeWidth={1.5} />
              <line x1="124" y1="44" x2="136" y2="56" stroke="#111" strokeWidth={2.5} />
              <line x1="136" y1="44" x2="124" y2="56" stroke="#111" strokeWidth={2.5} />
            </g>
          )}
          {equippedHat === 'hat_crown_bronze' && (
            <g>
              <rect x="110" y="50" width="40" height="10" rx="1" fill="#cd7f32" stroke="#8b5e1a" strokeWidth={2} />
              <polygon points="112,50 118,36 124,50" fill="#cd7f32" stroke="#8b5e1a" strokeWidth={2} />
              <polygon points="124,50 130,34 136,50" fill="#cd7f32" stroke="#8b5e1a" strokeWidth={2} />
              <polygon points="136,50 142,36 148,50" fill="#cd7f32" stroke="#8b5e1a" strokeWidth={2} />
              <circle cx="124" cy="50" r="3" fill="#ff4444" stroke="#cc2222" strokeWidth={1} />
              <circle cx="130" cy="48" r="3" fill="#44ff44" stroke="#22cc22" strokeWidth={1} />
              <circle cx="136" cy="50" r="3" fill="#4444ff" stroke="#2222cc" strokeWidth={1} />
            </g>
          )}

          {/* ACCESSORY */}
          {equippedAccessory === 'accessory_glasses' && (
            <g>
              <circle cx="124" cy="75" r="6" fill="none" stroke="#111" strokeWidth={2.5} />
              <circle cx="136" cy="75" r="6" fill="none" stroke="#111" strokeWidth={2.5} />
              <line x1="130" y1="75" x2="130" y2="75" stroke="#111" strokeWidth={2} />
              <line x1="108" y1="73" x2="118" y2="75" stroke="#111" strokeWidth={2} />
              <line x1="142" y1="75" x2="152" y2="73" stroke="#111" strokeWidth={2} />
              <circle cx="124" cy="75" r="6" fill="rgba(100,200,255,0.2)" stroke="none" />
              <circle cx="136" cy="75" r="6" fill="rgba(100,200,255,0.2)" stroke="none" />
            </g>
          )}
          {equippedAccessory === 'accessory_monocle' && (
            <g>
              <circle cx="136" cy="75" r="7" fill="rgba(100,200,255,0.15)" stroke="#888" strokeWidth={2} />
              <line x1="143" y1="80" x2="150" y2="90" stroke="#888" strokeWidth={1.5} />
            </g>
          )}
          {equippedAccessory === 'accessory_halo' && (
            <ellipse cx="130" cy="52" rx="18" ry="5" fill="none" stroke="#ffd740" strokeWidth={3}
              style={{ filter: 'drop-shadow(0 0 6px #ffd740)' }} />
          )}
          {equippedAccessory === 'accessory_wings' && (
            <g style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
              <path d="M108 110 Q80 90 85 120 Q90 140 108 130 Z" fill="white" stroke="#ddd" strokeWidth={2} />
              <path d="M152 110 Q180 90 175 120 Q170 140 152 130 Z" fill="white" stroke="#ddd" strokeWidth={2} />
            </g>
          )}
          {equippedAccessory === 'accessory_scarf' && (
            <g>
              <path d="M110 98 Q130 104 150 98 Q148 108 130 110 Q112 108 110 98 Z" fill="#cc2244" stroke="#881122" strokeWidth={2} />
              <path d="M136 106 L140 128 L132 128 L130 110 Z" fill="#cc2244" stroke="#881122" strokeWidth={1.5} />
            </g>
          )}
          {equippedAccessory === 'accessory_cape' && showBody && (
            <g>
              <path d="M112 108 Q100 150 108 180 Q130 190 152 180 Q160 150 148 108 Z" fill="#6600cc" stroke="#4400aa" strokeWidth={2} opacity={0.9} />
              <path d="M115 108 Q104 148 112 176" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            </g>
          )}
        </g>
      )}

      {/* Wrong counter */}
      <text x="14" y="26" fill={gc.stroke} fontSize="10" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" letterSpacing="1">
        {wrongGuesses}/{maxWrong}
      </text>
    </svg>
  )
}
