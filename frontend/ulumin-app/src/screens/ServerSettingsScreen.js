import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from '../styles/ServerSettingsScreen.styles';
import * as mqttService from '../services/mqttService'; // você vai criar isso

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

  // 1. Buscar configuração atual
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await mqttService.getConfig();
      setConfig({
        host: data.host || '',
        port: data.port ? String(data.port) : '',
        user: data.user || '',
        pass: data.pass || '',
        ssl: data.ssl || false,
      });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar a configuração MQTT.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStatus();
  }, []);

  // 5. Buscar status atual
  const fetchStatus = async () => {
    try {
      const stat = await mqttService.getStatus();
      setStatus(stat.connected ? '✅ Conectado' : '❌ Desconectado');
    } catch {
      setStatus('❌ Desconectado');
    }
  };

  // 2. Salvar configuração
  const saveConfig = async () => {
    setSaving(true);
    try {
      await mqttService.updateConfig({
        ...config,
        port: Number(config.port),
      });
      Alert.alert('Sucesso', 'Configuração salva!');
      fetchStatus();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar configuração.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Testar conexão
  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await mqttService.testConnection(config);
      Alert.alert('Teste de Conexão', result.success ? 'Conectado com sucesso!' : 'Falha na conexão');
      fetchStatus();
    } catch {
      Alert.alert('Erro', 'Erro ao testar conexão.');
    } finally {
      setTesting(false);
    }
  };

  // 4. Resetar configuração
  const resetConfig = async () => {
    try {
      await mqttService.resetConfig();
      Alert.alert('Reset', 'Configuração resetada para padrão.');
      fetchConfig();
      fetchStatus();
    } catch {
      Alert.alert('Erro', 'Falha ao resetar configuração.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
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

      <Text style={styles.status}>Status: {status || 'Carregando...'}</Text>

      <TouchableOpacity style={styles.button} onPress={saveConfig} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar Configuração'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testConnection} disabled={testing}>
        <Text style={styles.buttonText}>{testing ? 'Testando...' : 'Testar Conexão'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#d9534f' }]} onPress={resetConfig}>
        <Text style={styles.buttonText}>Resetar Configuração</Text>
      </TouchableOpacity>
    </View>
  );
}
