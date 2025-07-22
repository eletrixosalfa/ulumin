import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/LoginScreen.styles';
import api from '../api/axios';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('Erro', 'Preenche todos os campos.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Erro', 'Insira um email válido.');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return Alert.alert(
        'Erro',
        'A senha deve cumprir os seguintes requisitos:\n\n' +
        '- Ter pelo menos 8 caracteres\n' +
        '- Incluir pelo menos 1 letra maiúscula\n' +
        '- Incluir pelo menos 1 letra minúscula\n' +
        '- Incluir pelo menos 1 número\n' +
        '- Incluir pelo menos 1 caractere especial.'
      );
    }

    if (password !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
      });

      Alert.alert('Sucesso', 'Registo feito com sucesso!');
      navigation.replace('Login');
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Erro ao registar. Este email já existe?');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registo</Text>
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
      <TextInput
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Registar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tens conta? Inicia sessão</Text>
      </TouchableOpacity>
    </View>
  );
}