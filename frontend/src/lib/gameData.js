const img = (filename) => `https://raw.githubusercontent.com/ducefritts/lastlimb/main/frontend/public/assets/${filename}`

export const FONT_STYLES = {
  font_neon:   { fontFamily: '"Share Tech Mono", monospace', color: '#00fff5', textShadow: '0 0 8px #00fff5' },
  font_gothic:  { fontFamily: 'Georgia, serif', color: '#cc44ff', textShadow: '0 0 6px #cc44ff' },
  font_bubbly:  { fontFamily: '"Comic Sans MS", cursive', color: '#ff69b4', textShadow: 'none' },
  font_pixel:   { fontFamily: '"Press Start 2P", monospace', color: '#ffbe0b', textShadow: '0 0 6px #ffbe0b' },
  font_horror:  { fontFamily: 'Georgia, serif', color: '#ff2244', textShadow: '2px 2px 4px #000, 0 0 10px #ff0000' },
}

export const ALL_UNLOCKABLES = [
  { id: 'color_blue',    name: 'Electric Blue',  type: 'color',     slot: 'color',     value: '#00aaff', image: img('color_blue.png'),    rarity: 'common',    gem_price: 150 },
  { id: 'color_red',     name: 'Blood Red',      type: 'color',     slot: 'color',     value: '#ff2244', image: img('color_red.png'),     rarity: 'common',    gem_price: 150 },
  { id: 'color_green',   name: 'Matrix Green',   type: 'color',     slot: 'color',     value: '#00ff88', image: img('color_green.png'),   rarity: 'common',    gem_price: 150 },
  { id: 'color_gold',    name: 'Gold Rush',      type: 'color',     slot: 'color',     value: '#ffbe0b', image: img('color_gold.png'),    rarity: 'rare',      gem_price: 300 },
  { id: 'color_purple',  name: 'Deep Purple',    type: 'color',     slot: 'color',     value: '#8338ec', image: img('color_purple.png'),  rarity: 'rare',      gem_price: 300 },
  { id: 'color_rainbow', name: 'Rainbow',        type: 'color',     slot: 'color',     value: 'rainbow', image: img('color_rainbow.png'), rarity: 'epic',      gem_price: 600 },
  { id: 'color_cosmic',  name: 'Cosmic',         type: 'color',     slot: 'color',     value: 'cosmic',  image: img('color_cosmic.png'),  rarity: 'legendary', gem_price: 1000 },

  { id: 'hat_cap',          name: 'Baseball Cap', type: 'hat', slot: 'hat', image: img('hat_cap.png'),          rarity: 'common', gem_price: 200 },
  { id: 'hat_tophat',       name: 'Top Hat',      type: 'hat', slot: 'hat', image: img('hat_tophat.png'),       rarity: 'common', gem_price: 200 },
  { id: 'hat_wizard',       name: 'Wizard Hat',   type: 'hat', slot: 'hat', image: img('hat_wizard.png'),       rarity: 'rare',   gem_price: 400 },
  { id: 'hat_pirate',       name: 'Pirate Hat',   type: 'hat', slot: 'hat', image: img('hat_pirate.png'),       rarity: 'rare',   gem_price: 400 },
  { id: 'hat_crown_bronze', name: 'Royal Crown',  type: 'hat', slot: 'hat', image: img('hat_crown_bronze.png'), rarity: 'epic',   gem_price: 750 },

  { id: 'accessory_glasses', name: 'Cool Glasses', type: 'accessory', slot: 'accessory', image: img('accessory_glasses.png'), rarity: 'common', gem_price: 175 },
  { id: 'accessory_scarf',   name: 'Scarf',        type: 'accessory', slot: 'accessory', image: img('accessory_scarf.png'),   rarity: 'common', gem_price: 175 },
  { id: 'accessory_monocle', name: 'Monocle',      type: 'accessory', slot: 'accessory', image: img('accessory_monocle.png'), rarity: 'rare',   gem_price: 350 },
  { id: 'accessory_cape',    name: 'Cape',         type: 'accessory', slot: 'accessory', image: img('accessory_cape.png'),    rarity: 'rare',   gem_price: 400 },
  { id: 'accessory_wings',   name: 'Angel Wings',  type: 'accessory', slot: 'accessory', image: img('accessory_wings.png'),   rarity: 'epic',   gem_price: 700 },
  { id: 'accessory_halo',    name: 'Halo',         type: 'accessory', slot: 'accessory', image: img('accessory_halo.png'),    rarity: 'epic',   gem_price: 800 },

  { id: 'gallows_haunted', name: 'Haunted',    type: 'gallows', slot: 'gallows', image: img('gallows_haunted.png'), rarity: 'rare',      gem_price: 400 },
  { id: 'gallows_neon',    name: 'Neon City',  type: 'gallows', slot: 'gallows', image: img('gallows_neon.png'),    rarity: 'epic',      gem_price: 650 },
  { id: 'gallows_fire',    name: 'Inferno',    type: 'gallows', slot: 'gallows', image: img('gallows_fire.png'),    rarity: 'epic',      gem_price: 700 },
  { id: 'gallows_space',   name: 'Deep Space', type: 'gallows', slot: 'gallows', image: img('gallows_space.png'),   rarity: 'legendary', gem_price: 1000 },

  { id: 'font_neon',   name: 'Neon Glow', type: 'font', slot: 'font', fontPreview: true, rarity: 'common', gem_price: 200 },
  { id: 'font_gothic', name: 'Gothic',    type: 'font', slot: 'font', fontPreview: true, rarity: 'common', gem_price: 200 },
  { id: 'font_bubbly', name: 'Bubbly',    type: 'font', slot: 'font', fontPreview: true, rarity: 'rare',   gem_price: 300 },
  { id: 'font_pixel',  name: 'Pixel Pro', type: 'font', slot: 'font', fontPreview: true, rarity: 'rare',   gem_price: 350 },
  { id: 'font_horror', name: 'Horror',    type: 'font', slot: 'font', fontPreview: true, rarity: 'epic',   gem_price: 500 },

  { id: 'skin_legendary', name: 'Diamond Skin', type: 'skin', slot: 'skin', image: img('skin_legendary.png'), rarity: 'legendary', gem_price: 2000 },
]

export const SEASON_PASS_TIERS = [
  { tier: 1,  free: { type: 'gems', amount: 50 },            paid: { type: 'item', id: 'hat_cap' } },
  { tier: 2,  free: { type: 'item', id: 'color_blue' },      paid: { type: 'gems', amount: 100 } },
  { tier: 3,  free: { type: 'gems', amount: 75 },            paid: { type: 'item', id: 'accessory_glasses' } },
  { tier: 4,  free: { type: 'item', id: 'color_red' },       paid: { type: 'item', id: 'font_neon' } },
  { tier: 5,  free: { type: 'gems', amount: 100 },           paid: { type: 'gems', amount: 150 } },
  { tier: 6,  free: { type: 'item', id: 'accessory_scarf' }, paid: { type: 'item', id: 'hat_tophat' } },
  { tier: 7,  free: { type: 'gems', amount: 100 },           paid: { type: 'item', id: 'color_green' } },
  { tier: 8,  free: { type: 'item', id: 'gallows_haunted' }, paid: { type: 'gems', amount: 200 } },
  { tier: 9,  free: { type: 'gems', amount: 150 },           paid: { type: 'item', id: 'accessory_monocle' } },
  { tier: 10, free: { type: 'item', id: 'color_gold' },      paid: { type: 'item', id: 'font_gothic' } },
  { tier: 11, free: { type: 'gems', amount: 150 },           paid: { type: 'gems', amount: 250 } },
  { tier: 12, free: { type: 'item', id: 'hat_pirate' },      paid: { type: 'item', id: 'color_purple' } },
  { tier: 13, free: { type: 'gems', amount: 200 },           paid: { type: 'item', id: 'accessory_cape' } },
  { tier: 14, free: { type: 'item', id: 'gallows_neon' },    paid: { type: 'gems', amount: 300 } },
  { tier: 15, free: { type: 'gems', amount: 200 },           paid: { type: 'item', id: 'font_bubbly' } },
  { tier: 16, free: { type: 'item', id: 'accessory_wings' }, paid: { type: 'item', id: 'color_rainbow' } },
  { tier: 17, free: null, paid: { type: 'item', id: 'hat_wizard' } },
  { tier: 18, free: null, paid: { type: 'gems', amount: 250 } },
  { tier: 19, free: null, paid: { type: 'item', id: 'gallows_fire' } },
  { tier: 20, free: null, paid: { type: 'item', id: 'accessory_halo' } },
  { tier: 21, free: null, paid: { type: 'gems', amount: 300 } },
  { tier: 22, free: null, paid: { type: 'item', id: 'hat_crown_bronze' } },
  { tier: 23, free: null, paid: { type: 'item', id: 'font_pixel' } },
  { tier: 24, free: null, paid: { type: 'gems', amount: 350 } },
  { tier: 25, free: null, paid: { type: 'item', id: 'color_cosmic' } },
  { tier: 26, free: null, paid: { type: 'item', id: 'gallows_space' } },
  { tier: 27, free: null, paid: { type: 'gems', amount: 400 } },
  { tier: 28, free: null, paid: { type: 'item', id: 'font_horror' } },
  { tier: 29, free: null, paid: { type: 'gems', amount: 500 } },
  { tier: 30, free: null, paid: { type: 'item', id: 'skin_legendary', bonus_gems: 500 } },
]

export const GEM_PACKS = [
  { id: 'gems_100',  name: 'Starter Pack',  gems: 100,  price: '$0.99',  price_cents: 99,   bonus: null,         popular: false },
  { id: 'gems_500',  name: 'Explorer Pack', gems: 500,  price: '$3.99',  price_cents: 399,  bonus: '+50 bonus',  popular: false },
  { id: 'gems_1200', name: 'Champion Pack', gems: 1200, price: '$7.99',  price_cents: 799,  bonus: '+200 bonus', popular: true },
  { id: 'gems_2500', name: 'Legend Pack',   gems: 2500, price: '$14.99', price_cents: 1499, bonus: '+500 bonus', popular: false },
]

export const RARITY_COLORS = {
  common:    '#aaaaaa',
  rare:      '#00aaff',
  epic:      '#8338ec',
  legendary: '#ffbe0b',
}

export const getItemById = (id) => ALL_UNLOCKABLES.find(i => i.id === id)
