import type { Spell } from '../types/character';

export const SPELLS: Spell[] = [
  // ─── Arcane ──────────────────────────────────────────────────────────────
  {
    id: 'arc-01', name: 'Magic Missile', school: 'Arcane', level: 1,
    castingTime: '1 action', range: '120 ft', duration: 'Instantaneous',
    description: 'Launch 1d4+1 darts of magical force, each dealing 1d4+1 force damage. Each dart hits automatically.',
    higherLevels: 'Spend 1 additional mana per extra dart.',
    tags: ['Damage', 'Force'],
  },
  {
    id: 'arc-02', name: 'Shield', school: 'Arcane', level: 1,
    castingTime: '1 reaction', range: 'Self', duration: '1 round',
    description: '+5 AC until the start of your next turn. Immune to Magic Missile.',
    tags: ['Defense', 'Reaction'],
  },
  {
    id: 'arc-03', name: 'Fireball', school: 'Arcane', level: 3,
    castingTime: '1 action', range: '150 ft', duration: 'Instantaneous',
    description: 'A fiery explosion in a 20 ft radius. Each creature takes 8d6 fire damage (DEX save for half).',
    higherLevels: '+1d6 per extra mana spent.',
    tags: ['Damage', 'Fire', 'Area'],
  },
  {
    id: 'arc-04', name: 'Thunderwave', school: 'Arcane', level: 1,
    castingTime: '1 action', range: 'Self (15 ft cube)', duration: 'Instantaneous',
    description: 'A wave of thunder blasts out. Each creature takes 2d8 thunder damage and is pushed 10 ft (STR save for half, no push).',
    higherLevels: '+1d8 per extra mana spent.',
    tags: ['Damage', 'Thunder', 'Push'],
  },
  {
    id: 'arc-05', name: 'Counterspell', school: 'Arcane', level: 3,
    castingTime: '1 reaction', range: '60 ft', duration: 'Instantaneous',
    description: 'Interrupt a creature casting a spell of level 3 or lower. Higher-level spells require an INT check (DC 10 + spell level).',
    tags: ['Reaction', 'Counter'],
  },
  {
    id: 'arc-06', name: 'Fly', school: 'Arcane', level: 3,
    castingTime: '1 action', range: 'Touch', duration: 'Concentration, 10 min',
    description: 'Target gains a flying speed of 60 ft for the duration.',
    tags: ['Utility', 'Concentration'],
  },
  {
    id: 'arc-07', name: 'Invisibility', school: 'Arcane', level: 2,
    castingTime: '1 action', range: 'Touch', duration: 'Concentration, 1 hour',
    description: 'Target becomes invisible until they attack or cast a spell.',
    higherLevels: 'Spend 2 extra mana to target up to 3 creatures.',
    tags: ['Utility', 'Concentration'],
  },
  {
    id: 'arc-08', name: 'Lightning Bolt', school: 'Arcane', level: 3,
    castingTime: '1 action', range: '100 ft line', duration: 'Instantaneous',
    description: 'A bolt of lightning 5 ft wide, 100 ft long. Each creature takes 8d6 lightning damage (DEX save for half).',
    tags: ['Damage', 'Lightning'],
  },
  // ─── Divine ──────────────────────────────────────────────────────────────
  {
    id: 'div-01', name: 'Cure Wounds', school: 'Divine', level: 1,
    castingTime: '1 action', range: 'Touch', duration: 'Instantaneous',
    description: 'Restore 1d8 + WIL modifier HP to a creature you touch.',
    higherLevels: '+1d8 per extra mana spent.',
    tags: ['Healing'],
  },
  {
    id: 'div-02', name: 'Bless', school: 'Divine', level: 1,
    castingTime: '1 action', range: '30 ft', duration: 'Concentration, 1 min',
    description: 'Up to 3 creatures add 1d4 to attack rolls and saving throws.',
    tags: ['Buff', 'Concentration'],
  },
  {
    id: 'div-03', name: 'Guiding Bolt', school: 'Divine', level: 1,
    castingTime: '1 action', range: '120 ft', duration: 'Instantaneous',
    description: 'A flash of light. Deals 4d6 radiant damage. Next attack roll against the target before your next turn has advantage.',
    higherLevels: '+1d6 per extra mana spent.',
    tags: ['Damage', 'Radiant'],
  },
  {
    id: 'div-04', name: 'Healing Word', school: 'Divine', level: 1,
    castingTime: '1 bonus action', range: '60 ft', duration: 'Instantaneous',
    description: 'Restore 1d4 + WIL modifier HP to a visible creature.',
    higherLevels: '+1d4 per extra mana spent.',
    tags: ['Healing', 'Bonus Action'],
  },
  {
    id: 'div-05', name: 'Revivify', school: 'Divine', level: 3,
    castingTime: '1 action', range: 'Touch', duration: 'Instantaneous',
    description: 'Return a creature who died within the last minute to life with 1 HP.',
    tags: ['Resurrection'],
  },
  {
    id: 'div-06', name: 'Sacred Flame', school: 'Divine', level: 1,
    castingTime: '1 action', range: '60 ft', duration: 'Instantaneous',
    description: 'Radiant flame descends on a creature. Deals 1d8 radiant damage (DEX save negates). Ignores cover.',
    higherLevels: '+1d8 per 2 extra mana spent.',
    tags: ['Damage', 'Radiant'],
  },
  // ─── Druidic ─────────────────────────────────────────────────────────────
  {
    id: 'dru-01', name: 'Entangle', school: 'Druidic', level: 1,
    castingTime: '1 action', range: '90 ft', duration: 'Concentration, 1 min',
    description: 'Grasping weeds fill a 20 ft square. Creatures in the area are Restrained (STR save negates, repeat each turn).',
    tags: ['Control', 'Concentration'],
  },
  {
    id: 'dru-02', name: 'Healing Spirit', school: 'Druidic', level: 2,
    castingTime: '1 bonus action', range: '60 ft', duration: 'Concentration, 1 min',
    description: 'A spirit occupies a 5 ft cube. When a creature enters the space, it regains 1d6 HP (max WIL mod times per round).',
    tags: ['Healing', 'Concentration'],
  },
  {
    id: 'dru-03', name: 'Call Lightning', school: 'Druidic', level: 3,
    castingTime: '1 action', range: '120 ft', duration: 'Concentration, 10 min',
    description: 'A storm cloud forms. As an action each turn, call a bolt to deal 3d10 lightning damage (DEX save for half).',
    higherLevels: '+1d10 per extra mana spent.',
    tags: ['Damage', 'Lightning', 'Concentration'],
  },
  {
    id: 'dru-04', name: 'Barkskin', school: 'Druidic', level: 2,
    castingTime: '1 action', range: 'Touch', duration: 'Concentration, 1 hour',
    description: 'Target\'s skin hardens. AC cannot be less than 16 for the duration.',
    tags: ['Defense', 'Concentration'],
  },
  // ─── Elemental ───────────────────────────────────────────────────────────
  {
    id: 'ele-01', name: 'Burning Hands', school: 'Elemental', level: 1,
    castingTime: '1 action', range: 'Self (15 ft cone)', duration: 'Instantaneous',
    description: 'Shoot a sheet of fire from your hands. Each creature takes 3d6 fire damage (DEX save for half).',
    higherLevels: '+1d6 per extra mana spent.',
    tags: ['Damage', 'Fire'],
  },
  {
    id: 'ele-02', name: 'Ice Storm', school: 'Elemental', level: 4,
    castingTime: '1 action', range: '300 ft', duration: 'Instantaneous',
    description: 'Hail and sleet blast a 20 ft cylinder. Creatures take 2d8 bludgeoning + 4d6 cold damage (DEX save for half). Area becomes difficult terrain.',
    tags: ['Damage', 'Cold', 'Area'],
  },
  {
    id: 'ele-03', name: 'Wall of Fire', school: 'Elemental', level: 4,
    castingTime: '1 action', range: '120 ft', duration: 'Concentration, 1 min',
    description: 'A wall of fire 60 ft long, 20 ft high. Creatures passing through or starting their turn within 10 ft take 5d8 fire damage.',
    tags: ['Damage', 'Fire', 'Concentration'],
  },
  {
    id: 'ele-04', name: 'Gust of Wind', school: 'Elemental', level: 2,
    castingTime: '1 action', range: 'Self (60 ft line)', duration: 'Concentration, 1 min',
    description: 'A strong wind blasts in a 60 ft line. Creatures are pushed back and movement into the line costs double.',
    tags: ['Control', 'Concentration'],
  },
  // ─── Illusion ────────────────────────────────────────────────────────────
  {
    id: 'ill-01', name: 'Silent Image', school: 'Illusion', level: 1,
    castingTime: '1 action', range: '60 ft', duration: 'Concentration, 10 min',
    description: 'Create a visual illusion up to 15 ft in any dimension. Move it up to 20 ft per action.',
    tags: ['Illusion', 'Concentration'],
  },
  {
    id: 'ill-02', name: 'Mirror Image', school: 'Illusion', level: 2,
    castingTime: '1 action', range: 'Self', duration: '1 min',
    description: 'Create 3 illusory duplicates. When hit, roll d20 — on 6+ the attack strikes a duplicate instead (destroyed on hit).',
    tags: ['Defense'],
  },
  {
    id: 'ill-03', name: 'Hypnotic Pattern', school: 'Illusion', level: 3,
    castingTime: '1 action', range: '120 ft', duration: 'Concentration, 1 min',
    description: 'A swirling pattern entrances creatures in a 30 ft cube. Creatures that fail a WIL save are charmed and incapacitated.',
    tags: ['Control', 'Concentration'],
  },
  {
    id: 'ill-04', name: 'Disguise Self', school: 'Illusion', level: 1,
    castingTime: '1 action', range: 'Self', duration: '1 hour',
    description: 'Make yourself look like any humanoid creature. Physical interaction reveals the illusion.',
    tags: ['Utility'],
  },
  // ─── Necromancy ──────────────────────────────────────────────────────────
  {
    id: 'nec-01', name: 'Inflict Wounds', school: 'Necromancy', level: 1,
    castingTime: '1 action', range: 'Touch', duration: 'Instantaneous',
    description: 'Make a melee spell attack. On hit, deal 3d10 necrotic damage.',
    higherLevels: '+1d10 per extra mana spent.',
    tags: ['Damage', 'Necrotic'],
  },
  {
    id: 'nec-02', name: 'Animate Dead', school: 'Necromancy', level: 3,
    castingTime: '1 minute', range: '10 ft', duration: '24 hours',
    description: 'Raise a Medium or Small corpse as a skeleton or zombie under your control.',
    tags: ['Summon'],
  },
  {
    id: 'nec-03', name: 'Vampiric Touch', school: 'Necromancy', level: 3,
    castingTime: '1 action', range: 'Self', duration: 'Concentration, 1 min',
    description: 'Melee spell attack deals 3d6 necrotic damage and heals you for half the damage dealt.',
    tags: ['Damage', 'Healing', 'Concentration'],
  },
  {
    id: 'nec-04', name: 'Blight', school: 'Necromancy', level: 4,
    castingTime: '1 action', range: '30 ft', duration: 'Instantaneous',
    description: 'Drain vitality from a creature. It takes 8d8 necrotic damage (STR save for half). Plants and constructs are not affected.',
    tags: ['Damage', 'Necrotic'],
  },
];

export const SPELL_MAP: Record<string, Spell> = Object.fromEntries(
  SPELLS.map((s) => [s.id, s])
);
