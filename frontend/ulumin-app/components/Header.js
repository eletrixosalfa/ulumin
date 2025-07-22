import React from 'react';
import { Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={{ padding: 20, backgroundColor: '#3b82f6' }}>
      <Text style={{ color: 'white', fontSize: 20 }}>Ulumin App</Text>
    </View>
  );
}
