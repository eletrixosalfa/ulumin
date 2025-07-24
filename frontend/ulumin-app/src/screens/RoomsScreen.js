import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/roomsService';
import styles from '../styles/RoomsScreen.styles';

export default function RoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state para criar e editar
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [editingRoom, setEditingRoom] = useState(null); // id da divisão que está editando
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    // Define o botão + no header para abrir o modal de nova divisão
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setEditingRoom(null);
            setNewRoomName('');
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
        // Editar divisão
        const updatedRoom = await updateRoom(editingRoom, { name: newRoomName.trim() });
        setRooms(prev =>
          prev.map(room => (room._id === editingRoom ? updatedRoom : room))
        );
      } else {
        // Criar nova divisão
        const createdRoom = await createRoom({ name: newRoomName.trim() });
        setRooms(prev => [...prev, createdRoom]);
      }
      setNewRoomName('');
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
    setModalVisible(true);
  }

  function handleDeleteRoom(id) {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir essa divisão?',
      [
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
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando divisões...</Text>
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
      {/* REMOVIDO botão + daqui, agora está no header */}

      <FlatList
  data={rooms}
  keyExtractor={(item) => item._id.toString()}
  renderItem={({ item }) => (
    <View style={styles.roomItem}>
      <TouchableOpacity
        style={{ flex: 1 }} // para o touch ocupar o espaço do texto
        onPress={() => navigation.navigate('DevicesScreen', { roomId: item._id, roomName: item.name })}
      >
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
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoom(null);
                  setNewRoomName('');
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
                  {saving ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
