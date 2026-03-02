import React from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function StonePanel({ children, noPadding = false, style, ...props }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: '#2D2D44',
          borderColor: '#5A5A7A',
          borderWidth: 1,
          borderRadius: 6,
          padding: noPadding ? 0 : 12,
          marginBottom: 10,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
