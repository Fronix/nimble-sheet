import type { AncestryName, CommonAncestry, ExoticAncestry } from '../types/character';

export interface AncestryData {
  name: AncestryName;
  isExotic: boolean;
  description: string;
  trait: string;
}

export const COMMON_ANCESTRIES: CommonAncestry[] = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome',
];

export const EXOTIC_ANCESTRIES: ExoticAncestry[] = [
  'Dragonborn', 'Tiefling', 'Aasimar', 'Genasi', 'Goliath',
  'Tabaxi', 'Kenku', 'Lizardfolk', 'Triton', 'Yuan-Ti',
  'Firbolg', 'Bugbear', 'Goblin', 'Hobgoblin', 'Kobold',
  'Orc', 'Satyr', 'Changeling', 'Shifter',
];

export const ANCESTRIES: AncestryData[] = [
  { name: 'Human', isExotic: false, description: 'Adaptable and ambitious, humans thrive in any environment.', trait: 'Gain 1 extra skill point at character creation.' },
  { name: 'Elf', isExotic: false, description: 'Graceful and long-lived, elves possess keen senses and arcane affinity.', trait: 'You can see in dim light as if it were bright light.' },
  { name: 'Dwarf', isExotic: false, description: 'Stout and resilient, dwarves are masters of stone and metal.', trait: 'Advantage on STR saves against poison.' },
  { name: 'Halfling', isExotic: false, description: 'Small but lucky, halflings have an uncanny ability to avoid disaster.', trait: 'Once per session, reroll a 1 on any die.' },
  { name: 'Gnome', isExotic: false, description: 'Curious inventors with a natural gift for illusion and trickery.', trait: 'Advantage on INT saves against magic.' },
  { name: 'Dragonborn', isExotic: true, description: 'Dragon-blooded warriors who can breathe elemental energy.', trait: 'Breath weapon based on your draconic lineage.' },
  { name: 'Tiefling', isExotic: true, description: 'Touched by infernal power, tieflings carry the mark of darkness.', trait: 'Resistance to fire damage.' },
  { name: 'Aasimar', isExotic: true, description: 'Blessed with celestial heritage, aasimar radiate divine light.', trait: 'Once per day, heal yourself or an ally for 1d6 HP.' },
  { name: 'Genasi', isExotic: true, description: 'Born of elemental energy, each genasi embodies a different force.', trait: 'Elemental affinity based on your element (Air, Fire, Water, Earth).' },
  { name: 'Goliath', isExotic: true, description: 'Mountain-born giants of great strength and endurance.', trait: 'Count as one size larger for carrying capacity.' },
  { name: 'Tabaxi', isExotic: true, description: 'Feline wanderers with razor claws and insatiable curiosity.', trait: 'Natural claws deal 1d4 damage. Climb speed equal to your speed.' },
  { name: 'Kenku', isExotic: true, description: 'Flightless bird-folk who communicate through mimicry and sounds.', trait: 'Perfect mimicry: copy any sound or voice you have heard.' },
  { name: 'Lizardfolk', isExotic: true, description: 'Cold-blooded survivors with thick scales and primal instincts.', trait: 'Natural armor grants +1 AC. Can hold breath for 15 minutes.' },
  { name: 'Triton', isExotic: true, description: 'Aquatic defenders from the ocean depths with control over water.', trait: 'Breathe underwater. Swimming speed equal to your speed.' },
  { name: 'Yuan-Ti', isExotic: true, description: 'Serpentine beings with innate magical resistance and venom.', trait: 'Magic resistance: advantage on WIL saves against spells.' },
  { name: 'Firbolg', isExotic: true, description: 'Gentle giant-kin with a deep connection to nature and magic.', trait: 'Speak with animals and plants at will.' },
  { name: 'Bugbear', isExotic: true, description: 'Hulking ambush predators with surprising stealth for their size.', trait: '+5 ft reach with melee weapons. Advantage on Stealth when surprising.' },
  { name: 'Goblin', isExotic: true, description: 'Small and nimble tricksters who excel at hit-and-run tactics.', trait: 'Disengage or Hide as a bonus action once per turn.' },
  { name: 'Hobgoblin', isExotic: true, description: 'Disciplined warrior-folk with martial precision and tactical minds.', trait: 'When you miss an attack, add your INT modifier to the damage roll.' },
  { name: 'Kobold', isExotic: true, description: 'Small draconic creatures who use pack tactics to overwhelm foes.', trait: 'Pack Tactics: advantage on attacks when an ally is adjacent to your target.' },
  { name: 'Orc', isExotic: true, description: 'Fierce warriors with savage resilience who refuse to fall.', trait: 'When reduced to 0 HP, drop to 1 HP instead (once per long rest).' },
  { name: 'Satyr', isExotic: true, description: 'Joyful fey creatures immune to magical charm and compulsion.', trait: 'Immunity to being charmed or frightened by magic.' },
  { name: 'Changeling', isExotic: true, description: 'Shape-shifters who can assume any humanoid form at will.', trait: 'Change appearance as an action. Advantage on Influence when disguised.' },
  { name: 'Shifter', isExotic: true, description: 'Lycanthrope-touched mortals who can tap into their bestial nature.', trait: 'Once per short rest, shift to gain +2 AC and +1d6 HP for 1 minute.' },
];
