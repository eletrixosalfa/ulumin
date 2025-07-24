import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { getDevices, createDevice, deleteDevice } from '../services/devicesService';
import styles from '../styles/DevicesScreen.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const devicesCatalog = [
  { id: '1', name: 'Interruptor', category: 'switch', icon: 'light-switch' },
  { id: '2', name: 'Sensor de Movimento', category: 'sensor', icon: 'motion-sensor' },
  { id: '3', name: 'Câmera de Vigilância', category: 'camera', icon: 'cctv' },
  { id: '4', name: 'Estores', category: 'blinds', icon: 'blinds' },
  { id: '5', name: 'Luz', category: 'light', icon: 'lightbulb' },
];

// Componente da lista para selecionar dispositivo
function DeviceSelectionList({ onSelectDevice, selectedId, setSelectedId }) {
  const handleSelect = (id) => {
    const device = devicesCatalog.find(d => d.id === id);
    console.log('Dispositivo escolhido:', device);
    setSelectedId(id);
    if (onSelectDevice) onSelectDevice(device);
  };

  return (
    <FlatList
      data={devicesCatalog}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
        const color = item.id === selectedId ? 'white' : 'black';
        return (
          <TouchableOpacity
            style={[styles.item, { backgroundColor }]}
            onPress={() => handleSelect(item.id)}
          >
            <Icon name={item.icon} size={30} color={color} style={{ marginRight: 10 }} />
            <Text style={[styles.title, { color }]}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
      extraData={selectedId}
    />
  );
}

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Para seleção do dispositivo no modal
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: `Dispositivos - ${roomName}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setSelectedDevice(null);
            setSelectedId(null);
          }}
          style={{ marginRight: 20, marginBottom: 5 }}
        >
          <Text style={{ fontSize: 40, color: 'black' }}>+</Text>
        </TouchableOpacity>
      ),
    });
    fetchDevices();
  }, [navigation, roomName]);

  async function fetchDevices() {
    setLoading(true);
    setError(null);
    try {
      const data = await getDevices(roomId);
      setDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDevice() {
    if (!selectedDevice) {
      Alert.alert('Seleção necessária', 'Por favor, selecione um dispositivo para adicionar.');
      return;
    }
    setSaving(true);
    try {
      console.log('Dispositivo selecionado:', selectedDevice);
    const createdDevice = await createDevice({
    name: selectedDevice.name,
    category: selectedDevice.category,
    roomId
});


      setDevices(prev => [...prev, createdDevice]);
      setModalVisible(false);
      setSelectedDevice(null);
      setSelectedId(null);
    } catch (err) {
      console.error('Erro ao criar dispositivo:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o dispositivo.');
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteDevice(id) {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja excluir este dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(id);
              setDevices(prev => prev.filter(d => d._id !== id));
            } catch (err) {
              console.error('Erro ao excluir dispositivo:', err);
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando dispositivos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.containerCentered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        keyExtractor={item => item._id.toString()}
        ListEmptyComponent={<Text>Nenhum dispositivo encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => handleDeleteDevice(item._id)}
            >
              <Text style={styles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal com lista para escolher dispositivo */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione um dispositivo</Text>

            <DeviceSelectionList
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onSelectDevice={setSelectedDevice}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedDevice(null);
                  setSelectedId(null);
                }}
                disabled={saving}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddDevice}
                disabled={saving}
                style={styles.buttonSave}
              >
                <Text style={styles.buttonText}>
                  {saving ? 'Adicionando...' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}