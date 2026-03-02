import type { ConditionName } from '../types/character';

export interface ConditionData {
  name: ConditionName;
  description: string;
  color: string;
}

export const CONDITIONS: ConditionData[] = [
  { name: 'Blinded', description: 'Cannot see. Auto-fail sight-based checks. Attacks have disadvantage.', color: '#4A4A4A' },
  { name: 'Charmed', description: 'Cannot attack the charmer. The charmer has advantage on Influence checks against you.', color: '#C93A8A' },
  { name: 'Deafened', description: 'Cannot hear. Auto-fail hearing-based checks.', color: '#6A5A4A' },
  { name: 'Exhausted', description: 'Imposes cumulative penalties to all checks and attacks.', color: '#7A6A30' },
  { name: 'Frightened', description: 'Disadvantage on checks while source is in sight. Cannot willingly move closer.', color: '#9B3A3A' },
  { name: 'Grappled', description: 'Speed becomes 0. Ends if grappler is incapacitated or you escape.', color: '#4A7A4A' },
  { name: 'Incapacitated', description: 'Cannot take actions or reactions.', color: '#8B1A1A' },
  { name: 'Invisible', description: 'Impossible to see without magic. Attacks against you have disadvantage; yours have advantage.', color: '#9090B0' },
  { name: 'Paralyzed', description: 'Incapacitated, cannot move or speak. Auto-fail STR and DEX saves. Attacks have advantage.', color: '#3A4A8B' },
  { name: 'Petrified', description: 'Transformed to stone. Incapacitated, immune to poison and disease.', color: '#8A8A8A' },
  { name: 'Poisoned', description: 'Disadvantage on attack rolls and ability checks.', color: '#2A7A2A' },
  { name: 'Prone', description: 'Must crawl to move. Melee attacks against you have advantage; ranged attacks have disadvantage.', color: '#7A5A2A' },
  { name: 'Restrained', description: 'Speed 0. Attack rolls have disadvantage. DEX saves have disadvantage.', color: '#6A2A6A' },
  { name: 'Stunned', description: 'Incapacitated, cannot move. Auto-fail STR and DEX saves. Attacks have advantage.', color: '#4A4A8A' },
  { name: 'Unconscious', description: 'Incapacitated, cannot move or speak. Unaware of surroundings. Attacks have advantage and crit within 5 ft.', color: '#2A2A2A' },
];
