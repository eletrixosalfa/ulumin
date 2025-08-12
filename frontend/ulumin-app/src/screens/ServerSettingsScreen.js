import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../styles/ServerSettingsScreen.styles';
import * as mqttService from '../services/mqttService';

export default function ServerSettingsScreen() {
  const [config, setConfig] = useState({
    host: '',
    port: '',
    user: '',
    pass: '',
    ssl: false,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await mqttService.getMqttConfig();
      setConfig({
        host: data.host || '',
        port: data.port ? String(data.port) : '',
        user: data.user || '',
        pass: data.pass || '',
        ssl: data.ssl || false,
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar a configuração MQTT.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const stat = await mqttService.getMqttStatus();
      console.log('Status MQTT do backend:', stat)
      setStatus(stat.status === 'connected' ? '✅ Conectado' : '❌ Desconectado');
    } catch (error) {
      console.error('Erro ao obter status MQTT:', error);
      setStatus('❌ Desconectado');
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStatus();
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    try {
      await mqttService.createOrUpdateMqttConfig({
        ...config,
        port: Number(config.port),
      });
      Alert.alert('Sucesso', 'Configuração guardada!');
      fetchStatus();
    } catch {
      Alert.alert('Erro', 'Falha ao guardar configuração.');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await mqttService.testMqttConnection(config);
      Alert.alert('Teste de Conexão', result.success ? 'Conectado com sucesso!' : 'Falha na conexão');
      fetchStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao testar conexão.';
      Alert.alert('Erro', message);
    } finally {
      setTesting(false);
    }
  }

  const resetConfig = async () => {
    try {
      await mqttService.resetMqttConfig();
      Alert.alert('Reset', 'Configuração resetada para padrão.');
      fetchConfig();
      fetchStatus();
    } catch {
      Alert.alert('Erro', 'Falha ao resetar configuração.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.label}>Host:</Text>
          <TextInput
            style={styles.input}
            value={config.host}
            onChangeText={(text) => setConfig({ ...config, host: text })}
            placeholder="Host MQTT"
          />

          <Text style={styles.label}>Porta:</Text>
          <TextInput
            style={styles.input}
            value={config.port}
            onChangeText={(text) => setConfig({ ...config, port: text.replace(/[^0-9]/g, '') })}
            keyboardType="numeric"
            placeholder="Porta"
          />

          <Text style={styles.label}>Usuário:</Text>
          <TextInput
            style={styles.input}
            value={config.user}
            onChangeText={(text) => setConfig({ ...config, user: text })}
            placeholder="Usuário MQTT"
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            value={config.pass}
            onChangeText={(text) => setConfig({ ...config, pass: text })}
            placeholder="Senha MQTT"
            secureTextEntry
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>SSL:</Text>
            <Switch
              value={config.ssl}
              onValueChange={(value) => setConfig({ ...config, ssl: value })}
            />
          </View>

          <Text style={styles.status}>Status: {status || 'A carregar...'}</Text>

          <TouchableOpacity style={styles.button} onPress={saveConfig} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'A guardar...' : 'Guardar Configuração'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testConnection} disabled={testing}>
            <Text style={styles.buttonText}>{testing ? 'A testar...' : 'Testar Conexão'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#d9534f' }]}
            onPress={resetConfig}
          >
            <Text style={styles.buttonText}>Resetar Configuração</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}