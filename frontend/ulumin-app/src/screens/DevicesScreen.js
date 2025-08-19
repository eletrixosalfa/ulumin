import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getDevicesByRoom,
  createDevice,
} from '../services/devicesService';
import { discoverDevices } from '../services/mqttService';
import styles from '../styles/DevicesScreen.styles';
import { useFocusEffect } from '@react-navigation/native';

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [error, setError] = useState(null);

  const [modalDeviceVisible, setModalDeviceVisible] = useState(false);

  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [loadingDiscoveredDevices, setLoadingDiscoveredDevices] = useState(false);

  const [selectedDispositivo, setSelectedDispositivo] = useState(null);
  const [newDeviceIcon, setNewDeviceIcon] = useState('devices');

  const [activeDeviceId, setActiveDeviceId] = useState(null);

  const devicesRef = useRef([]);


  useEffect(() => {
    fetchDevicesInRoom();
  }, []);

 async function fetchDevicesInRoom() {
  setLoadingDevices(true);
  setError(null);
  try {
    const data = await getDevicesByRoom(roomId);
    // mantém isOn local se já existia
    setDevices(prev => {
      devicesRef.current = data.map(d => {
        const localDevice = prev.find(pd => pd._id === d._id);
        return { ...d, isOn: localDevice ? localDevice.isOn : (d.isOn || false) };
      });
      return devicesRef.current;
    });
  } catch (err) {
    setError('Erro ao carregar dispositivos da divisão.');
    console.error(err);
  } finally {
    setLoadingDevices(false);
  }
}


  useEffect(() => {
    navigation.setOptions({
      title: `Dispositivos - ${roomName}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            setModalDeviceVisible(true);
            setLoadingDiscoveredDevices(true);
            setDiscoveredDevices([]);
            setSelectedDispositivo(null);
            setNewDeviceIcon('devices');
            try {
              const found = await discoverDevices();
              setDiscoveredDevices(found);
            } catch (err) {
              setDiscoveredDevices([]);
            } finally {
              setLoadingDiscoveredDevices(false);
            }
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ fontSize: 40, color: '#6e3b6e' }}>＋</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, roomName]);

  async function handleAddDeviceFromDiscovered(device) {
    try {
      const createdDevice = await createDevice({
        name: device.name,
        room: roomId,
        icon: device.icon || 'devices',
        mqttId: device.id,
        ...(device.model ? { model: device.model } : {}),
      });
      setDevices(prev => [...prev, { ...createdDevice, isOn: false }]);
      setModalDeviceVisible(false);
      setDiscoveredDevices([]);
      setSelectedDispositivo(null);
      setNewDeviceIcon('devices');
    } catch (err) {
      console.error('Erro ao adicionar dispositivo', err);
      Alert.alert('Erro', 'Não foi possível adicionar o dispositivo');
    }
  }

  function toggleDevice(deviceId) {
  devicesRef.current = devicesRef.current.map(d =>
    d._id === deviceId ? { ...d, isOn: !d.isOn } : d
  );
  setDevices([...devicesRef.current]);
  setActiveDeviceId(deviceId);
}


  useFocusEffect(
    React.useCallback(() => {
      fetchDevicesInRoom();
    }, [roomId])
  );

  if (loadingDevices) {
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

  // Componente de card animado
  const AnimatedDeviceCard = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (item._id === activeDeviceId) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  },[activeDeviceId]);

    const borderColor = item.isOn ? '#00cc00' : '#ccc';
    const iconColor = item.isOn ? '#00cc00' : '#333';

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 10, flex: 1, marginHorizontal: 5 }}>
        <TouchableOpacity
          style={[styles.deviceCard, { borderColor, borderWidth: 2 }]}
          onPress={() => toggleDevice(item._id)}
          onLongPress={() => navigation.navigate('DeviceActions', {
            device: item,
            isOn: item.isOn,
          onToggle: (newIsOn) => {
            setDevices(prev =>
              prev.map(d =>
                d._id === item._id ? { ...d, isOn: newIsOn } : d
      )
    );
  }
})}

          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Icon name={item.icon || 'devices'} size={40} color={iconColor} />
          </View>
          <Text style={styles.deviceName}>{item.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {devices.length === 0 ? (
        <View style={styles.containerCentered}>
          <Text style={{ color: '#555', fontSize: 16 }}>
            Esta divisão não possui dispositivos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <AnimatedDeviceCard item={item} />}
        />
      )}

      {/* Modal para adicionar dispositivo real */}
      <Modal visible={modalDeviceVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Adicionar Dispositivo
            </Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
              Dispositivos encontrados na rede:
            </Text>
            {loadingDiscoveredDevices ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : discoveredDevices.length > 0 ? (
              <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
                {discoveredDevices.map(device => (
                  <TouchableOpacity
                    key={device.id}
                    onPress={() => setSelectedDispositivo(device)}
                    style={{
                      padding: 14,
                      backgroundColor: selectedDispositivo?.id === device.id ? '#cceeff' : '#e0ffe0',
                      borderRadius: 8,
                      marginBottom: 5,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon
                        name="access-point"
                        size={24}
                        color="#007AFF"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={{ color: '#333' }}>
                        {device.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ marginBottom: 10, fontStyle: 'italic' }}>
                Nenhum dispositivo encontrado.
              </Text>
            )}

            {/* Escolher ícone */}
            <Text style={{ marginTop: 10, fontWeight: 'bold'}}>Escolha um ícone:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {[
                'lightbulb',
                'light-switch',
                'motion-sensor',
                'television',
                'camera',
                'speaker',
                'blinds',
              ].map(iconName => (
                <TouchableOpacity
                  key={iconName}
                  onPress={() => setNewDeviceIcon(iconName)}
                  style={{
                    marginRight: 15,
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: newDeviceIcon === iconName ? '#6e3b6e' : '#eee',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                  }}
                >
                  <Icon
                    name={iconName}
                    size={30}
                    color={newDeviceIcon === iconName ? '#fff' : '#666'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Botão adicionar */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalDeviceVisible(false);
                  setDiscoveredDevices([]);
                  setSelectedDispositivo(null);
                  setNewDeviceIcon('devices');
                }}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (selectedDispositivo) {
                    handleAddDeviceFromDiscovered({
                      ...selectedDispositivo,
                      icon: newDeviceIcon
                    });
                  }
                }}
                disabled={!selectedDispositivo}
                style={{ opacity: selectedDispositivo ? 1 : 0.5 }}
              >
                <Text style={{ color: '#6e3b6e', fontWeight: 'bold' }}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
