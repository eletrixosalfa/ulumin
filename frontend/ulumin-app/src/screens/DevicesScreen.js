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

const categories = [ 
  { id: 'switch', name: 'Interruptores', icon: 'light-switch' },
  { id: 'sensor', name: 'Sensores', icon: 'motion-sensor' },
  { id: 'camera', name: 'Câmeras', icon: 'cctv' },
  { id: 'blinds', name: 'Estores', icon: 'blinds' },
  { id: 'light', name: 'Luzes', icon: 'lightbulb' },
];

const devicesCatalog = [  
  { id: '1', name: 'Interruptor', category: 'switch', icon: 'light-switch' },
  { id: '2', name: 'Sensor de Movimento', category: 'sensor', icon: 'motion-sensor' },
  { id: '3', name: 'Câmera de Vigilância', category: 'camera', icon: 'cctv' },
  { id: '4', name: 'Estor', category: 'blinds', icon: 'blinds' },
  { id: '5', name: 'Luz', category: 'light', icon: 'lightbulb' },
];

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const [devices, setDevices] = useState([]);
  const [deviceStates, setDeviceStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [deviceForActions, setDeviceForActions] = useState(null);

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
      const initialStates = {};
      data.forEach(d => {
        initialStates[d._id] = false; // padrão desligado
      });
      setDeviceStates(initialStates);
    } catch (err) {
      setError('Erro ao carregar dispositivos.');
       console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDevice() {
    if (!selectedDevice) {
      Alert.alert('Seleção necessária', 'Por favor, selecione um dispositivo.');
      return;
    }
    setSaving(true);
    try {
      const createdDevice = await createDevice({
        name: selectedDevice.name,
        category: selectedDevice.category,
        room: roomId,
      });
      setDevices(prev => [...prev, createdDevice]);
      setDeviceStates(prev => ({ ...prev, [createdDevice._id]: false }));
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

  function getCategoryIcon(category) {
  switch (category) {
    case 'switch':
      return 'light-switch';
    case 'sensor':
      return 'motion-sensor';
    case 'camera':
      return 'cctv';
    case 'blinds':
      return 'blinds';
    case 'light':
      return 'lightbulb';
    default:
      return 'devices';
  }
}

  const getDeviceActions = (device) => {
  switch (device.category) {
    case 'light':
      return ['Ligar', 'Desligar', 'Alternar', 'Temporizado'];
    case 'switch':
      return ['Ligar', 'Desligar', 'Alternar', 'Temporizado'];
    case 'sensor':
      return ['Ativar', 'Desativar'];
    case 'camera':
      return ['Ver feed'];
    case 'blinds':
      return ['Subir', 'Descer', 'Parar'];
    default:
      return [];
  }
};

  function handleDeleteDevice(id) {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este dispositivo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDevice(id);
            setDevices(prev => prev.filter(d => d._id !== id));
            setDeviceStates(prev => {
              const newStates = { ...prev };
              delete newStates[id];
              return newStates;
            });
          } catch (err) {
            console.error('Erro ao excluir dispositivo:', err);
          }
        },
      },
    ]);
  }

  function openDeviceActions(device) {
  setDeviceForActions(device);
  setActionModalVisible(true);
}

  const devicesInCategory = selectedCategory
    ? devicesCatalog.filter(d => d.category === selectedCategory)
    : [];

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>A carregar dispositivos...</Text>
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

  <Modal visible={actionModalVisible} transparent animationType="slide">
  <TouchableOpacity
    style={styles.modalOverlay}
    onPress={() => setActionModalVisible(false)}
    activeOpacity={1}
  >
    <View style={styles.modalActionsContainer}>
      <Text style={styles.modalTitle}>
        Ações para: {deviceForActions?.name}
      </Text>

      {getDeviceActions(deviceForActions || {}).map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => {
            Alert.alert('Executar ação', `${action} em ${deviceForActions?.name}`);
            setActionModalVisible(false);
            // Acionar MQTT ou lógica real futuramente
          }}
        >
          <Text>{action}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={() => setActionModalVisible(false)}
      >
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>


return (
  <View style={styles.container}>
    {devices.length === 0 ? (
  <View style={styles.containerCentered}>
    <Text style={{ color: '#555', fontSize: 16 }}>Esta divisão não possui dispositivos.</Text>
  </View>
) : (
  <FlatList
    data={devices}
    keyExtractor={item => item._id.toString()}
    numColumns={2}
    contentContainerStyle={styles.grid}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    renderItem={({ item }) => (
      <View style={styles.deviceCard}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => openDeviceActions(item)} 
        >
          <Text style={{ fontSize: 30 }}>⋮</Text>
        </TouchableOpacity>
        <Icon name={item.icon || getCategoryIcon(item.category)} size={40} color="#333" style={{ marginBottom: 10 }} />
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
)}


    {/* Modal de ações */}
    <Modal visible={actionModalVisible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setActionModalVisible(false)}
        activeOpacity={1}
      >
        <View style={styles.modalActionsContainer}>
          <Text style={styles.modalTitle}>
            Ações para: {deviceForActions?.name}
          </Text>

          {getDeviceActions(deviceForActions || {}).map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                Alert.alert('Executar ação', `${action} em ${deviceForActions?.name}`);
                setActionModalVisible(false);
              }}
            >
              <Text>{action}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => setActionModalVisible(false)}
          >
            <Text color="red" style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>

    {/* Modal de seleção */}
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {!selectedCategory ? 'Selecione uma categoria' : 'Selecione um dispositivo'}
          </Text>

          {!selectedCategory ? (
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setSelectedCategory(item.id);
                    setSelectedDevice(null);
                    setSelectedId(null);
                  }}
                >
                  <Icon name={item.icon} size={30} style={{ marginRight: 10 }} />
                  <Text style={styles.title}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedDevice(null);
                  setSelectedId(null);
                }}
                style={{ marginBottom: 10 }}
              >
                <Text style={{ color: 'blue' }}>← Voltar</Text>
              </TouchableOpacity>

              <FlatList
                data={devicesInCategory}
                keyExtractor={item => item.id}
                extraData={selectedId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      {
                        backgroundColor: selectedId === item.id ? '#6e3b6e' : '#f9c2ff',
                      },
                    ]}
                    onPress={() => {
                      setSelectedId(item.id);
                      setSelectedDevice(item);
                    }}
                  >
                    <Icon
                      name={item.icon}
                      size={30}
                      color={selectedId === item.id ? 'white' : 'black'}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        color: selectedId === item.id ? 'white' : 'black',
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

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
                { opacity: saving || !selectedDevice ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.buttonText}>
                {saving ? 'A adicionar...' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);
}