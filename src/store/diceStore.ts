import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DieType, DiceRoll, RollMode } from '../types/dice';
import { rollDice, quickRoll } from '../utils/diceLogic';

const MAX_HISTORY = 50;

interface DiceStore {
  pool: Partial<Record<DieType, number>>;
  modifier: number;
  mode: RollMode;
  history: DiceRoll[];
  lastRoll: DiceRoll | null;

  addDie: (die: DieType) => void;
  removeDie: (die: DieType) => void;
  clearPool: () => void;
  setModifier: (mod: number) => void;
  setMode: (mode: RollMode) => void;
  roll: (label?: string) => DiceRoll | null;
  quickRoll: (die: DieType, count?: number, mod?: number, mode?: RollMode, label?: string) => DiceRoll;
  clearHistory: () => void;
}

export const useDiceStore = create<DiceStore>()(
  persist(
    (set, get) => ({
      pool: {},
      modifier: 0,
      mode: 'normal',
      history: [],
      lastRoll: null,

      addDie: (die) => {
        set((state) => ({
          pool: { ...state.pool, [die]: (state.pool[die] ?? 0) + 1 },
        }));
      },

      removeDie: (die) => {
        set((state) => {
          const current = state.pool[die] ?? 0;
          if (current <= 1) {
            const { [die]: _, ...rest } = state.pool;
            return { pool: rest };
          }
          return { pool: { ...state.pool, [die]: current - 1 } };
        });
      },

      clearPool: () => set({ pool: {}, modifier: 0, mode: 'normal' }),

      setModifier: (mod) => set({ modifier: mod }),

      setMode: (mode) => set({ mode }),

      roll: (label) => {
        const { pool, modifier, mode } = get();
        const totalDice = Object.values(pool).reduce((a, b) => a + (b ?? 0), 0);
        if (totalDice === 0) return null;

        const result = rollDice(pool, modifier, mode, label);
        set((state) => ({
          lastRoll: result,
          history: [result, ...state.history].slice(0, MAX_HISTORY),
        }));
        return result;
      },

      quickRoll: (die, count = 1, mod = 0, mode = 'normal', label) => {
        const result = quickRoll(die, count, mod, mode, label);
        set((state) => ({
          lastRoll: result,
          history: [result, ...state.history].slice(0, MAX_HISTORY),
        }));
        return result;
      },

      clearHistory: () => set({ history: [], lastRoll: null }),
    }),
    {
      name: 'nimble-dice',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ history: state.history, mode: state.mode }),
    }
  )
);
