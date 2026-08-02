export const ENERGY_TIERS = [
  { id: 'ev', label: 'eV', name: 'Atomic', colour: '#062f49', nodeSize: 16, glow: 3 },
  { id: 'kev', label: 'keV', name: 'X-ray', colour: '#0a4e74', nodeSize: 20, glow: 6 },
  { id: 'mev', label: 'MeV', name: 'Nuclear', colour: '#0b80c3', nodeSize: 24, glow: 10 },
  { id: 'gev', label: 'GeV', name: 'Particle', colour: '#33b4ec', nodeSize: 28, glow: 15 },
  { id: 'tev', label: 'TeV', name: 'Collider', colour: '#bde8fb', nodeSize: 32, glow: 21 },
] as const

export const ENERGY_TIER_IDS = ENERGY_TIERS.map(tier => tier.id) as [
  EnergyTier,
  ...EnergyTier[],
]

export type EnergyTier = typeof ENERGY_TIERS[number]['id']
export type EnergyTierDefinition = typeof ENERGY_TIERS[number]
