import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/SettingsScreen.styles';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserSettings')}
      >
        <Text style={styles.buttonText}>Configurações de Usuário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ServerSettings')}
      >
        <Text style={styles.buttonText}>Configurações de Servidor</Text>
      </TouchableOpacity>
    </View>
  );
}
