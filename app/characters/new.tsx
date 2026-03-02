import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';

import { CLASSES } from '../../src/data/classes';
import { ANCESTRIES } from '../../src/data/ancestries';
import { BACKGROUNDS } from '../../src/data/backgrounds';
import { createNewCharacter } from '../../src/types/character';
import type { ClassName, AncestryName, BackgroundName } from '../../src/types/character';
import GoldDivider from '../../src/components/layout/GoldDivider';
import ThemedButton from '../../src/components/shared/ThemedButton';

const STEPS = ['Identity', 'Class', 'Ancestry', 'Background', 'Stats', 'Review'];
const STANDARD_ARRAYS = [
  [15, 14, 13, 12, 10, 8],
  [14, 14, 14, 12, 10, 8],
  [16, 14, 12, 10, 10, 8],
];
const STAT_KEYS = ['STR', 'DEX', 'INT', 'WIL'] as const;

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 24 : 8, height: 8, borderRadius: 4,
            backgroundColor: i === current ? '#C9A84C' : i < current ? '#9B7A28' : '#3D3D58',
          }}
        />
      ))}
    </View>
  );
}

export default function NewCharacterScreen() {
  const router = useRouter();
  const { importCharacter } = useCharacterStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassName>('Warrior');
  const [selectedAncestry, setSelectedAncestry] = useState<AncestryName>('Human');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundName>('Soldier');
  const [stats, setStats] = useState({ STR: 10, DEX: 10, INT: 10, WIL: 10 });

  function applyArray(arr: number[]) {
    // Sort array desc, assign to stats in order STR, DEX, INT, WIL
    const sorted = [...arr].sort((a, b) => b - a);
    setStats({ STR: sorted[0], DEX: sorted[1], INT: sorted[2], WIL: sorted[3] });
  }

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Your hero needs a name before entering the world.');
      setStep(0);
      return;
    }

    const classData = CLASSES.find((c) => c.name === selectedClass);
    const bgData = BACKGROUNDS.find((b) => b.name === selectedBackground);

    const character = createNewCharacter({
      name: name.trim(),
      playerName: playerName.trim(),
      class: selectedClass,
      ancestry: selectedAncestry,
      background: selectedBackground,
      stats,
      hp: {
        current: (classData?.hitDiceSize ?? 8) + Math.floor((stats.STR - 10) / 2),
        max: (classData?.hitDiceSize ?? 8) + Math.floor((stats.STR - 10) / 2),
        temp: 0,
      },
      mana: {
        current: classData?.startingMana ?? 0,
        max: classData?.startingMana ?? 0,
      },
      currency: { gold: bgData?.startingGold ?? 10, silver: 0, copper: 0 },
      isComplete: true,
    });

    importCharacter(character);
    router.replace(`/characters/${character.id}`);
  }

  const screens = [
    // Step 0: Identity
    <ScrollView key="identity" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 4 }}>Your Hero</Text>
      <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#7A7A9A', marginBottom: 20 }}>
        What shall they be called?
      </Text>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
        Character Name *
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter hero name..."
        placeholderTextColor="#5A5A7A"
        style={{ backgroundColor: '#2D2D44', borderColor: '#C9A84C', borderWidth: 1, borderRadius: 4, padding: 10, fontFamily: 'IMFellEnglish-Regular', fontSize: 16, color: '#F0C97A', marginBottom: 16 }}
      />
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 10, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
        Player Name (optional)
      </Text>
      <TextInput
        value={playerName}
        onChangeText={setPlayerName}
        placeholder="Your name..."
        placeholderTextColor="#5A5A7A"
        style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 4, padding: 10, fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#F5E6C8', marginBottom: 16 }}
      />
    </ScrollView>,

    // Step 1: Class
    <ScrollView key="class" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 4 }}>Choose a Class</Text>
      <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#7A7A9A', marginBottom: 16 }}>
        What path does your hero walk?
      </Text>
      {CLASSES.map((cls) => (
        <TouchableOpacity
          key={cls.name}
          onPress={() => setSelectedClass(cls.name)}
          style={{
            backgroundColor: selectedClass === cls.name ? '#2D2A1A' : '#2D2D44',
            borderColor: selectedClass === cls.name ? '#C9A84C' : '#5A5A7A',
            borderWidth: selectedClass === cls.name ? 2 : 1,
            borderRadius: 8, padding: 12, marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 13, color: selectedClass === cls.name ? '#C9A84C' : '#F5E6C8' }}>
              {cls.name}
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 10, color: '#7A7A9A' }}>
              d{cls.hitDiceSize} · {cls.keyStats.join('/')}
              {cls.isCaster ? ' · Caster' : ''}
            </Text>
          </View>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 4 }}>
            {cls.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>,

    // Step 2: Ancestry
    <ScrollView key="ancestry" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 4 }}>Choose Ancestry</Text>
      <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#7A7A9A', marginBottom: 12 }}>
        Where does your bloodline come from?
      </Text>
      <GoldDivider label="Common" />
      {ANCESTRIES.filter((a) => !a.isExotic).map((anc) => (
        <TouchableOpacity
          key={anc.name}
          onPress={() => setSelectedAncestry(anc.name)}
          style={{
            backgroundColor: selectedAncestry === anc.name ? '#2D2A1A' : '#2D2D44',
            borderColor: selectedAncestry === anc.name ? '#C9A84C' : '#5A5A7A',
            borderWidth: selectedAncestry === anc.name ? 2 : 1,
            borderRadius: 8, padding: 10, marginBottom: 6,
          }}
        >
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: selectedAncestry === anc.name ? '#C9A84C' : '#F5E6C8' }}>
            {anc.name}
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 2 }}>
            {anc.trait}
          </Text>
        </TouchableOpacity>
      ))}
      <GoldDivider label="Exotic" />
      {ANCESTRIES.filter((a) => a.isExotic).map((anc) => (
        <TouchableOpacity
          key={anc.name}
          onPress={() => setSelectedAncestry(anc.name)}
          style={{
            backgroundColor: selectedAncestry === anc.name ? '#2D2A1A' : '#2D2D44',
            borderColor: selectedAncestry === anc.name ? '#C9A84C' : '#5A5A7A',
            borderWidth: selectedAncestry === anc.name ? 2 : 1,
            borderRadius: 8, padding: 10, marginBottom: 6,
          }}
        >
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: selectedAncestry === anc.name ? '#C9A84C' : '#F5E6C8' }}>
            {anc.name}
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 2 }}>
            {anc.trait}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>,

    // Step 3: Background
    <ScrollView key="background" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 4 }}>Choose Background</Text>
      <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#7A7A9A', marginBottom: 16 }}>
        What did you do before becoming an adventurer?
      </Text>
      {BACKGROUNDS.map((bg) => (
        <TouchableOpacity
          key={bg.name}
          onPress={() => setSelectedBackground(bg.name)}
          style={{
            backgroundColor: selectedBackground === bg.name ? '#2D2A1A' : '#2D2D44',
            borderColor: selectedBackground === bg.name ? '#C9A84C' : '#5A5A7A',
            borderWidth: selectedBackground === bg.name ? 2 : 1,
            borderRadius: 8, padding: 10, marginBottom: 6,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: selectedBackground === bg.name ? '#C9A84C' : '#F5E6C8' }}>
              {bg.name}
            </Text>
            <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 10, color: '#7A7A9A' }}>
              {bg.skillBonus} · {bg.startingGold}gp
            </Text>
          </View>
          <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 11, color: '#7A6050', marginTop: 2 }}>
            {bg.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>,

    // Step 4: Stats
    <ScrollView key="stats" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 4 }}>Core Stats</Text>
      <Text style={{ fontFamily: 'IMFellEnglish-Italic', fontSize: 13, color: '#7A7A9A', marginBottom: 16 }}>
        Assign your abilities. Nimble has no Constitution — STR covers durability.
      </Text>

      <GoldDivider label="Quick Assign" />
      <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#7A7A9A', marginBottom: 8 }}>
        Tap a preset to assign scores (highest → STR, DEX, INT, WIL):
      </Text>
      {STANDARD_ARRAYS.map((arr, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => applyArray(arr)}
          style={{ backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>
            {arr.join(' · ')}
          </Text>
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 9, color: '#C9A84C' }}>Apply</Text>
        </TouchableOpacity>
      ))}

      <GoldDivider label="Manual Entry" />
      {STAT_KEYS.map((stat) => {
        const mod = Math.floor((stats[stat] - 10) / 2);
        return (
          <View key={stat} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 12, color: '#C9A84C', width: 40 }}>{stat}</Text>
            <TouchableOpacity
              onPress={() => setStats((s) => ({ ...s, [stat]: Math.max(1, s[stat] - 1) }))}
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#F5E6C8', fontSize: 18 }}>−</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 18, color: '#F5E6C8', width: 40, textAlign: 'center' }}>
              {stats[stat]}
            </Text>
            <TouchableOpacity
              onPress={() => setStats((s) => ({ ...s, [stat]: Math.min(20, s[stat] + 1) }))}
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2D2D44', borderColor: '#5A5A7A', borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#F5E6C8', fontSize: 18 }}>+</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#7A7A9A', marginLeft: 12 }}>
              {mod >= 0 ? `+${mod}` : `${mod}`}
            </Text>
          </View>
        );
      })}
    </ScrollView>,

    // Step 5: Review
    <ScrollView key="review" contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 18, color: '#C9A84C', marginBottom: 16 }}>Review & Create</Text>

      {[
        ['Name', name || '—'],
        ['Class', selectedClass],
        ['Ancestry', selectedAncestry],
        ['Background', selectedBackground],
        ['STR', `${stats.STR} (${Math.floor((stats.STR - 10) / 2) >= 0 ? '+' : ''}${Math.floor((stats.STR - 10) / 2)})`],
        ['DEX', `${stats.DEX} (${Math.floor((stats.DEX - 10) / 2) >= 0 ? '+' : ''}${Math.floor((stats.DEX - 10) / 2)})`],
        ['INT', `${stats.INT} (${Math.floor((stats.INT - 10) / 2) >= 0 ? '+' : ''}${Math.floor((stats.INT - 10) / 2)})`],
        ['WIL', `${stats.WIL} (${Math.floor((stats.WIL - 10) / 2) >= 0 ? '+' : ''}${Math.floor((stats.WIL - 10) / 2)})`],
      ].map(([label, value]) => (
        <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomColor: '#3D3D58', borderBottomWidth: 1 }}>
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 11, color: '#C9A84C', textTransform: 'uppercase' }}>{label}</Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 13, color: '#F5E6C8' }}>{value}</Text>
        </View>
      ))}

      <View style={{ height: 24 }} />
      <ThemedButton label="Create Hero" onPress={handleCreate} fullWidth />
    </ScrollView>,
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A2E' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Text style={{ color: '#C9A84C', fontSize: 16 }}>← </Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 14, color: '#F5E6C8', flex: 1 }}>
            {STEPS[step]}
          </Text>
          <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 12, color: '#7A7A9A' }}>
            {step + 1}/{STEPS.length}
          </Text>
        </View>

        <StepIndicator current={step} total={STEPS.length} />

        <View style={{ flex: 1 }}>
          {screens[step]}
        </View>

        {/* Next button (not on review step) */}
        {step < STEPS.length - 1 && (
          <View style={{ padding: 16, paddingBottom: 32 }}>
            <TouchableOpacity
              onPress={() => setStep(step + 1)}
              style={{ backgroundColor: '#C9A84C', borderRadius: 6, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'CinzelDecorative-Bold', fontSize: 13, color: '#1C1008', textTransform: 'uppercase', letterSpacing: 1 }}>
                {step === STEPS.length - 2 ? 'Review →' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
