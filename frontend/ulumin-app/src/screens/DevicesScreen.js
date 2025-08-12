import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  getDevicesByCategoryAndRoom,
  getDevicesByRoom,
  createDevice,
  deleteDevice,
} from '../services/devicesService';

import {
  getCategories,
  createCategory,
  deleteCategory
} from '../services/categoriesService';

import styles from '../styles/DevicesScreen.styles';

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [devices, setDevices] = useState([]);
  const [categoryDevices, setCategoryDevices] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [loadingCategoryDevices, setLoadingCategoryDevices] = useState(false);

  const [error, setError] = useState(null);

  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [modalDeviceVisible, setModalDeviceVisible] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIcon, setNewDeviceIcon] = useState('devices');

  const [selectedExistingDevice, setSelectedExistingDevice] = useState(null);
  
  useEffect(() => {
    fetchCategories();
    fetchDevicesInRoom();
  }, []);

  async function fetchDevicesInRoom() {
    setLoadingDevices(true);
    setError(null);
    try {
      const data = await getDevicesByRoom(roomId);
      setDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos da divisão.');
      console.error(err);
    } finally {
      setLoadingDevices(false);
    }
  }

  async function fetchDevicesByCategory(categoryId) {
    setLoadingCategoryDevices(true);
    setError(null);
    try {
      const data = await getDevicesByCategoryAndRoom(categoryId, roomId);
      setCategoryDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos da categoria.');
      console.error(err);
    } finally {
      setLoadingCategoryDevices(false);
    }
  }

  async function fetchCategories() {
    setLoadingCategories(true);
    setError(null);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      setError('Erro ao carregar categorias.');
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function onSelectCategory(category) {
    setSelectedCategory(category);
    await fetchDevicesByCategory(category._id);
    setModalCategoryVisible(false);
    setModalDeviceVisible(true);
    setNewDeviceName('');
    setNewDeviceIcon('devices');
    setSelectedExistingDevice(null);
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
      return;
    }
    try {
      const createdCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories(prev => [...prev, createdCategory]);
      setSelectedCategory(createdCategory);
      setModalCategoryVisible(false);
      setNewCategoryName('');
      await fetchDevicesByCategory(createdCategory._id);
      setModalDeviceVisible(true);
      setNewDeviceName('');
      setNewDeviceIcon('devices');
      setSelectedExistingDevice(null);
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      Alert.alert('Erro', 'Não foi possível criar a categoria.');
    }
  }

  async function handleAddDevice() {
    if (selectedExistingDevice) {
      try {
        const createdDevice = await createDevice({
          name: selectedExistingDevice.name,
          category: selectedExistingDevice.category,
          room: roomId,
          icon: selectedExistingDevice.icon || 'devices',
        });
        setCategoryDevices(prev => [...prev, createdDevice]);
        setDevices(prev => [...prev, createdDevice]);
        setModalDeviceVisible(false);
        setSelectedCategory(null);
        setSelectedExistingDevice(null);
      } catch (err) {
        console.error('Erro ao duplicar dispositivo:', err);
        Alert.alert('Erro', 'Não foi possível adicionar o dispositivo.');
      }
      return;
    }

    if (!newDeviceName.trim()) {
      Alert.alert('Erro', 'O nome do dispositivo não pode estar vazio.');
      return;
    }
    try {
      const createdDevice = await createDevice({
        name: newDeviceName.trim(),
        category: selectedCategory._id,
        room: roomId,
        icon: newDeviceIcon,
      });

      setCategoryDevices(prev => [...prev, createdDevice]);
      setDevices(prev => [...prev, createdDevice]);

      setModalDeviceVisible(false);
      setNewDeviceName('');
      setNewDeviceIcon('devices');
      setSelectedCategory(null);
      setSelectedExistingDevice(null);
    } catch (err) {
      console.error('Erro ao criar dispositivo:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o dispositivo.');
    }
  }

  async function handleDeleteDevice(deviceId) {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja eliminar este dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(deviceId);
              setDevices(prev => prev.filter(d => d._id !== deviceId));
              setCategoryDevices(prev => prev.filter(d => d._id !== deviceId));
            } catch (err) {
              console.error('Erro ao eliminar dispositivo:', err);
              Alert.alert('Erro', 'Não foi possível eliminar o dispositivo.');
            }
          },
        },
      ]
    );
  }

  async function handleDeleteCategory(categoryId) {
  Alert.alert(
    'Confirmar exclusão',
    'Tem certeza que deseja eliminar esta categoria?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(categoryId);
            setCategories(prev => prev.filter(cat => cat._id !== categoryId));

            // Se a categoria removida estiver selecionada, reset
            if (selectedCategory?._id === categoryId) {
              setSelectedCategory(null);
              setModalDeviceVisible(false);
            }
          } catch (err) {
            console.error('Erro ao eliminar categoria:', err);
            Alert.alert('Erro', 'Não foi possível eliminar a categoria.');
          }
        },
      },
    ]
  );
}

  useEffect(() => {
    navigation.setOptions({
      title: `Dispositivos - ${roomName}`,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalCategoryVisible(true);
            setNewCategoryName('');
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ fontSize: 40, color: '#6e3b6e' }}>＋</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, roomName]);

  if (loadingCategories || loadingDevices) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>A carregar categorias e dispositivos...</Text>
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
          renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onLongPress={() => navigation.navigate('DeviceActions', { device: item })}
      activeOpacity={0.8}
    >
      {/* Ícone no topo, centralizado */}
      <View style={styles.iconContainer}>
        <Icon name={item.icon || 'devices'} size={40} color="#333" />
      </View>
      {/* Nome do dispositivo abaixo do ícone */}
      <Text style={styles.deviceName}>{item.name}</Text>

      {/* Botão eliminar abaixo do nome, centralizado */}
      <TouchableOpacity
        onPress={() => handleDeleteDevice(item._id)}
        style={styles.deleteButton}
      >
        <Icon name="delete" size={24} color="#cc0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  )}
/>  
)}

      {/* Modal seleção / criação categoria */}
      <Modal visible={modalCategoryVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione uma categoria</Text>

            <ScrollView style={{ maxHeight: 200, marginVertical: 10 }}>
              {categories.map(cat => (
        <View
          key={cat._id}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
        >
          <TouchableOpacity
            style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#eee',
            borderRadius: 8,
            }}
            onPress={() => onSelectCategory(cat)}
            >
            <Text style={{ fontSize: 16 }}>{cat.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteCategory(cat._id)}
            style={{ marginLeft: 10, padding: 6 }}
          >
            <Icon name="delete" size={24} color="#cc0000" />
          </TouchableOpacity>
        </View>
))}
            </ScrollView>

            <Text style={{ marginTop: 10 }}>Ou adicione uma nova categoria:</Text>
            <TextInput
              placeholder="Nome da nova categoria"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 6,
                marginTop: 5,
                marginBottom: 15,
              }}
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setModalCategoryVisible(false)}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}
                style={{ opacity: newCategoryName.trim() ? 1 : 0.5 }}
              >
                <Text style={{ color: '#6e3b6e', fontWeight: 'bold' }}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para adicionar dispositivo */}
      <Modal visible={modalDeviceVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Adicionar dispositivo em "{selectedCategory?.name}"
            </Text>

            {loadingCategoryDevices ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : categoryDevices.length > 0 ? (
              <View style={{ maxHeight: 150, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                  Dispositivos já existentes:
                </Text>
                <ScrollView>
                  {categoryDevices.map(dev => {
                    const selected = selectedExistingDevice?._id === dev._id;
                    return (
                      <TouchableOpacity
                        key={dev._id}
                        onPress={() => {
                          if (selectedExistingDevice?._id === dev._id) {
                            setSelectedExistingDevice(null);
                            setNewDeviceName('');
                            setNewDeviceIcon('devices');
                          } else {
                            setSelectedExistingDevice(dev);
                            setNewDeviceName('');
                            setNewDeviceIcon('devices');
                          }
                        }}
                        style={{
                          padding: 8,
                          backgroundColor: selected ? '#6e3b6e' : '#eee',
                          borderRadius: 8,
                          marginBottom: 5,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Icon
                            name={dev.icon || 'devices'}
                            size={24}
                            color={selected ? '#fff' : '#333'}
                            style={{ marginRight: 10 }}
                          />
                          <Text style={{ color: selected ? '#fff' : '#000' }}>{dev.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <Text style={{ marginBottom: 10, fontStyle: 'italic' }}>
                Ainda não há dispositivos nesta categoria.
              </Text>
            )}

            <Text style={{ marginTop: 10 }}>
              {selectedExistingDevice
                ? 'Você está duplicando este dispositivo.'
                : 'Nome do dispositivo:'}
            </Text>
            {!selectedExistingDevice && (
              <>
                <TextInput
                  placeholder="Digite o nome"
                  value={newDeviceName}
                  onChangeText={setNewDeviceName}
                  autoFocus
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    marginTop: 5,
                  }}
                />

                <Text style={{ marginTop: 10 }}>Escolha um ícone:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                  {[
                    'lightbulb',
                    'power-plug',
                    'television',
                    'camera',
                    'speaker',
                    'thermometer',
                    'blinds',
                    'light-switch',
                    'motion-sensor',
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
              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalDeviceVisible(false);
                  setSelectedCategory(null);
                  setSelectedExistingDevice(null);
                }}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddDevice} disabled={
                !selectedExistingDevice && !newDeviceName.trim()
              } style={{ opacity: (!selectedExistingDevice && !newDeviceName.trim()) ? 0.5 : 1 }}>
                <Text style={{ color: '#6e3b6e', fontWeight: 'bold' }}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
