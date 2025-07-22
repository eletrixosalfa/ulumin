import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../styles/LoginScreen.styles';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      navigation.replace('App');
    } catch (error) {
      setErrorMsg('Erro ao fazer login. Verifica email e senha.');
      console.log('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMsg ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</Text> : null}
      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tens conta? Regista-te</Text>
      </TouchableOpacity>
    </View>
  );
}