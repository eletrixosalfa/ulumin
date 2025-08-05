import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/DeviceActionsScreen.styles';

export default function DeviceActionsScreen({ route }) {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ações do Dispositivo</Text>
      {/* Adicionar as ações que quiser */}
    </View>
  );
}

