import React from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function ParchmentCard({ children, noPadding = false, style, ...props }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: '#F5E6C8',
          borderColor: '#C4A96A',
          borderWidth: 1,
          borderRadius: 6,
          padding: noPadding ? 0 : 12,
          marginBottom: 10,
          shadowColor: '#1C1008',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
