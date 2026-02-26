import React from 'react'

const SKIN_TONES = {
  // Tan shades
  tan_1:    { fill: '#f5e6d0', stroke: '#d4b896' },
  tan_2:    { fill: '#e8c99a', stroke: '#c4a060' },
  tan_3:    { fill: '#d4a96a', stroke: '#aa7a3a' },
  // Brown shades
  brown_1:  { fill: '#c68642', stroke: '#9a5f20' },
  brown_2:  { fill: '#8d5524', stroke: '#6b3a10' },
  brown_3:  { fill: '#5c3317', stroke: '#3d1f08' },
  // Yellowish tan
  yellow_1: { fill: '#f0d9a0', stroke: '#c8aa60' },
  yellow_2: { fill: '#e8c870', stroke: '#c0a040' },
  yellow_3: { fill: '#d4aa50', stroke: '#aa7e20' },
}

const HAIR_STYLES = {
  short:       'short',
  long:        'long',
  curly:       'curly',
  mohawk:      'mohawk',
  bald:        'bald',
  ponytail:    'ponytail',
  spiky:       'spiky',
  afro:        'afro',
}

const HAIR_COLORS = {
  black:  '#1a0a00',
  brown:  '#5c3317',
  blonde: '#d4a030',
  orange: '#cc5500',
}

const SHIRT_COLORS = {
  blue:   { fill: '#2a3a8a', stroke: '#1a2a6a' },
  red:    { fill: '#8a2a2a', stroke: '#6a1a1a' },
  yellow: { fill: '#8a7a10', stroke: '#6a5a00' },
  black:  { fill: '#1a1a1a', stroke: '#000000' },
  white:  { fill: '#e8e8e8', stroke: '#c0c0c0' },
}

const PANTS_COLORS = {
  navy:   { fill: '#1a2540', stroke: '#0a1020' },
  blue:   { fill: '#2a3a8a', stroke: '#1a2a6a' },
  red:    { fill: '#8a2a2a', stroke: '#6a1a1a' },
  yellow: { fill: '#8a7a10', stroke: '#6a5a00' },
  black:  { fill: '#1a1a1a', stroke: '#000000' },
  white:  { fill: '#e8e8e8', stroke: '#c0c0c0' },
}

const GALLOWS_COLORS = {
  classic: { stroke: '#8899aa', glow: null },
  haunted: { stroke: '#9944cc', glow: '#9944cc' },
  neon:    { stroke: '#00fff5', glow: '#00fff5' },
  fire:    { stroke: '#ff6600', glow: '#ff6600' },
  space:   { stroke: '#4488ff', glow: '#4488ff' },
}

function HairPath({ style, color, cx = 130, headTop = 54 }) {
  const hc = HAIR_COLORS[color] || HAIR_COLORS.brown
  const baseProps = { fill: hc, stroke: '#00000066', strokeWidth: 1.5 }

  if (style === 'bald') return null

  if (style === 'short') return (
    <path d={`M${cx-22} ${headTop+14} Q${cx-20} ${headTop-2} ${cx} ${headTop-4} Q${cx+20} ${headTop-2} ${cx+22} ${headTop+14} Q${cx+18} ${headTop+4} ${cx} ${headTop+2} Q${cx-18} ${headTop+4} ${cx-22} ${headTop+14} Z`}
      {...baseProps} />
  )

  if (style === 'long') return (
    <g>
      <path d={`M${cx-22} ${headTop+14} Q${cx-20} ${headTop-2} ${cx} ${headTop-4} Q${cx+20} ${headTop-2} ${cx+22} ${headTop+14} Z`} {...baseProps} />
      <path d={`M${cx-22} ${headTop+14} Q${cx-28} ${headTop+40} ${cx-20} ${headTop+65}`} fill="none" stroke={hc} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${cx+22} ${headTop+14} Q${cx+28} ${headTop+40} ${cx+20} ${headTop+65}`} fill="none" stroke={hc} strokeWidth={8} strokeLinecap="round" />
    </g>
  )

  if (style === 'curly') return (
    <g>
      <path d={`M${cx-22} ${headTop+14} Q${cx-20} ${headTop-2} ${cx} ${headTop-4} Q${cx+20} ${headTop-2} ${cx+22} ${headTop+14} Z`} {...baseProps} />
      {[-18,-8,0,8,18].map((x, i) => (
        <circle key={i} cx={cx+x} cy={headTop} r={5} {...baseProps} />
      ))}
    </g>
  )

  if (style === 'mohawk') return (
    <g>
      <path d={`M${cx-8} ${headTop+8} L${cx-4} ${headTop-18} L${cx} ${headTop-24} L${cx+4} ${headTop-18} L${cx+8} ${headTop+8} Z`} {...baseProps} />
    </g>
  )

  if (style === 'ponytail') return (
    <g>
      <path d={`M${cx-22} ${headTop+14} Q${cx-20} ${headTop-2} ${cx} ${headTop-4} Q${cx+20} ${headTop-2} ${cx+22} ${headTop+14} Z`} {...baseProps} />
      <path d={`M${cx+18} ${headTop+10} Q${cx+35} ${headTop+20} ${cx+30} ${headTop+50}`} fill="none" stroke={hc} strokeWidth={7} strokeLinecap="round" />
      <circle cx={cx+30} cy={headTop+52} r={4} fill={hc} />
    </g>
  )

  if (style === 'spiky') return (
    <g>
      {[-16,-8,0,8,16].map((x, i) => (
        <path key={i} d={`M${cx+x-5} ${headTop+8} L${cx+x} ${headTop-12-i*2} L${cx+x+5} ${headTop+8} Z`} {...baseProps} />
      ))}
    </g>
  )

  if (style === 'afro') return (
    <circle cx={cx} cy={headTop+4} r={26} {...baseProps} />
  )

  return null
}

function MouthPath({ style, cx = 130, cy = 88, skinStroke }) {
  if (style === 'happy') return (
    <path d={`M${cx-8} ${cy} Q${cx} ${cy+7} ${cx+8} ${cy}`} fill="none" stroke={skinStroke} strokeWidth={2} strokeLinecap="round" />
  )
  if (style === 'sad') return (
    <path d={`M${cx-8} ${cy+5} Q${cx} ${cy-2} ${cx+8} ${cy+5}`} fill="none" stroke={skinStroke} strokeWidth={2} strokeLinecap="round" />
  )
  if (style === 'straight') return (
    <line x1={cx-8} y1={cy+2} x2={cx+8} y2={cy+2} stroke={skinStroke} strokeWidth={2} strokeLinecap="round" />
  )
  if (style === 'open') return (
    <ellipse cx={cx} cy={cy+2} rx={7} ry={5} fill="#1a0a0a" stroke={skinStroke} strokeWidth={2} />
  )
  if (style === 'tongue') return (
    <g>
      <ellipse cx={cx} cy={cy+2} rx={7} ry={5} fill="#1a0a0a" stroke={skinStroke} strokeWidth={2} />
      <ellipse cx={cx} cy={cy+6} rx={4} ry={3} fill="#ff6688" stroke="#cc4466" strokeWidth={1} />
    </g>
  )
  if (style === 'buckteeth') return (
    <g>
      <path d={`M${cx-8} ${cy} Q${cx} ${cy+7} ${cx+8} ${cy}`} fill="none" stroke={skinStroke} strokeWidth={2} strokeLinecap="round" />
      <rect x={cx-5} y={cy} width={4} height={5} fill="white" stroke="#ccc" strokeWidth={1} />
      <rect x={cx+1} y={cy} width={4} height={5} fill="white" stroke="#ccc" strokeWidth={1} />
    </g>
  )
  return null
}

export default function HangmanPixel({
  wrongGuesses = 0,
  equippedHat = 'none',
  equippedColor = 'white',
  equippedAccessory = 'none',
  equippedGallows = 'classic',
  skinTone = 'tan_2',
  eyeColor = '#4a90d9',
  mouthStyle = 'happy',
  hairStyle = 'short',
  hairColor = 'brown',
  shirtColor = 'blue',
  pantsColor = 'navy',
  size = 200,
}) {
  const maxWrong = 6
  const remainingParts = maxWrong - wrongGuesses
  const showRightLeg  = remainingParts >= 1
  const showLeftLeg   = remainingParts >= 2
  const showRightArm  = remainingParts >= 3
  const showLeftArm   = remainingParts >= 4
  const showBody      = remainingParts >= 5
  const showHead      = remainingParts >= 6
  const isDead        = wrongGuesses >= maxWrong

  const gc     = GALLOWS_COLORS[equippedGallows] || GALLOWS_COLORS.classic
  const skin   = SKIN_TONES[skinTone] || SKIN_TONES.tan_2
  const shirt  = SHIRT_COLORS[shirtColor] || SHIRT_COLORS.blue
  const pants  = PANTS_COLORS[pantsColor] || PANTS_COLORS.navy

  const gallowsStyle = {
    stroke: gc.stroke, strokeWidth: 4, strokeLinecap: 'round', fill: 'none',
    filter: gc.glow ? `drop-shadow(0 0 4px ${gc.glow})` : undefined
  }
  const bodyStroke = { stroke: skin.fill, strokeWidth: 3, strokeLinecap: 'round', fill: 'none' }

  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="skinHL" cx="38%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* GALLOWS */}
      <line x1="10" y1="235" x2="100" y2="235" {...gallowsStyle} strokeWidth={5} />
      <line x1="40" y1="235" x2="40"  y2="10"  {...gallowsStyle} strokeWidth={5} />
      <line x1="40" y1="10"  x2="130" y2="10"  {...gallowsStyle} strokeWidth={5} />
      <line x1="130" y1="10" x2="130" y2="38"  {...gallowsStyle} strokeWidth={3} />
      <rect x="126" y="36" width="8" height="5" rx="1" fill={gc.stroke} opacity="0.7" />

      {/* RIGHT LEG */}
      {showRightLeg && (
        <g>
          <path d={`M130 170 L145 212 L156 212 L142 170 Z`} fill={pants.fill} stroke={pants.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx="151" cy="214" rx="10" ry="5" fill="#222" stroke="#000" strokeWidth={2} />
          <line x1="133" y1="175" x2="143" y2="207" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        </g>
      )}

      {/* LEFT LEG */}
      {showLeftLeg && (
        <g>
          <path d={`M130 170 L115 212 L104 212 L118 170 Z`} fill={pants.fill} stroke={pants.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx="109" cy="214" rx="10" ry="5" fill="#222" stroke="#000" strokeWidth={2} />
          <line x1="127" y1="175" x2="117" y2="207" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        </g>
      )}

      {/* RIGHT ARM */}
      {showRightArm && (
        <g>
          <path d="M148 105 L165 138 L158 141 L142 108 Z" fill={shirt.fill} stroke={shirt.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M165 138 L172 158 L163 160 L158 141 Z" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} strokeLinejoin="round" />
          <circle cx="168" cy="161" r="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
        </g>
      )}

      {/* LEFT ARM */}
      {showLeftArm && (
        <g>
          <path d="M112 105 L95 138 L102 141 L118 108 Z" fill={shirt.fill} stroke={shirt.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M95 138 L88 158 L97 160 L102 141 Z" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} strokeLinejoin="round" />
          <circle cx="92" cy="161" r="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
        </g>
      )}

      {/* BODY */}
      {showBody && (
        <g>
          {equippedAccessory === 'accessory_cape' && (
            <path d="M112 108 Q100 150 108 183 Q130 193 152 183 Q160 150 148 108 Z" fill="#6600cc" stroke="#4400aa" strokeWidth={2} opacity={0.9} />
          )}
          <path d="M112 105 Q110 140 112 170 L148 170 Q150 140 148 105 Z" fill={shirt.fill} stroke={shirt.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M125 105 L130 115 L135 105" fill="none" stroke={shirt.stroke} strokeWidth={2} />
          <path d="M116 110 Q115 140 117 165" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
          <rect x="124" y="96" width="12" height="12" rx="3" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
          <rect x="112" y="163" width="36" height="7" rx="2" fill="#333" stroke="#111" strokeWidth={1.5} />
          <rect x="128" y="164" width="5" height="5" rx="1" fill="#888" stroke="#555" strokeWidth={1} />
          {equippedAccessory === 'accessory_scarf' && (
            <g>
              <path d="M110 98 Q130 104 150 98 Q148 108 130 110 Q112 108 110 98 Z" fill="#cc2244" stroke="#881122" strokeWidth={2} />
              <path d="M136 106 L140 128 L132 128 L130 110 Z" fill="#cc2244" stroke="#881122" strokeWidth={1.5} />
            </g>
          )}
        </g>
      )}

      {/* HEAD */}
      {showHead && (
        <g>
          {/* Angel wings behind body */}
          {equippedAccessory === 'accessory_wings' && (
            <g style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
              <path d="M108 110 Q80 90 85 120 Q90 140 108 130 Z" fill="white" stroke="#ddd" strokeWidth={2} />
              <path d="M152 110 Q180 90 175 120 Q170 140 152 130 Z" fill="white" stroke="#ddd" strokeWidth={2} />
            </g>
          )}

          <ellipse cx="130" cy="78" rx="22" ry="24" fill={skin.fill} stroke={skin.stroke} strokeWidth={3} />
          <ellipse cx="122" cy="70" rx="8" ry="7" fill="url(#skinHL)" />

          {isDead ? (
            <>
              <line x1="121" y1="72" x2="127" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="127" y1="72" x2="121" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="133" y1="72" x2="139" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <line x1="139" y1="72" x2="133" y2="78" stroke="#ff2244" strokeWidth={2.5} strokeLinecap="round" />
              <path d="M122 88 Q130 84 138 88" fill="none" stroke="#ff2244" strokeWidth={2} strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Eyes */}
              <ellipse cx="124" cy="75" rx="4" ry="4.5" fill="white" stroke={skin.stroke} strokeWidth={1} />
              <ellipse cx="136" cy="75" rx="4" ry="4.5" fill="white" stroke={skin.stroke} strokeWidth={1} />
              <ellipse cx="124" cy="75" rx="2.5" ry="3" fill={eyeColor} />
              <ellipse cx="136" cy="75" rx="2.5" ry="3" fill={eyeColor} />
              <circle cx="124" cy="74" r="1.5" fill="#111" />
              <circle cx="136" cy="74" r="1.5" fill="#111" />
              <circle cx="124.8" cy="73.2" r="0.8" fill="white" />
              <circle cx="136.8" cy="73.2" r="0.8" fill="white" />
              {/* Mouth */}
              <MouthPath style={mouthStyle} cx={130} cy={87} skinStroke={skin.stroke} />
            </>
          )}

          {/* Ears */}
          <ellipse cx="108" cy="78" rx="4" ry="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />
          <ellipse cx="152" cy="78" rx="4" ry="6" fill={skin.fill} stroke={skin.stroke} strokeWidth={2} />

          {/* Hair */}
          <HairPath style={hairStyle} color={hairColor} cx={130} headTop={54} />

          {/* HAT — drawn on top of hair */}
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

          {/* ACCESSORY on face */}
          {equippedAccessory === 'accessory_glasses' && (
            <g>
              <circle cx="124" cy="75" r="6" fill="rgba(100,200,255,0.2)" stroke="#111" strokeWidth={2.5} />
              <circle cx="136" cy="75" r="6" fill="rgba(100,200,255,0.2)" stroke="#111" strokeWidth={2.5} />
              <line x1="130" y1="75" x2="130" y2="75" stroke="#111" strokeWidth={2} />
              <line x1="108" y1="73" x2="118" y2="75" stroke="#111" strokeWidth={2} />
              <line x1="142" y1="75" x2="152" y2="73" stroke="#111" strokeWidth={2} />
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
        </g>
      )}

      {/* Wrong counter */}
      <text x="14" y="26" fill={gc.stroke} fontSize="10" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" letterSpacing="1">
        {wrongGuesses}/{maxWrong}
      </text>
    </svg>
  )
}
