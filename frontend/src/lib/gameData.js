// ============================================
// ALL 30 UNLOCKABLE ITEMS
// ============================================
export const ALL_UNLOCKABLES = [
  // COLORS (7)
  { id: 'color_blue',    name: 'Electric Blue',  type: 'color',     slot: 'color',     value: '#00aaff', emoji: '🔵', rarity: 'common',    gem_price: 150 },
  { id: 'color_red',     name: 'Blood Red',      type: 'color',     slot: 'color',     value: '#ff2244', emoji: '🔴', rarity: 'common',    gem_price: 150 },
  { id: 'color_green',   name: 'Matrix Green',   type: 'color',     slot: 'color',     value: '#00ff88', emoji: '🟢', rarity: 'common',    gem_price: 150 },
  { id: 'color_gold',    name: 'Gold Rush',      type: 'color',     slot: 'color',     value: '#ffbe0b', emoji: '🟡', rarity: 'rare',      gem_price: 300 },
  { id: 'color_purple',  name: 'Deep Purple',    type: 'color',     slot: 'color',     value: '#8338ec', emoji: '🟣', rarity: 'rare',      gem_price: 300 },
  { id: 'color_rainbow', name: 'Rainbow',        type: 'color',     slot: 'color',     value: 'rainbow', emoji: '🌈', rarity: 'epic',      gem_price: 600 },
  { id: 'color_cosmic',  name: 'Cosmic',         type: 'color',     slot: 'color',     value: 'cosmic',  emoji: '🌌', rarity: 'legendary', gem_price: 1000 },

  // HATS (7)
  { id: 'hat_cap',       name: 'Baseball Cap',   type: 'hat',       slot: 'hat',       emoji: '🧢', rarity: 'common',    gem_price: 200 },
  { id: 'hat_tophat',    name: 'Top Hat',        type: 'hat',       slot: 'hat',       emoji: '🎩', rarity: 'common',    gem_price: 200 },
  { id: 'hat_wizard',    name: 'Wizard Hat',     type: 'hat',       slot: 'hat',       emoji: '🧙', rarity: 'rare',      gem_price: 400 },
  { id: 'hat_pirate',    name: 'Pirate Hat',     type: 'hat',       slot: 'hat',       emoji: '🏴‍☠️', rarity: 'rare',     gem_price: 400 },
  { id: 'hat_crown_bronze', name: 'Bronze Crown', type: 'hat',      slot: 'hat',       emoji: '👑', rarity: 'rare',      gem_price: 500 },
  { id: 'hat_crown_silver', name: 'Silver Crown', type: 'hat',      slot: 'hat',       emoji: '👑', rarity: 'epic',      gem_price: 750 },
  { id: 'hat_crown_gold',   name: 'Gold Crown',   type: 'hat',      slot: 'hat',       emoji: '👑', rarity: 'legendary', gem_price: 1200 },

  // ACCESSORIES (6)
  { id: 'accessory_glasses', name: 'Cool Glasses',  type: 'accessory', slot: 'accessory', emoji: '🕶️', rarity: 'common', gem_price: 175 },
  { id: 'accessory_scarf',   name: 'Scarf',         type: 'accessory', slot: 'accessory', emoji: '🧣', rarity: 'common', gem_price: 175 },
  { id: 'accessory_monocle', name: 'Monocle',       type: 'accessory', slot: 'accessory', emoji: '🧐', rarity: 'rare',   gem_price: 350 },
  { id: 'accessory_cape',    name: 'Cape',          type: 'accessory', slot: 'accessory', emoji: '🦸', rarity: 'rare',   gem_price: 400 },
  { id: 'accessory_wings',   name: 'Angel Wings',   type: 'accessory', slot: 'accessory', emoji: '👼', rarity: 'epic',   gem_price: 700 },
  { id: 'accessory_halo',    name: 'Halo',          type: 'accessory', slot: 'accessory', emoji: '😇', rarity: 'epic',   gem_price: 800 },

  // GALLOWS THEMES (4)
  { id: 'gallows_haunted', name: 'Haunted',      type: 'gallows',  slot: 'gallows',  emoji: '👻', rarity: 'rare',      gem_price: 400 },
  { id: 'gallows_neon',    name: 'Neon City',    type: 'gallows',  slot: 'gallows',  emoji: '🌆', rarity: 'epic',      gem_price: 650 },
  { id: 'gallows_fire',    name: 'Inferno',      type: 'gallows',  slot: 'gallows',  emoji: '🔥', rarity: 'epic',      gem_price: 700 },
  { id: 'gallows_space',   name: 'Deep Space',   type: 'gallows',  slot: 'gallows',  emoji: '🚀', rarity: 'legendary', gem_price: 1000 },

  // FONTS (5)
  { id: 'font_neon',    name: 'Neon Glow',  type: 'font', slot: 'font', emoji: '💡', rarity: 'common', gem_price: 200 },
  { id: 'font_gothic',  name: 'Gothic',     type: 'font', slot: 'font', emoji: '⚰️', rarity: 'common', gem_price: 200 },
  { id: 'font_bubbly',  name: 'Bubbly',     type: 'font', slot: 'font', emoji: '🫧', rarity: 'rare',   gem_price: 300 },
  { id: 'font_pixel',   name: 'Pixel Pro',  type: 'font', slot: 'font', emoji: '🎮', rarity: 'rare',   gem_price: 350 },
  { id: 'font_horror',  name: 'Horror',     type: 'font', slot: 'font', emoji: '🩸', rarity: 'epic',   gem_price: 500 },

  // SPECIAL (1)
  { id: 'skin_legendary', name: 'Legendary Skin', type: 'skin', slot: 'skin', emoji: '⭐', rarity: 'legendary', gem_price: 2000 },
];

// ============================================
// SEASON PASS - 30 TIERS (16 free, 14 paid)
// ============================================
export const SEASON_PASS_TIERS = [
  { tier: 1,  free: { type: 'gems', amount: 50 },            paid: { type: 'item', id: 'hat_cap' } },
  { tier: 2,  free: { type: 'item', id: 'color_blue' },      paid: { type: 'gems', amount: 100 } },
  { tier: 3,  free: { type: 'gems', amount: 75 },            paid: { type: 'item', id: 'accessory_glasses' } },
  { tier: 4,  free: { type: 'item', id: 'hat_cap' },         paid: { type: 'item', id: 'font_neon' } },
  { tier: 5,  free: { type: 'gems', amount: 100 },           paid: { type: 'gems', amount: 150 } },
  { tier: 6,  free: { type: 'item', id: 'accessory_glasses' }, paid: { type: 'item', id: 'hat_tophat' } },
  { tier: 7,  free: { type: 'gems', amount: 100 },           paid: { type: 'item', id: 'color_green' } },
  { tier: 8,  free: { type: 'item', id: 'color_red' },       paid: { type: 'gems', amount: 200 } },
  { tier: 9,  free: { type: 'gems', amount: 150 },           paid: { type: 'item', id: 'accessory_scarf' } },
  { tier: 10, free: { type: 'item', id: 'hat_crown_bronze' }, paid: { type: 'item', id: 'font_gothic' } },
  { tier: 11, free: { type: 'gems', amount: 150 },           paid: { type: 'gems', amount: 250 } },
  { tier: 12, free: { type: 'item', id: 'gallows_haunted' }, paid: { type: 'item', id: 'color_purple' } },
  { tier: 13, free: { type: 'gems', amount: 200 },           paid: { type: 'item', id: 'accessory_monocle' } },
  { tier: 14, free: { type: 'item', id: 'accessory_scarf' }, paid: { type: 'gems', amount: 300 } },
  { tier: 15, free: { type: 'gems', amount: 200 },           paid: { type: 'item', id: 'hat_pirate' } },
  { tier: 16, free: { type: 'item', id: 'color_gold' },      paid: { type: 'item', id: 'font_bubbly' } },
  // PAID ONLY from tier 17
  { tier: 17, free: null, paid: { type: 'item', id: 'hat_wizard' } },
  { tier: 18, free: null, paid: { type: 'gems', amount: 250 } },
  { tier: 19, free: null, paid: { type: 'item', id: 'color_rainbow' } },
  { tier: 20, free: null, paid: { type: 'item', id: 'accessory_cape' } },
  { tier: 21, free: null, paid: { type: 'gems', amount: 300 } },
  { tier: 22, free: null, paid: { type: 'item', id: 'hat_crown_silver' } },
  { tier: 23, free: null, paid: { type: 'item', id: 'gallows_neon' } },
  { tier: 24, free: null, paid: { type: 'gems', amount: 350 } },
  { tier: 25, free: null, paid: { type: 'item', id: 'accessory_wings' } },
  { tier: 26, free: null, paid: { type: 'item', id: 'color_cosmic' } },
  { tier: 27, free: null, paid: { type: 'gems', amount: 400 } },
  { tier: 28, free: null, paid: { type: 'item', id: 'hat_crown_gold' } },
  { tier: 29, free: null, paid: { type: 'item', id: 'gallows_fire' } },
  { tier: 30, free: null, paid: { type: 'item', id: 'skin_legendary', bonus_gems: 500 } },
];

// ============================================
// GEM PACKS
// ============================================
export const GEM_PACKS = [
  { id: 'gems_100',  name: 'Starter Pack',  gems: 100,  price: '$0.99',  price_cents: 99,   bonus: null,        popular: false },
  { id: 'gems_500',  name: 'Explorer Pack', gems: 500,  price: '$3.99',  price_cents: 399,  bonus: '+50 bonus', popular: false },
  { id: 'gems_1200', name: 'Champion Pack', gems: 1200, price: '$7.99',  price_cents: 799,  bonus: '+200 bonus', popular: true },
  { id: 'gems_2500', name: 'Legend Pack',   gems: 2500, price: '$14.99', price_cents: 1499, bonus: '+500 bonus', popular: false },
];

export const RARITY_COLORS = {
  common: '#aaaaaa',
  rare: '#00aaff',
  epic: '#8338ec',
  legendary: '#ffbe0b',
};

export const getItemById = (id) => ALL_UNLOCKABLES.find(i => i.id === id);
