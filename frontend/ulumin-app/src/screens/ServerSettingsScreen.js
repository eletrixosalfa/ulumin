import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ServerSettingsScreen.styles';

export default function ServerSettingsScreen() {
  const [serverUrl, setServerUrl] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedUrl = await AsyncStorage.getItem('serverUrl');
    const savedPort = await AsyncStorage.getItem('serverPort');
    if (savedUrl) setServerUrl(savedUrl);
    if (savedPort) setPort(savedPort);
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('serverUrl', serverUrl);
      await AsyncStorage.setItem('serverPort', port);
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar configurações');
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${serverUrl}:${port}/`);
      if (response.ok) {
        Alert.alert('Conexão bem-sucedida!');
      } else {
        Alert.alert('Erro', 'Não foi possível conectar');
      }
    } catch (error) {
      Alert.alert('Erro', 'Conexão falhou: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>URL do Servidor</Text>
      <TextInput
        style={styles.input}
        value={serverUrl}
        onChangeText={setServerUrl}
        placeholder="Ex: https://ulumin-backend.onrender.com"
      />

      <Text style={styles.label}>Porta</Text>
      <TextInput
        style={styles.input}
        value={port}
        onChangeText={setPort}
        placeholder="Ex: 443"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={saveSettings}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>Testar Conexão</Text>
      </TouchableOpacity>
    </View>
  );
}
