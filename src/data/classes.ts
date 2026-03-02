import type { ClassName, CoreStat } from '../types/character';

export interface ClassData {
  name: ClassName;
  description: string;
  keyStats: CoreStat[];
  hitDiceSize: number;
  startingMana: number;
  isCaster: boolean;
}

export const CLASSES: ClassData[] = [
  {
    name: 'Berserker',
    description: 'An unstoppable force of wrath and ruin who channels primal rage into devastating attacks.',
    keyStats: ['STR', 'DEX'],
    hitDiceSize: 12,
    startingMana: 0,
    isCaster: false,
  },
  {
    name: 'The Cheat',
    description: 'A sneaky, backstabbing, dirty-fighting rogue who relies on cunning and misdirection.',
    keyStats: ['DEX', 'INT'],
    hitDiceSize: 8,
    startingMana: 0,
    isCaster: false,
  },
  {
    name: 'Commander',
    description: 'A battlefield tactician, leader, and weapon master who inspires allies and crushes foes.',
    keyStats: ['STR', 'WIL'],
    hitDiceSize: 10,
    startingMana: 0,
    isCaster: false,
  },
  {
    name: 'Druid',
    description: 'A guardian of nature who draws power from the wild to heal, transform, and unleash the elements.',
    keyStats: ['WIL', 'INT'],
    hitDiceSize: 8,
    startingMana: 4,
    isCaster: true,
  },
  {
    name: 'Hunter',
    description: 'A resourceful survivalist, bow master, and skilled tracker who thrives in the wilderness.',
    keyStats: ['DEX', 'WIL'],
    hitDiceSize: 10,
    startingMana: 0,
    isCaster: false,
  },
  {
    name: 'Mage',
    description: 'A scholar of arcane mysteries who bends reality with devastating spells and tactical brilliance.',
    keyStats: ['INT', 'WIL'],
    hitDiceSize: 6,
    startingMana: 6,
    isCaster: true,
  },
  {
    name: 'Monk',
    description: 'A disciplined martial artist who combines physical mastery with inner spiritual power.',
    keyStats: ['DEX', 'WIL'],
    hitDiceSize: 8,
    startingMana: 2,
    isCaster: false,
  },
  {
    name: 'Paladin',
    description: 'A holy warrior who blends martial prowess with divine magic to smite evil and protect the innocent.',
    keyStats: ['STR', 'WIL'],
    hitDiceSize: 10,
    startingMana: 3,
    isCaster: true,
  },
  {
    name: 'Priest',
    description: 'A conduit of divine power who heals wounds, smites the undead, and channels the will of the gods.',
    keyStats: ['WIL', 'STR'],
    hitDiceSize: 8,
    startingMana: 5,
    isCaster: true,
  },
  {
    name: 'Warden',
    description: 'A heavily armored defender who stands between danger and allies, controlling the battlefield.',
    keyStats: ['STR', 'WIL'],
    hitDiceSize: 10,
    startingMana: 0,
    isCaster: false,
  },
  {
    name: 'Warrior',
    description: 'A versatile master of arms who excels in close combat with a wide range of weapons and tactics.',
    keyStats: ['STR', 'DEX'],
    hitDiceSize: 10,
    startingMana: 0,
    isCaster: false,
  },
];

export const CLASS_MAP: Record<ClassName, ClassData> = Object.fromEntries(
  CLASSES.map((c) => [c.name, c])
) as Record<ClassName, ClassData>;
