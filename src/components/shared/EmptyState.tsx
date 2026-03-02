import React from 'react';
import { View, Text } from 'react-native';
import ThemedButton from './ThemedButton';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontFamily: 'CinzelDecorative-Regular', fontSize: 20, color: '#C9A84C', textAlign: 'center', marginBottom: 8 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ fontFamily: 'IMFellEnglish-Regular', fontSize: 14, color: '#7A6050', textAlign: 'center', marginBottom: 20 }}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <ThemedButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
