import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppTheme = 'parchment' | 'dark-stone';

interface AppSettings {
  theme: AppTheme;
  diceAnimations: boolean;
  confirmDeletes: boolean;
}

interface SettingsStore extends AppSettings {
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'parchment',
  diceAnimations: true,
  confirmDeletes: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (patch) => set((state) => ({ ...state, ...patch })),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'nimble-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
