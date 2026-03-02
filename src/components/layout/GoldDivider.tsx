import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  label?: string;
}

export default function GoldDivider({ label }: Props) {
  if (!label) {
    return <View style={{ height: 1, backgroundColor: '#C9A84C', marginVertical: 10, opacity: 0.6 }} />;
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: '#C9A84C', opacity: 0.6 }} />
      <Text style={{ color: '#C9A84C', fontSize: 10, fontFamily: 'CinzelDecorative-Regular', marginHorizontal: 8, textTransform: 'uppercase', letterSpacing: 2 }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#C9A84C', opacity: 0.6 }} />
    </View>
  );
}
