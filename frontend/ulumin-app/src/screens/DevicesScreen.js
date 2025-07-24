import React, { useEffect, useState } from 'react'; 
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getDevices, createDevice, deleteDevice } from '../services/devicesService';
import styles from '../styles/DevicesScreen.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Lista de categorias
const categories = [
  { id: 'switch', name: 'Interruptores', icon: 'light-switch' },
  { id: 'sensor', name: 'Sensores', icon: 'motion-sensor' },
  { id: 'camera', name: 'Câmeras', icon: 'cctv' },
  { id: 'blinds', name: 'Estores', icon: 'blinds' },
  { id: 'light', name: 'Luzes', icon: 'lightbulb' },
];

// Lista de dispositivos criados
const devicesCatalog = [
  { id: '1', name: 'Interruptor', category: 'switch', icon: 'light-switch' },
  { id: '2', name: 'Sensor de Movimento', category: 'sensor', icon: 'motion-sensor' },
  { id: '3', name: 'Câmera de Vigilância', category: 'camera', icon: 'cctv' },
  { id: '4', name: 'Estores', category: 'blinds', icon: 'blinds' },
  { id: '5', name: 'Luz', category: 'light', icon: 'lightbulb' },
];

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para seleção em 2 passos
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: `Dispositivos - ${roomName}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setSelectedCategory(null);
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
      setSelectedCategory(null);
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

  // Filtra dispositivos do catálogo para categoria selecionada
  const devicesInCategory = selectedCategory
    ? devicesCatalog.filter(d => d.category === selectedCategory)
    : [];

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

      {/* Modal para seleção em dois passos */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text
              style={[
                styles.modalTitle,
                { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10, marginBottom: 10 }
              ]}
            >
              {!selectedCategory ? 'Selecione uma categoria' : 'Selecione um dispositivo'}
            </Text>

            {!selectedCategory ? (
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#ccc',
                      marginVertical: 5,
                    }}
                  />
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.item, { borderBottomWidth: 0 }]}
                    onPress={() => {
                      setSelectedCategory(item.id);
                      setSelectedId(null);
                      setSelectedDevice(null);
                    }}
                  >
                    <Icon name={item.icon} size={30} style={{ marginRight: 10 }} />
                    <Text style={styles.title}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(null);
                    setSelectedId(null);
                    setSelectedDevice(null);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <Text style={{ color: 'blue', fontWeight: '600' }}>← Voltar para categorias</Text>
                </TouchableOpacity>

                <FlatList
                  data={devicesInCategory}
                  keyExtractor={item => item.id}
                  extraData={selectedId}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#ccc',
                        marginVertical: 5,
                      }}
                    />
                  )}
                  renderItem={({ item }) => {
                    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
                    const color = item.id === selectedId ? 'white' : 'black';
                    return (
                      <TouchableOpacity
                        style={[styles.item, { backgroundColor, borderBottomWidth: 0 }]}
                        onPress={() => {
                          setSelectedId(item.id);
                          setSelectedDevice(item);
                        }}
                      >
                        <Icon
                          name={item.icon}
                          size={30}
                          color={color}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={[styles.title, { color }]}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={{ paddingBottom: 40 }}
                />
              </>
            )}

            {/* Separador visual */}
            <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />

            {/* Botões */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedCategory(null);
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
                disabled={saving || !selectedDevice}
                style={[
                  styles.buttonSave,
                  { opacity: saving || !selectedDevice ? 0.5 : 1 }
                ]}
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
