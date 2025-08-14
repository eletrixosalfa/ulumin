import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getDeviceActions } from '../services/devicecatalogService';
import { deleteDevice } from '../services/devicecatalogService';

export default function DeviceActionsScreen({ route, navigation }) {
  const { device } = route.params;
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (device?.model) {
    fetchActions();
  } else {
    setActions([]);
    setLoading(false);  
  }
}, [device.model]);

  async function fetchActions() {
    setLoading(true);
    try {
      // Busca ações pelo modelo do device
      const result = await getDeviceActions(device.model);
      setActions(result || []);
    } catch (err) {
      console.error('Erro ao buscar ações:', err);
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
      ) : actions.length > 0 ? (
        actions.map(action => (
          <View key={action} style={{ marginBottom: 10 }}>
            <Button
              title={action}
              onPress={() => {
                // TODO: implementar ação específica
                Alert.alert('Ação', `Executando: ${action}`);
              }}
            />
          </View>
        ))
      ) : (
        <Text>Nenhuma ação disponível para este modelo.</Text>
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
