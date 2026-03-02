// ─── Core Stat Keys ──────────────────────────────────────────────────────────
export type CoreStat = 'STR' | 'DEX' | 'INT' | 'WIL';

// ─── Skills ──────────────────────────────────────────────────────────────────
export type SkillName =
  | 'Athletics'
  | 'Stealth'
  | 'Finesse'
  | 'Arcana'
  | 'Examination'
  | 'Lore'
  | 'Insight'
  | 'Influence'
  | 'Naturecraft'
  | 'Perception';

export const SKILL_STAT_MAP: Record<SkillName, CoreStat> = {
  Athletics: 'STR',
  Stealth: 'DEX',
  Finesse: 'DEX',
  Arcana: 'INT',
  Examination: 'INT',
  Lore: 'INT',
  Insight: 'WIL',
  Influence: 'WIL',
  Naturecraft: 'WIL',
  Perception: 'WIL',
};

export const ALL_SKILLS: SkillName[] = [
  'Athletics',
  'Stealth',
  'Finesse',
  'Arcana',
  'Examination',
  'Lore',
  'Insight',
  'Influence',
  'Naturecraft',
  'Perception',
];

// ─── Saving Throws ───────────────────────────────────────────────────────────
export type SaveStat = 'STR' | 'DEX' | 'WIL'; // No CON or INT saves in Nimble
export type SaveAdvantage = 'normal' | 'advantage' | 'disadvantage';

export interface SavingThrow {
  advantage: SaveAdvantage;
}

// ─── Core Stats ──────────────────────────────────────────────────────────────
export interface CoreStats {
  STR: number;
  DEX: number;
  INT: number;
  WIL: number;
}

export interface CharacterSkill {
  points: number;      // 0–12
  governingStat: CoreStat;
}

// ─── Conditions ──────────────────────────────────────────────────────────────
export type ConditionName =
  | 'Blinded'
  | 'Charmed'
  | 'Deafened'
  | 'Exhausted'
  | 'Frightened'
  | 'Grappled'
  | 'Incapacitated'
  | 'Invisible'
  | 'Paralyzed'
  | 'Petrified'
  | 'Poisoned'
  | 'Prone'
  | 'Restrained'
  | 'Stunned'
  | 'Unconscious';

export interface ActiveCondition {
  name: ConditionName;
  notes?: string;
  turnsRemaining?: number;
}

// ─── Inventory ───────────────────────────────────────────────────────────────
export type ItemCategory =
  | 'Weapon'
  | 'Armor'
  | 'Shield'
  | 'Tool'
  | 'Consumable'
  | 'Treasure'
  | 'Misc';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  slots: number;
  damage?: string;       // e.g. "1d8" — no to-hit modifier in Nimble
  armorValue?: number;
  description?: string;
  quantity: number;
  equipped: boolean;
  notes?: string;
}

// ─── Spells ──────────────────────────────────────────────────────────────────
export type SpellSchool =
  | 'Arcane'
  | 'Divine'
  | 'Druidic'
  | 'Elemental'
  | 'Illusion'
  | 'Necromancy';

export interface Spell {
  id: string;
  name: string;
  school: SpellSchool;
  level: number;         // 1–5; mana cost = spell level
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  higherLevels?: string;
  tags?: string[];
}

// ─── Classes ─────────────────────────────────────────────────────────────────
export type ClassName =
  | 'Berserker'
  | 'The Cheat'
  | 'Commander'
  | 'Druid'
  | 'Hunter'
  | 'Mage'
  | 'Monk'
  | 'Paladin'
  | 'Priest'
  | 'Warden'
  | 'Warrior';

// ─── Ancestries ──────────────────────────────────────────────────────────────
export type CommonAncestry = 'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Gnome';

export type ExoticAncestry =
  | 'Dragonborn' | 'Tiefling' | 'Aasimar' | 'Genasi' | 'Goliath'
  | 'Tabaxi' | 'Kenku' | 'Lizardfolk' | 'Triton' | 'Yuan-Ti'
  | 'Firbolg' | 'Bugbear' | 'Goblin' | 'Hobgoblin' | 'Kobold'
  | 'Orc' | 'Satyr' | 'Changeling' | 'Shifter';

export type AncestryName = CommonAncestry | ExoticAncestry;

// ─── Backgrounds ─────────────────────────────────────────────────────────────
export type BackgroundName =
  | 'Acolyte' | 'Charlatan' | 'Criminal' | 'Entertainer'
  | 'Folk Hero' | 'Guild Artisan' | 'Hermit' | 'Knight'
  | 'Noble' | 'Outlander' | 'Sage' | 'Sailor' | 'Soldier'
  | 'Urchin' | 'Merchant' | 'Gladiator' | 'Spy' | 'Farmer'
  | 'Hunter' | 'Scholar' | 'Wanderer' | 'Apothecary'
  | 'Smuggler' | 'Guard';

// ─── Notes ───────────────────────────────────────────────────────────────────
export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// ─── Currency ────────────────────────────────────────────────────────────────
export interface Currency {
  gold: number;
  silver: number;
  copper: number;
}

// ─── Features ────────────────────────────────────────────────────────────────
export interface Feature {
  id: string;
  name: string;
  source: 'class' | 'ancestry' | 'background' | 'feat' | 'other';
  description: string;
  level?: number;
}

// ─── Attacks ─────────────────────────────────────────────────────────────────
export interface Attack {
  id: string;
  name: string;
  damageDice: string;    // e.g. "1d8" — no to-hit roll in Nimble
  damageType: string;
  range?: string;
  notes?: string;
}

// ─── Full Character ───────────────────────────────────────────────────────────
export interface Character {
  id: string;
  name: string;
  playerName?: string;
  createdAt: string;
  updatedAt: string;
  portraitUri?: string;

  class: ClassName;
  level: number;
  ancestry: AncestryName;
  background: BackgroundName;
  alignment?: string;
  age?: string;
  appearance?: string;

  stats: CoreStats;

  savingThrows: Record<SaveStat, SavingThrow>;

  skills: Record<SkillName, CharacterSkill>;

  hp: {
    current: number;
    max: number;
    temp: number;
  };
  mana: {
    current: number;
    max: number;
  };
  wounds: number;
  maxWounds: number;
  conditions: ActiveCondition[];

  armorClass: number;
  speed: number;

  inventory: InventoryItem[];
  currency: Currency;

  knownSpells: string[];
  preparedSpells: string[];

  attacks: Attack[];
  features: Feature[];
  notes: CharacterNote[];

  experiencePoints: number;
  isComplete: boolean;
}

// ─── Default character factory ───────────────────────────────────────────────
export function createDefaultSkills(): Record<SkillName, CharacterSkill> {
  return {
    Athletics: { points: 0, governingStat: 'STR' },
    Stealth: { points: 0, governingStat: 'DEX' },
    Finesse: { points: 0, governingStat: 'DEX' },
    Arcana: { points: 0, governingStat: 'INT' },
    Examination: { points: 0, governingStat: 'INT' },
    Lore: { points: 0, governingStat: 'INT' },
    Insight: { points: 0, governingStat: 'WIL' },
    Influence: { points: 0, governingStat: 'WIL' },
    Naturecraft: { points: 0, governingStat: 'WIL' },
    Perception: { points: 0, governingStat: 'WIL' },
  };
}

export function createDefaultSavingThrows(): Record<SaveStat, SavingThrow> {
  return {
    STR: { advantage: 'normal' },
    DEX: { advantage: 'normal' },
    WIL: { advantage: 'normal' },
  };
}

export function createNewCharacter(partial: Partial<Character> = {}): Character {
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    name: 'New Hero',
    playerName: '',
    createdAt: now,
    updatedAt: now,
    class: 'Warrior',
    level: 1,
    ancestry: 'Human',
    background: 'Soldier',
    stats: { STR: 10, DEX: 10, INT: 10, WIL: 10 },
    savingThrows: createDefaultSavingThrows(),
    skills: createDefaultSkills(),
    hp: { current: 10, max: 10, temp: 0 },
    mana: { current: 0, max: 0 },
    wounds: 0,
    maxWounds: 6,
    conditions: [],
    armorClass: 10,
    speed: 6,
    inventory: [],
    currency: { gold: 0, silver: 0, copper: 0 },
    knownSpells: [],
    preparedSpells: [],
    attacks: [],
    features: [],
    notes: [],
    experiencePoints: 0,
    isComplete: false,
    ...partial,
  };
}
