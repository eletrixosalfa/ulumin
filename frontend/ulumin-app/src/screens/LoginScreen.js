import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import styles from '../styles/LoginScreen.styles';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      if (!token) throw new Error('Token não recebido');

      await login(token); // chama login do contexto que armazena token e atualiza estado
      // navegação será atualizada automaticamente pelo StackNavigator 

    } catch (error) {
      setErrorMsg('Erro ao fazer login. Verifica email e senha.');
      console.log('Login error:', error.response?.data || error.message);
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