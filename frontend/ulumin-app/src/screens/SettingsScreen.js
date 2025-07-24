import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Switch, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';  // ajuste o caminho
import styles from '../styles/SettingsScreen.styles';

export default function SettingsScreen() {
  const { logout } = useContext(AuthContext);

  const [server, setServer] = useState('');
  const [port, setPort] = useState('1883');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ssl, setSsl] = useState(false);

  useEffect(() => {
    const loadUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setUsername(storedEmail);
      }
    };
    loadUserEmail();
  }, []);

  const testConnection = () => {
    console.log('Testar MQTT:', { server, port, username, password, ssl });
  };

  return (
    <View style={styles.container}>
      {/* seus inputs aqui */}
      <Text style={styles.label}>Servidor MQTT</Text>
      <TextInput style={styles.input} value={server} onChangeText={setServer} placeholder="mqtt.exemplo.com" />

      <Text style={styles.label}>Porta</Text>
      <TextInput
        style={styles.input}
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
        placeholder="1883"
      />

      <Text style={styles.label}>Usuário</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="user" />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>SSL</Text>
        <Switch value={ssl} onValueChange={setSsl} />
      </View>

      <Button title="Testar conexão" onPress={testConnection} />

      <View style={{ marginTop: 20 }}>
        <Button title="Terminar Sessão" color="red" onPress={logout} />
      </View>
    </View>
  );
}
