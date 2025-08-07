import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/ServerSettingsScreen.styles';
import api from '../api/api';

export default function ServerSettingsScreen() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState('Desconhecido');

  // Buscar configuração atual ao iniciar
  useEffect(() => {
    fetchConfig();
    fetchStatus();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/mqttconfig');
      setConfig(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a configuração MQTT.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get('/mqttconfig/status');
      setStatus(response.data.connected ? '✅ Conectado' : '❌ Desconectado');
    } catch {
      setStatus('❌ Desconhecido');
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/mqttconfig/${config._id}`, config);
      Alert.alert('Sucesso', 'Configuração atualizada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a configuração.');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await api.post('/mqttconfig/test', config);
      if (response.data.success) {
        Alert.alert('✅ Conexão bem-sucedida');
      } else {
        Alert.alert('❌ Falha na conexão');
      }
    } catch {
      Alert.alert('Erro', 'Erro ao testar conexão.');
    } finally {
      setTesting(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await api.post('/mqttconfig/reset');
      setConfig(response.data);
      Alert.alert('Configuração resetada para padrão.');
    } catch {
      Alert.alert('Erro', 'Não foi possível resetar a configuração.');
    }
  };

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  if (loading || !config) {
    return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuração do Servidor MQTT</Text>

      <Text style={styles.label}>Host</Text>
      <TextInput
        style={styles.input}
        value={config.host}
        onChangeText={text => handleChange('host', text)}
      />

      <Text style={styles.label}>Porta</Text>
      <TextInput
        style={styles.input}
        value={String(config.port)}
        keyboardType="numeric"
        onChangeText={text => handleChange('port', parseInt(text))}
      />

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        value={config.user}
        onChangeText={text => handleChange('user', text)}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={config.pass}
        onChangeText={text => handleChange('pass', text)}
        secureTextEntry
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Usar SSL</Text>
        <Switch
          value={config.ssl}
          onValueChange={value => handleChange('ssl', value)}
        />
      </View>

      <Text style={styles.status}>Status: {status}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleTestConnection}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'A testar...' : 'Testar Conexão'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={[styles.buttonText, { color: 'red' }]}>Resetar</Text>
      </TouchableOpacity>
    </View>
  );
}
