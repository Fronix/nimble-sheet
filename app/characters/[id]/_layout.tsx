import { Tabs, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useCharacterStore } from '../../../src/store/characterStore';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 16, opacity: focused ? 1 : 0.45 }}>{label}</Text>;
}

export default function CharacterLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const character = useCharacterStore((s) => s.characters[id]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#C9A84C',
          borderTopWidth: 1,
          height: 58,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#5A5A7A',
        tabBarLabelStyle: {
          fontFamily: 'CinzelDecorative-Regular',
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ focused }) => <TabIcon label="⚔" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: 'Sheet',
          tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="spells"
        options={{
          title: 'Spells',
          tabBarIcon: ({ focused }) => <TabIcon label="✨" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Items',
          tabBarIcon: ({ focused }) => <TabIcon label="🎒" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ focused }) => <TabIcon label="📖" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
