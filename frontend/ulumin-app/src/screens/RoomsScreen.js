import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/roomsService';
import styles from '../styles/RoomsScreen.styles';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export default function RoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('home');

  const { userToken, loading: authLoading } = useContext(AuthContext);


  const availableIcons = [
    'bed',
    'sofa',
    'toilet',
    'desk'
  ];

useEffect(() => {
  if (!authLoading && userToken) {
    fetchRooms();
  }
}, [authLoading, userToken]);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setEditingRoom(null);
            setNewRoomName('');
            setSelectedIcon('home');
            setModalVisible(true);
          }}
          style={{ marginRight: 20, marginBottom: 5 }}
        >
          <Text style={{ fontSize: 40, color: 'black' }}>+</Text>
        </TouchableOpacity>
      ),
      title: 'Divisões',
    });
  }, [navigation]);

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      setError('Erro ao carregar divisões.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOrEditRoom() {
    if (!newRoomName.trim()) return;

    setSaving(true);
    try {
      if (editingRoom) {
        const updatedRoom = await updateRoom(editingRoom, {
          name: newRoomName.trim(),
          icon: selectedIcon,
        });
        setRooms(prev =>
          prev.map(room => (room._id === editingRoom ? updatedRoom : room))
        );
      } else {
        const createdRoom = await createRoom({
          name: newRoomName.trim(),
          icon: selectedIcon,
        });
        setRooms(prev => [...prev, createdRoom]);
      }
      setNewRoomName('');
      setSelectedIcon('home');
      setEditingRoom(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao guardar divisão:', error);
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(room) {
    setEditingRoom(room._id);
    setNewRoomName(room.name);
    setSelectedIcon(room.icon || 'home');
    setModalVisible(true);
  }

  function handleDeleteRoom(id) {
    Alert.alert('Confirmar exclusão', 'Tem a certeza que deseja excluir essa divisão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRoom(id);
            setRooms(prev => prev.filter(room => room._id !== id));
          } catch (error) {
            console.error('Erro ao excluir divisão:', error);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>A carregar divisões...</Text>
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
        data={rooms}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('DevicesScreen', {
                  roomId: item._id,
                  roomName: item.name,
                })
              }
            >
              {item.icon && (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  style={{ marginRight: 10 }}
                />
              )}
              <Text style={styles.roomName}>{item.name}</Text>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.buttonEdit}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.buttonText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={() => handleDeleteRoom(item._id)}
              >
                <Text style={styles.buttonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma divisão encontrada.</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingRoom ? 'Editar Divisão' : 'Nova Divisão'}
            </Text>
            <TextInput
              placeholder="Nome da divisão"
              value={newRoomName}
              onChangeText={setNewRoomName}
              style={styles.input}
              editable={!saving}
            />

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Escolher ícone:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {availableIcons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={{
                    margin: 6,
                    padding: 10,
                    borderWidth: selectedIcon === icon ? 2 : 1,
                    borderColor: selectedIcon === icon ? '#007AFF' : '#ccc',
                    borderRadius: 8,
                  }}
                >
                  <MaterialCommunityIcons name={icon} size={26} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoom(null);
                  setNewRoomName('');
                  setSelectedIcon('home');
                }}
                disabled={saving}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddOrEditRoom}
                disabled={saving}
                style={styles.buttonSave}
              >
                <Text style={styles.buttonText}>
                  {saving ? 'A guardar...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
