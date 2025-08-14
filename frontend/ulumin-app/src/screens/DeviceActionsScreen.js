import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getDeviceActions, deleteDevice } from '../services/devicesService';

export default function DeviceActionsScreen({ route, navigation }) {
  const { device } = route.params;
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, []);

  async function fetchActions() {
    setLoading(true);
    try {
      // Exemplo: busca ações pelo modelo
      const result = await getDeviceActions(device.model);
      setActions(result.actions || []);
    } catch (err) {
      setActions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      'Excluir dispositivo',
      'Tem certeza que deseja excluir este dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(device._id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o dispositivo.');
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{device.name}</Text>
      <Text style={{ marginBottom: 20 }}>Modelo: {device.model}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        actions.map(action => (
          <Button
            key={action}
            title={action}
            onPress={() => {/* implementar ação específica */}}
            style={{ marginBottom: 10 }}
          />
        ))
      )}
      <View style={{ marginTop: 30 }}>
        <Button
          title="Excluir dispositivo"
          color="#cc0000"
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
}