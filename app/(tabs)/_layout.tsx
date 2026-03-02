import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{
      fontSize: 18,
      opacity: focused ? 1 : 0.5,
    }}>{label}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#C9A84C',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#7A7A9A',
        tabBarLabelStyle: {
          fontFamily: 'CinzelDecorative-Regular',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Heroes',
          tabBarIcon: ({ focused }) => <TabIcon label="⚔" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dice"
        options={{
          title: 'Dice',
          tabBarIcon: ({ focused }) => <TabIcon label="🎲" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Tome',
          tabBarIcon: ({ focused }) => <TabIcon label="📜" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
