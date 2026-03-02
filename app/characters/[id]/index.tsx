import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import { CONDITIONS } from '../../../src/data/conditions';
import { getStatModifier, getModifierString, isBloodied, isDown } from '../../../src/utils/characterUtils';
import type { ConditionName } from '../../../src/types/character';

function StatPill({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <View style={{ alignItems: 'center', backgroundColor: '#2D2D44', borderColor: color ?? '#5A5A7A', borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, minWidth: 60 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 8, color: color ?? '#C9A84C', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 20, color: '#F5E6C8', marginTop: 2 }}>{value}</Text>
      {sub ? <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 10, color: '#7A7A9A' }}>{sub}</Text> : null}
    </View>
  );
}

function QuickAdjust({ label, current, max, color, onMinus, onPlus }: {
  label: string; current: number; max: number; color: string;
  onMinus: () => void; onPlus: () => void;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  return (
    <View style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
        <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 16, color: '#F5E6C8' }}>
          {current}<Text style={{ fontSize: 12, color: '#7A7A9A' }}>/{max}</Text>
        </Text>
      </View>
      {/* Bar */}
      <View style={{ height: 6, backgroundColor: '#1A1A2E', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
        <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 3 }} />
      </View>
      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[-5, -1, 1, 5].map((delta) => (
          <TouchableOpacity
            key={delta}
            onPress={() => delta < 0 ? onMinus() : onPlus()}
            onLongPress={() => {
              // For larger adjustments: repeated calls
              if (Math.abs(delta) === 5) {
                for (let i = 0; i < 4; i++) delta < 0 ? onMinus() : onPlus();
              }
            }}
            style={{ flex: 1, backgroundColor: '#1A1A2E', borderColor: color, borderWidth: 1, borderRadius: 6, padding: 6, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color }}>
              {delta > 0 ? '+' : ''}{delta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function WoundTracker({ wounds, maxWounds, onAdd, onRemove }: {
  wounds: number; maxWounds: number; onAdd: () => void; onRemove: () => void;
}) {
  return (
    <View style={{ backgroundColor: '#2D2D44', borderColor: '#8B1A1A', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C23535', textTransform: 'uppercase', letterSpacing: 1 }}>Wounds</Text>
        <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#7A7A9A' }}>{wounds}/{maxWounds}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {Array.from({ length: maxWounds }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: i < wounds ? '#8B1A1A' : 'transparent',
              borderWidth: 2, borderColor: '#8B1A1A',
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={onRemove}
          style={{ flex: 1, backgroundColor: '#1A1A2E', borderColor: '#8B1A1A', borderWidth: 1, borderRadius: 6, padding: 8, alignItems: 'center' }}
        >
          <Text style={{ color: '#C23535', fontFamily: 'IMFellEnglish-Regular', fontSize: 13 }}>− Wound</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAdd}
          style={{ flex: 1, backgroundColor: '#8B1A1A', borderRadius: 6, padding: 8, alignItems: 'center' }}
        >
          <Text style={{ color: '#F5E6C8', fontFamily: 'IMFellEnglish-Regular', fontSize: 13 }}>+ Wound</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CharacterPlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const character = useCharacterStore((s) => s.characters[id]);
  const store = useCharacterStore();
  const [conditionModalVisible, setConditionModalVisible] = useState(false);

  if (!character) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#C9A84C', fontFamily: 'CinzelDecorative-Regular' }}>Hero not found</Text>
      </View>
    );
  }

  const strMod = getStatModifier(character.stats.STR);
  const dexMod = getStatModifier(character.stats.DEX);

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
            <Text style={{ color: '#C9A84C', fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 16, color: '#F5E6C8' }} numberOfLines={1}>
              {character.name}
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A7A9A' }}>
              {character.class} {character.level} · {character.ancestry}
            </Text>
          </View>
          {isDown(character) && (
            <View style={{ backgroundColor: '#8B1A1A', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: '#F5E6C8', fontFamily: 'CinzelDecorative-Regular', fontSize: 9 }}>DOWN</Text>
            </View>
          )}
          {isBloodied(character) && !isDown(character) && (
            <View style={{ backgroundColor: '#9B7A28', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: '#F5E6C8', fontFamily: 'CinzelDecorative-Regular', fontSize: 9 }}>BLOODIED</Text>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
          {/* Stat pills row */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <StatPill label="AC" value={character.armorClass.toString()} />
            <StatPill label="Speed" value={character.speed.toString()} />
            <StatPill label="Init" value={`+${dexMod}`} />
            <StatPill label="Level" value={character.level.toString()} color="#C9A84C" />
            {character.hp.temp > 0 ? (
              <StatPill label="Temp HP" value={character.hp.temp.toString()} color="#4A7FBF" />
            ) : null}
          </View>

          {/* HP Tracker */}
          <QuickAdjust
            label="Hit Points"
            current={character.hp.current}
            max={character.hp.max}
            color="#3D7A3D"
            onMinus={() => store.adjustHP(id, -1)}
            onPlus={() => store.adjustHP(id, 1)}
          />

          {/* Mana Tracker (casters only) */}
          {character.mana.max > 0 && (
            <QuickAdjust
              label="Mana"
              current={character.mana.current}
              max={character.mana.max}
              color="#4A7FBF"
              onMinus={() => store.adjustMana(id, -1)}
              onPlus={() => store.adjustMana(id, 1)}
            />
          )}

          {/* Wound Tracker */}
          <WoundTracker
            wounds={character.wounds}
            maxWounds={character.maxWounds}
            onAdd={() => store.addWound(id)}
            onRemove={() => store.removeWound(id)}
          />

          {/* Conditions */}
          <View style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1 }}>
                Conditions
              </Text>
              <TouchableOpacity onPress={() => setConditionModalVisible(true)}>
                <Text style={{ color: '#C9A84C', fontSize: 18 }}>+</Text>
              </TouchableOpacity>
            </View>
            {character.conditions.length === 0 ? (
              <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 12, color: '#5A5A7A' }}>No active conditions</Text>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {character.conditions.map((cond) => (
                  <TouchableOpacity
                    key={cond.name}
                    onPress={() => Alert.alert(cond.name, 'Remove this condition?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', onPress: () => store.removeCondition(id, cond.name as ConditionName) },
                    ])}
                    style={{ backgroundColor: '#8B1A1A22', borderColor: '#8B1A1A', borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}
                  >
                    <Text style={{ color: '#C23535', fontFamily: 'IMFellEnglish-Regular', fontSize: 12 }}>{cond.name} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Rest Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => Alert.alert('Short Rest', 'Take a short rest and recover some HP?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Rest', onPress: () => store.shortRest(id) },
              ])}
              style={{ flex: 1, backgroundColor: '#2D2D44', borderColor: '#9B7A28', borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C9A84C', textTransform: 'uppercase' }}>Short Rest</Text>
              <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 10, color: '#7A7A9A', marginTop: 2 }}>Recover ~25% HP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert('Long Rest', 'Take a long rest? Fully restores HP, mana, and clears wounds/conditions.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Rest', onPress: () => store.longRest(id) },
              ])}
              style={{ flex: 1, backgroundColor: '#2D2D44', borderColor: '#4A7FBF', borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#4A7FBF', textTransform: 'uppercase' }}>Long Rest</Text>
              <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 10, color: '#7A7A9A', marginTop: 2 }}>Full restore</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Condition Picker Modal */}
        <Modal visible={conditionModalVisible} transparent animationType="slide" onRequestClose={() => setConditionModalVisible(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000088' }} onPress={() => setConditionModalVisible(false)} />
          <View style={{ backgroundColor: '#1A1A2E', borderTopColor: '#C9A84C', borderTopWidth: 1, padding: 16, maxHeight: '60%' }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 14, color: '#C9A84C', marginBottom: 12 }}>Add Condition</Text>
            <ScrollView>
              {CONDITIONS.filter((c) => !character.conditions.some((ac) => ac.name === c.name)).map((cond) => (
                <TouchableOpacity
                  key={cond.name}
                  onPress={() => {
                    store.addCondition(id, { name: cond.name as ConditionName });
                    setConditionModalVisible(false);
                  }}
                  style={{ paddingVertical: 10, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}
                >
                  <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#F5E6C8' }}>{cond.name}</Text>
                  <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 2 }}>{cond.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
