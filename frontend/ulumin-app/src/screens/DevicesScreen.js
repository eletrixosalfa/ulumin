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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { 
  getDevicesByRoomAndCategory, 
  createDevice, 
  deleteDevice 
} from '../services/devicesService';

import { 
  getCategoriesByRoom,
  createCategory,
} from '../services/categoriesService';

import styles from '../styles/DevicesScreen.styles';

export default function DevicesScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  // Categorias e seleção
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Dispositivos da categoria selecionada
  const [devices, setDevices] = useState([]);
  
  // Loading e erros
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [error, setError] = useState(null);
  
  // Modais e formulários
  const [modalDeviceVisible, setModalDeviceVisible] = useState(false);
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  
  const [savingDevice, setSavingDevice] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIcon, setNewDeviceIcon] = useState('devices'); // default icon
  
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modal ações dispositivos
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [deviceForActions, setDeviceForActions] = useState(null);

  // Atualiza header para botões de adicionar categorias e dispositivos
  useEffect(() => {
    navigation.setOptions({
      title: `Dispositivos - ${roomName}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {/* Botão adicionar categoria */}
          <TouchableOpacity
            onPress={() => {
              setModalCategoryVisible(true);
              setNewCategoryName('');
            }}
            style={{ marginRight: 15, marginBottom: 5 }}
          >
            <Text style={{ fontSize: 30, color: '#6e3b6e' }}>＋</Text>
          </TouchableOpacity>

          {/* Botão adicionar dispositivo - aparece só se categoria selecionada */}
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => {
                setModalDeviceVisible(true);
                setNewDeviceName('');
                setNewDeviceIcon('devices');
              }}
              style={{ marginRight: 15, marginBottom: 5 }}
            >
              <Text style={{ fontSize: 40, color: 'black' }}>＋</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, roomName, selectedCategory]);

  // Carrega categorias da divisão
  useEffect(() => {
    fetchCategories();
  }, []);

  // Quando seleciona categoria, busca dispositivos dela
  useEffect(() => {
    if (selectedCategory) {
      fetchDevices();
    } else {
      setDevices([]);
    }
  }, [selectedCategory]);

  async function fetchCategories() {
    setLoadingCategories(true);
    setError(null);
    try {
      const cats = await getCategoriesByRoom(roomId);
      setCategories(cats);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0]);
      }
    } catch (err) {
      setError('Erro ao carregar categorias.');
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function fetchDevices() {
    setLoadingDevices(true);
    setError(null);
    try {
      const data = await getDevicesByRoomAndCategory(roomId, selectedCategory._id);
      setDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos.');
      console.error(err);
    } finally {
      setLoadingDevices(false);
    }
  }

  async function handleAddDevice() {
    if (!newDeviceName.trim()) {
      Alert.alert('Erro', 'O nome do dispositivo não pode estar vazio.');
      return;
    }
    setSavingDevice(true);
    try {
      const createdDevice = await createDevice({
        name: newDeviceName.trim(),
        category: selectedCategory._id,
        room: roomId,
        icon: newDeviceIcon,
      });
      setDevices(prev => [...prev, createdDevice]);
      setModalDeviceVisible(false);
      setNewDeviceName('');
      setNewDeviceIcon('devices');
    } catch (err) {
      console.error('Erro ao criar dispositivo:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o dispositivo.');
    } finally {
      setSavingDevice(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
      return;
    }
    setSavingCategory(true);
    try {
      const createdCategory = await createCategory({
        name: newCategoryName.trim(),
        room: roomId,
      });
      setCategories(prev => [...prev, createdCategory]);
      setSelectedCategory(createdCategory);
      setModalCategoryVisible(false);
      setNewCategoryName('');
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      Alert.alert('Erro', 'Não foi possível criar a categoria.');
    } finally {
      setSavingCategory(false);
    }
  }

  function getDeviceActions(device) {
    return ['Ligar', 'Desligar', 'Alternar', 'Temporizado'];
  }

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

  if (loadingCategories) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>A carregar categorias...</Text>
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

      {/* Lista horizontal de categorias */}
      <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginHorizontal: 8,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 20,
                backgroundColor: selectedCategory?._id === item._id ? '#6e3b6e' : '#ddd',
              }}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={{ color: selectedCategory?._id === item._id ? 'white' : 'black', fontWeight: 'bold' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de dispositivos */}
      {loadingDevices ? (
        <View style={styles.containerCentered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>A carregar dispositivos...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.containerCentered}>
          <Text style={{ color: '#555', fontSize: 16 }}>Esta categoria não possui dispositivos.</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={item => item._id}
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
              <Icon name={item.icon || 'devices'} size={40} color="#333" style={{ marginBottom: 10 }} />
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

      {/* Modal ações do dispositivo */}
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
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal adicionar dispositivo */}
      <Modal visible={modalDeviceVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar dispositivo à categoria "{selectedCategory?.name}"</Text>

            <Text style={{ marginTop: 10 }}>Nome do dispositivo:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, marginTop: 5 }}>
              <TextInput
                placeholder="Digite o nome"
                value={newDeviceName}
                onChangeText={setNewDeviceName}
                autoFocus
              />
            </View>

            <Text style={{ marginTop: 10 }}>Ícone (nome do MaterialCommunityIcons):</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, marginTop: 5 }}>
              <TextInput
                placeholder="e.g. lightbulb, camera, fan"
                value={newDeviceIcon}
                onChangeText={setNewDeviceIcon}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalDeviceVisible(false);
                  setNewDeviceName('');
                  setNewDeviceIcon('devices');
                }}
                disabled={savingDevice}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddDevice}
                disabled={savingDevice || !newDeviceName.trim()}
                style={[
                  styles.buttonSave,
                  { opacity: savingDevice || !newDeviceName.trim() ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.buttonText}>
                  {savingDevice ? 'A adicionar...' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal adicionar categoria */}
      <Modal visible={modalCategoryVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar nova categoria</Text>

            <Text style={{ marginTop: 10 }}>Nome da categoria:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, marginTop: 5 }}>
              <TextInput
                placeholder="Digite o nome"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalCategoryVisible(false);
                  setNewCategoryName('');
                }}
                disabled={savingCategory}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddCategory}
                disabled={savingCategory || !newCategoryName.trim()}
                style={[
                  styles.buttonSave,
                  { opacity: savingCategory || !newCategoryName.trim() ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.buttonText}>
                  {savingCategory ? 'Criando...' : 'Criar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
