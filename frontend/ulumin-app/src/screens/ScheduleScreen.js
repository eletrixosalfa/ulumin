import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule as deleteScheduleService,
} from '../services/scheduleService';
import { getRooms, getDeviceActions } from '../services/devicecatalogService';
import { getDevicesByRoom } from '../services/devicesService';
import styles from '../styles/ScheduleScreen.styles';

const daysOfWeek = [
  { key: 'mon', label: 'Seg' },
  { key: 'tue', label: 'Ter' },
  { key: 'wed', label: 'Qua' },
  { key: 'thu', label: 'Qui' },
  { key: 'fri', label: 'Sex' },
  { key: 'sat', label: 'Sab' },
  { key: 'sun', label: 'Dom' },
];

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState('');
  const [action, setAction] = useState('');
  const [actionOptions, setActionOptions] = useState([]); 
  const [time, setTime] = useState(new Date());
  const [repeatDays, setRepeatDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const roomsList = await getRooms();
      setRooms(roomsList);
      if (roomsList.length > 0) {
        setSelectedRoom(roomsList[0]._id);
      }
    } catch (e) {
      console.error('Erro ao carregar rooms:', e);
    }
  }

  useEffect(() => {
    if (selectedRoom) {
      fetchDevices(selectedRoom);
    } else {
      setDevices([]);
      setDevice('');
    }
  }, [selectedRoom]);

  async function fetchDevices(roomId) {
    try {
      const devicesList = await getDevicesByRoom(roomId);
      setDevices(devicesList);
      if (devicesList.length > 0) {
        setDevice(devicesList[0]._id);
      } else {
        setDevice('');
      }
    } catch (e) {
      console.error('Erro ao carregar dispositivos:', e);
      setDevices([]);
      setDevice('');
    }
  }

  useEffect(() => {
  const fetchActions = async () => {
    const selected = devices.find(d => d._id === device);
    if (selected && selected.model) {
      const actions = await getDeviceActions(selected.model);
      setActionOptions(actions);
      setAction(actions[0] || '');
    } else {
      setActionOptions([]);
      setAction('');
    }
  };

  fetchActions();
}, [device, devices]);


  async function fetchSchedules() {
    setLoading(true);
    try {
      const res = await getSchedules();
      setSchedules(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error('Erro ao carregar schedules:', e);
    } finally {
      setLoading(false);
    }
  }

  function toggleDay(dayKey) {
    setRepeatDays(prev =>
      prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey]
    );
  }

  function openModalToEdit(schedule) {
    setEditingSchedule(schedule);
    setDevice(schedule.device?._id || '');
    const [hours, minutes] = schedule.time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    setTime(date);
    setRepeatDays(schedule.repeat || []);
    setModalVisible(true);
  }

  function openModalToCreate() {
    setEditingSchedule(null);
    setSelectedRoom(rooms.length > 0 ? rooms[0]._id : null);
    setDevice(devices.length > 0 ? devices[0]._id : '');
    setTime(new Date());
    setRepeatDays([]);
    setModalVisible(true);
  }

  async function saveSchedule() {
    if (!device) {
      alert('Seleciona um dispositivo.');
      return;
    }
    if (!action) {
      alert('Seleciona uma ação.');
      return;
    }

    const formattedTime = time.toTimeString().slice(0, 5);
    const data = {
      device,
      action,
      time: formattedTime,
      repeat: repeatDays,
    };

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule._id, data);
      } else {
        await createSchedule(data);
      }
      setModalVisible(false);
      fetchSchedules();
    } catch (e) {
      console.error('Erro ao guardar schedule:', e);
      alert('Erro ao guardar agendamento.');
    }
  }

  async function deleteSchedule(id) {
    try {
      await deleteScheduleService(id);
      fetchSchedules();
    } catch (e) {
      console.error('Erro ao eliminar schedule:', e);
      alert('Erro ao eliminar agendamento.');
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Adicionar Agendamento" onPress={openModalToCreate} />

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Dispositivo: {item.device?.name || item.device?._id || 'Desconhecido'}</Text>
              <Text>Ação: {item.action}</Text>
              <Text>Hora: {item.time}</Text>
              <Text>Dias: {item.repeat.length > 0 ? item.repeat.join(', ') : 'Nenhum'}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Button title="Editar" onPress={() => openModalToEdit(item)} />
                <View style={{ width: 10 }} />
                <Button title="Eliminar" color="red" onPress={() => deleteSchedule(item._id)} />
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
            </Text>

            <Text style={styles.label}>Divisão:</Text>
            <Picker selectedValue={selectedRoom} onValueChange={setSelectedRoom}>
              {rooms.map(r => <Picker.Item key={r._id} label={r.name} value={r._id} />)}
            </Picker>

            <Text style={styles.label}>Dispositivo:</Text>
            <Picker selectedValue={device} onValueChange={setDevice}>
              {devices.map(d => <Picker.Item key={d._id} label={d.name} value={d._id} />)}
            </Picker>

            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Ação:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {actionOptions.map(act => (
                <TouchableOpacity
                  key={act}
                  style={[styles.actionBtn, action === act && styles.actionBtnSelected]}
                  onPress={() => setAction(act)}
                >
                  <Text style={action === act ? styles.actionTextSelected : {}}>{act}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Hora:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeText}>{time.toTimeString().slice(0, 5)}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (selectedDate) setTime(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Dias da semana:</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map(d => (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.dayBtn, repeatDays.includes(d.key) && styles.dayBtnSelected]}
                  onPress={() => toggleDay(d.key)}
                >
                  <Text style={repeatDays.includes(d.key) ? styles.dayTextSelected : undefined}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Guardar" onPress={saveSchedule} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
