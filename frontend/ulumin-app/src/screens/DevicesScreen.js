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
  getDevicesByCategory, 
  createDevice, 
  deleteDevice 
} from '../services/devicesService';

import { 
  getCategories,
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

  // Modais
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [modalDeviceVisible, setModalDeviceVisible] = useState(false);

  // Formulários
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIcon, setNewDeviceIcon] = useState('devices');

  // Ao entrar na tela, carrega categorias
  useEffect(() => {
    fetchCategories();
  }, []);

  // Quando seleciona categoria no modal, carrega dispositivos dela
  useEffect(() => {
    if (selectedCategory) {
      fetchDevices();
      setModalCategoryVisible(false);
      setModalDeviceVisible(true);
      setNewDeviceName('');
      setNewDeviceIcon('devices');
    } else {
      setDevices([]);
    }
  }, [selectedCategory]);

  // Configura header com só 1 botão "+"
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

  async function fetchDevices() {
    setLoadingDevices(true);
    setError(null);
    try {
      const data = await getDevicesByCategory(roomId, selectedCategory._id);
      setDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos.');
      console.error(err);
    } finally {
      setLoadingDevices(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) {
      Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
      return;
    }
    try {
      const createdCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories(prev => [...prev, createdCategory]);
      setSelectedCategory(createdCategory);  // seleciona a nova para abrir modal de dispositivo
      setModalCategoryVisible(false);
      setNewCategoryName('');
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      Alert.alert('Erro', 'Não foi possível criar a categoria.');
    }
  }

  async function handleAddDevice() {
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
      setDevices(prev => [...prev, createdDevice]);
      setModalDeviceVisible(false);
      setNewDeviceName('');
      setNewDeviceIcon('devices');
      setSelectedCategory(null); // fecha modal dispositivo
    } catch (err) {
      console.error('Erro ao criar dispositivo:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o dispositivo.');
    }
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

      {/* Lista de dispositivos (sem mostrar categorias no Open Space) */}
      {loadingDevices ? (
        <View style={styles.containerCentered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>A carregar dispositivos...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.containerCentered}>
          <Text style={{ color: '#555', fontSize: 16 }}>Esta divisão não possui dispositivos.</Text>
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
              <Icon name={item.icon || 'devices'} size={40} color="#333" style={{ marginBottom: 10 }} />
              <Text style={styles.deviceName}>{item.name}</Text>
            </View>
          )}
        />
      )}

      {/* Modal lista de categorias + adicionar categoria */}
      <Modal visible={modalCategoryVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione uma categoria</Text>

            <ScrollView style={{ maxHeight: 200, marginVertical: 10 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat._id}
                  style={{
                    padding: 12,
                    backgroundColor: '#eee',
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={{ fontSize: 16 }}>{cat.name}</Text>
                </TouchableOpacity>
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

      {/* Modal criar dispositivo (com seleção visual de ícones) */}
      <Modal visible={modalDeviceVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar dispositivo em "{selectedCategory?.name}"</Text>

            <Text style={{ marginTop: 10 }}>Nome do dispositivo:</Text>
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
                'fan',
                'power-plug',
                'television',
                'camera',
                'speaker',
                'thermometer',
                'devices',
              ].map(iconName => (
                <TouchableOpacity
                  key={iconName}
                  onPress={() => setNewDeviceIcon(iconName)}
                  style={{
                    marginRight: 15,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: newDeviceIcon === iconName ? '#6e3b6e' : '#eee',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                  }}
                >
                  <Icon name={iconName} size={30} color={newDeviceIcon === iconName ? 'white' : '#333'} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalDeviceVisible(false);
                  setSelectedCategory(null);
                }}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddDevice}
                disabled={!newDeviceName.trim()}
                style={{ opacity: newDeviceName.trim() ? 1 : 0.5 }}
              >
                <Text style={{ color: '#6e3b6e', fontWeight: 'bold' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
