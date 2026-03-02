import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Animated } from 'react-native';
import { useDiceStore } from '../../src/store/diceStore';
import type { DieType, RollMode } from '../../src/types/dice';

const DICE: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
const DIE_FACES: Record<DieType, string> = {
  d4: '△', d6: '□', d8: '◇', d10: '○', d12: '⬡', d20: '★', d100: '%',
};
const DIE_COLORS: Record<DieType, string> = {
  d4: '#C9A84C', d6: '#4A7FBF', d8: '#3D7A3D', d10: '#7A4A9A', d12: '#C23535', d20: '#C9A84C', d100: '#5A5A7A',
};
const MODE_LABELS: Record<RollMode, string> = {
  normal: 'Normal', advantage: '▲ Advantage', disadvantage: '▼ Disadvantage',
};
const MODE_COLORS: Record<RollMode, string> = {
  normal: '#C9A84C', advantage: '#3D7A3D', disadvantage: '#8B1A1A',
};

export default function DiceScreen() {
  const store = useDiceStore();
  const [modifierText, setModifierText] = useState('0');

  const poolEntries = Object.entries(store.pool) as [DieType, number][];
  const totalDice = poolEntries.reduce((sum, [, n]) => sum + n, 0);

  function handleRoll() {
    const mod = parseInt(modifierText) || 0;
    store.setModifier(mod);
    store.roll();
  }

  function handleQuickRoll(die: DieType) {
    store.quickRoll(die, 1, 0, store.mode, `Quick ${die}`);
  }

  function formatTimestamp(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 20, color: '#C9A84C', textAlign: 'center' }}>Dice Roller</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
          {/* Last Roll Result */}
          {store.lastRoll && (
            <View style={{
              backgroundColor: store.lastRoll.isCrit ? '#2A1A0A' : store.lastRoll.isFumble ? '#1A0A0A' : '#2D2D44',
              borderColor: store.lastRoll.isCrit ? '#C9A84C' : store.lastRoll.isFumble ? '#8B1A1A' : '#5A5A7A',
              borderWidth: store.lastRoll.isCrit || store.lastRoll.isFumble ? 2 : 1,
              borderRadius: 12, padding: 16, marginBottom: 14, alignItems: 'center',
            }}>
              {store.lastRoll.isCrit && <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 11, color: '#C9A84C', letterSpacing: 2, marginBottom: 4 }}>⚡ CRITICAL HIT ⚡</Text>}
              {store.lastRoll.isFumble && <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 11, color: '#8B1A1A', letterSpacing: 2, marginBottom: 4 }}>☠ FUMBLE ☠</Text>}
              <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 52, color: '#F0C97A', lineHeight: 60 }}>
                {store.lastRoll.total}
              </Text>
              {store.lastRoll.label && (
                <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 12, color: '#7A7A9A', marginTop: 2 }}>{store.lastRoll.label}</Text>
              )}
              {/* Individual dice results */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {store.lastRoll.keptDice.map((d, i) => (
                  <View key={i} style={{ backgroundColor: d.isMax ? '#C9A84C33' : d.isMin ? '#8B1A1A33' : '#1A1A2E', borderRadius: 6, borderWidth: 1, borderColor: d.isMax ? '#C9A84C' : d.isMin ? '#8B1A1A' : '#5A5A7A', paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: d.isMax ? '#C9A84C' : d.isMin ? '#C23535' : '#F5E6C8' }}>
                      {d.result}
                    </Text>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 8, color: '#7A7A9A', textAlign: 'center' }}>{d.die}</Text>
                  </View>
                ))}
                {store.lastRoll.droppedDice.map((d, i) => (
                  <View key={`d-${i}`} style={{ backgroundColor: '#1A1A2E', borderRadius: 6, borderWidth: 1, borderColor: '#3D3D58', paddingHorizontal: 8, paddingVertical: 4, opacity: 0.4 }}>
                    <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: '#5A5A7A', textDecorationLine: 'line-through' }}>{d.result}</Text>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 8, color: '#5A5A7A', textAlign: 'center' }}>{d.die}</Text>
                  </View>
                ))}
                {store.lastRoll.modifier !== 0 && (
                  <View style={{ backgroundColor: '#1A1A2E', borderRadius: 6, borderWidth: 1, borderColor: '#C9A84C44', paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: '#C9A84C' }}>
                      {store.lastRoll.modifier > 0 ? '+' : ''}{store.lastRoll.modifier}
                    </Text>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 8, color: '#7A7A9A', textAlign: 'center' }}>mod</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Quick Roll row */}
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Quick Roll</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {DICE.map((die) => (
              <TouchableOpacity
                key={die}
                onPress={() => handleQuickRoll(die)}
                style={{ backgroundColor: DIE_COLORS[die] + '22', borderColor: DIE_COLORS[die], borderWidth: 2, borderRadius: 10, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.6}
              >
                <Text style={{ fontSize: 18, color: DIE_COLORS[die] }}>{DIE_FACES[die]}</Text>
                <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 8, color: DIE_COLORS[die] }}>{die}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pool Builder */}
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Build Pool</Text>
          <View style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {DICE.map((die) => {
                const count = store.pool[die] ?? 0;
                return (
                  <View key={die} style={{ alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity
                      onPress={() => store.addDie(die)}
                      style={{ backgroundColor: DIE_COLORS[die] + '33', borderColor: DIE_COLORS[die], borderWidth: 1, borderRadius: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ fontSize: 16, color: DIE_COLORS[die] }}>{DIE_FACES[die]}</Text>
                      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 7, color: DIE_COLORS[die] }}>{die}</Text>
                    </TouchableOpacity>
                    {count > 0 && (
                      <TouchableOpacity onPress={() => store.removeDie(die)}>
                        <View style={{ backgroundColor: DIE_COLORS[die], borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#1A1A2E', fontFamily: 'CinzelDecorative-Bold', fontSize: 11 }}>{count}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Pool summary */}
            {totalDice > 0 && (
              <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#C9A84C', marginBottom: 8 }}>
                {poolEntries.filter(([, n]) => n > 0).map(([d, n]) => `${n}${d}`).join(' + ')}
                {(parseInt(modifierText) || 0) !== 0 ? ` ${(parseInt(modifierText) || 0) > 0 ? '+' : ''}${parseInt(modifierText) || 0}` : ''}
              </Text>
            )}

            {/* Modifier */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase' }}>Modifier</Text>
              <TextInput
                value={modifierText}
                onChangeText={setModifierText}
                keyboardType="numbers-and-punctuation"
                style={{ backgroundColor: '#1A1A2E', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, color: '#F0C97A', fontFamily: 'IMFellEnglish-Regular', fontSize: 14, width: 60, textAlign: 'center' }}
              />
            </View>

            {/* Mode toggle */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {(['normal', 'advantage', 'disadvantage'] as RollMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => store.setMode(m)}
                  style={{ flex: 1, borderRadius: 6, borderWidth: 1, borderColor: MODE_COLORS[m], backgroundColor: store.mode === m ? MODE_COLORS[m] + '33' : 'transparent', padding: 6, alignItems: 'center' }}
                >
                  <Text style={{ color: store.mode === m ? MODE_COLORS[m] : '#5A5A7A', fontFamily: 'CinzelDecorative-Regular', fontSize: 8, textTransform: 'uppercase' }}>
                    {MODE_LABELS[m]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Roll & Clear buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={handleRoll}
                disabled={totalDice === 0}
                style={{ flex: 1, backgroundColor: totalDice > 0 ? '#C9A84C' : '#3D3D58', borderRadius: 8, padding: 12, alignItems: 'center' }}
              >
                <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 13, color: totalDice > 0 ? '#1C1008' : '#5A5A7A', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Roll!
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { store.clearPool(); setModifierText('0'); }}
                style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center' }}
              >
                <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#7A7A9A' }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* History */}
          {store.history.length > 0 && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1 }}>Roll History</Text>
                <TouchableOpacity onPress={() => store.clearHistory()}>
                  <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 11, color: '#5A5A7A' }}>Clear</Text>
                </TouchableOpacity>
              </View>
              {store.history.slice(0, 20).map((roll) => (
                <View key={roll.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
                  <View>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#F5E6C8' }}>
                      {roll.keptDice.map((d) => `${d.result}`).join(' + ')}
                      {roll.modifier !== 0 ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''}
                    </Text>
                    {roll.label && <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 10, color: '#7A7A9A' }}>{roll.label}</Text>}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 16, color: roll.isCrit ? '#C9A84C' : roll.isFumble ? '#C23535' : '#F0C97A' }}>
                      {roll.total}
                    </Text>
                    <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 9, color: '#5A5A7A' }}>{formatTimestamp(roll.timestamp)}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
