import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import { getModifierString } from '../../../src/utils/characterUtils';
import { ALL_SKILLS, SKILL_STAT_MAP } from '../../../src/types/character';
import type { CoreStat, SaveStat, SaveAdvantage } from '../../../src/types/character';
import GoldDivider from '../../../src/components/layout/GoldDivider';

const STAT_KEYS: CoreStat[] = ['STR', 'DEX', 'INT', 'WIL'];
const SAVE_KEYS: SaveStat[] = ['STR', 'DEX', 'WIL'];

function StatEditor({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const mod = Math.floor((value - 10) / 2);
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 8, padding: 8, margin: 4 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</Text>
      <TouchableOpacity onPress={() => onChange(Math.min(30, value + 1))}>
        <Text style={{ color: '#C9A84C', fontSize: 18, lineHeight: 22 }}>▲</Text>
      </TouchableOpacity>
      <TextInput
        value={value.toString()}
        onChangeText={(t) => { const n = parseInt(t); if (!isNaN(n) && n >= 1 && n <= 30) onChange(n); }}
        keyboardType="numeric"
        style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 22, color: '#F5E6C8', textAlign: 'center', width: 44, padding: 0 }}
      />
      <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#7A7A9A' }}>
        {mod >= 0 ? `+${mod}` : `${mod}`}
      </Text>
      <TouchableOpacity onPress={() => onChange(Math.max(1, value - 1))}>
        <Text style={{ color: '#C9A84C', fontSize: 18, lineHeight: 22 }}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

function SaveToggle({ stat, advantage, onChange }: { stat: string; advantage: SaveAdvantage; onChange: (a: SaveAdvantage) => void }) {
  const options: SaveAdvantage[] = ['disadvantage', 'normal', 'advantage'];
  const colors: Record<SaveAdvantage, string> = { advantage: '#3D7A3D', normal: '#5A5A7A', disadvantage: '#8B1A1A' };
  const symbols: Record<SaveAdvantage, string> = { advantage: '▲', normal: '—', disadvantage: '▼' };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 11, color: '#C9A84C', width: 50, textTransform: 'uppercase' }}>{stat}</Text>
      <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              flex: 1, padding: 6, borderRadius: 6, borderWidth: 1,
              borderColor: advantage === opt ? colors[opt] : '#3D3D58',
              backgroundColor: advantage === opt ? colors[opt] + '33' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: advantage === opt ? colors[opt] : '#5A5A7A', fontSize: 11 }}>{symbols[opt]}</Text>
            <Text style={{ color: advantage === opt ? colors[opt] : '#5A5A7A', fontFamily: 'IMFellEnglish-Regular', fontSize: 9 }}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function NumericStepper({ label, value, min, max, onChange, suffix }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
      <Text style={{ flex: 1, fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>{label}</Text>
      <TouchableOpacity onPress={() => onChange(Math.max(min, value - 1))} style={{ padding: 6 }}>
        <Text style={{ color: '#C9A84C', fontSize: 18 }}>−</Text>
      </TouchableOpacity>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 14, color: '#F0C97A', width: 36, textAlign: 'center' }}>
        {value}{suffix ?? ''}
      </Text>
      <TouchableOpacity onPress={() => onChange(Math.min(max, value + 1))} style={{ padding: 6 }}>
        <Text style={{ color: '#C9A84C', fontSize: 18 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SheetBuilderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const character = useCharacterStore((s) => s.characters[id]);
  const store = useCharacterStore();
  const [saved, setSaved] = useState(false);

  if (!character) return null;

  function update(patch: Parameters<typeof store.updateCharacter>[1]) {
    store.updateCharacter(id, patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 15, color: '#C9A84C', flex: 1 }}>Character Sheet</Text>
          {saved && <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#3D7A3D' }}>Saved ✓</Text>}
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
          {/* Identity */}
          <GoldDivider label="Identity" />
          <TextInput
            value={character.name}
            onChangeText={(t) => update({ name: t })}
            placeholder="Hero name"
            placeholderTextColor="#5A5A7A"
            style={{ backgroundColor: '#2D2D44', borderColor: '#C9A84C', borderWidth: 1, borderRadius: 4, padding: 10, fontFamily: 'CinzelDecorative-Regular', fontSize: 15, color: '#F0C97A', marginBottom: 8 }}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {[
              { label: 'Class', value: character.class },
              { label: 'Ancestry', value: character.ancestry },
            ].map(({ label, value }) => (
              <View key={label} style={{ flex: 1, backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 4, padding: 8 }}>
                <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 8, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 2 }}>{label}</Text>
                <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <GoldDivider label="Core Stats" />
          <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
            {STAT_KEYS.map((stat) => (
              <StatEditor
                key={stat}
                label={stat}
                value={character.stats[stat]}
                onChange={(v) => update({ stats: { ...character.stats, [stat]: v } })}
              />
            ))}
          </View>

          {/* Combat stats */}
          <GoldDivider label="Combat" />
          <NumericStepper label="Armor Class" value={character.armorClass} min={0} max={30} onChange={(v) => update({ armorClass: v })} />
          <NumericStepper label="Speed" value={character.speed} min={0} max={12} onChange={(v) => update({ speed: v })} />
          <NumericStepper label="Max HP" value={character.hp.max} min={1} max={999} onChange={(v) => update({ hp: { ...character.hp, max: v } })} />
          <NumericStepper label="Max Mana" value={character.mana.max} min={0} max={100} onChange={(v) => update({ mana: { ...character.mana, max: v } })} />
          <NumericStepper label="Max Wounds" value={character.maxWounds} min={1} max={10} onChange={(v) => update({ maxWounds: v })} />
          <NumericStepper label="Level" value={character.level} min={1} max={20} onChange={(v) => update({ level: v })} />
          <NumericStepper label="Experience Points" value={character.experiencePoints} min={0} max={999999} onChange={(v) => update({ experiencePoints: v })} />

          {/* Saving Throws */}
          <GoldDivider label="Saving Throws" />
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginBottom: 8 }}>
            Mark which saves you have advantage or disadvantage on.
          </Text>
          {SAVE_KEYS.map((stat) => (
            <SaveToggle
              key={stat}
              stat={stat}
              advantage={character.savingThrows[stat].advantage}
              onChange={(adv) => update({
                savingThrows: { ...character.savingThrows, [stat]: { advantage: adv } },
              })}
            />
          ))}

          {/* Skills */}
          <GoldDivider label="Skills" />
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A', marginBottom: 8 }}>
            Skill points (0–12). Total = points + stat modifier.
          </Text>
          {ALL_SKILLS.map((skill) => {
            const govStat = SKILL_STAT_MAP[skill];
            const statMod = Math.floor((character.stats[govStat] - 10) / 2);
            const points = character.skills[skill].points;
            const total = points + statMod;
            return (
              <View key={skill} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
                <Text style={{ flex: 1, fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>{skill}</Text>
                <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 10, color: '#7A7A9A', width: 30, textAlign: 'center' }}>{govStat}</Text>
                <TouchableOpacity
                  onPress={() => update({ skills: { ...character.skills, [skill]: { ...character.skills[skill], points: Math.max(0, points - 1) } } })}
                  style={{ padding: 4 }}
                >
                  <Text style={{ color: '#C9A84C', fontSize: 16 }}>−</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#F0C97A', width: 22, textAlign: 'center' }}>{points}</Text>
                <TouchableOpacity
                  onPress={() => update({ skills: { ...character.skills, [skill]: { ...character.skills[skill], points: Math.min(12, points + 1) } } })}
                  style={{ padding: 4 }}
                >
                  <Text style={{ color: '#C9A84C', fontSize: 16 }}>+</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#C9A84C', width: 30, textAlign: 'right' }}>
                  {total >= 0 ? `+${total}` : `${total}`}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
