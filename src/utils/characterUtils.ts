import type { Character, CoreStat, SkillName } from '../types/character';

export function getStatModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getModifierString(score: number): string {
  const mod = getStatModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getInventorySlotMax(character: Character): number {
  return 10 + getStatModifier(character.stats.STR);
}

export function getInventorySlotsUsed(character: Character): number {
  return character.inventory.reduce((total, item) => total + item.slots * item.quantity, 0);
}

export function getSkillTotal(character: Character, skill: SkillName): number {
  const skillData = character.skills[skill];
  const statMod = getStatModifier(character.stats[skillData.governingStat]);
  return skillData.points + statMod;
}

export function getInitiativeBonus(character: Character): number {
  return getStatModifier(character.stats.DEX);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(1 + level / 4);
}

export function getHPPercentage(character: Character): number {
  if (character.hp.max <= 0) return 0;
  return Math.max(0, Math.min(1, character.hp.current / character.hp.max));
}

export function getManaPercentage(character: Character): number {
  if (character.mana.max <= 0) return 0;
  return Math.max(0, Math.min(1, character.mana.current / character.mana.max));
}

export function isBloodied(character: Character): boolean {
  return character.hp.current <= character.hp.max / 2 && character.hp.current > 0;
}

export function isDown(character: Character): boolean {
  return character.hp.current <= 0;
}

export function formatStat(value: number): string {
  return value.toString().padStart(2, '0');
}
