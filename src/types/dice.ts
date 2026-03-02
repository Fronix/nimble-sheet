export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type RollMode = 'normal' | 'advantage' | 'disadvantage';

export interface DieRoll {
  die: DieType;
  result: number;
  isMax: boolean;
  isMin: boolean;
}

export interface DiceRoll {
  id: string;
  timestamp: string;
  label?: string;
  dice: DieRoll[];
  modifier: number;
  total: number;
  mode: RollMode;
  keptDice: DieRoll[];
  droppedDice: DieRoll[];
  isCrit: boolean;
  isFumble: boolean;
}
