import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Switch,
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
import {
  getDevicesByCategory,
  getRooms,
} from '../services/catalogdevicesService';
import { getCategoriesByRoom } from '../services/categoriesService';
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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState('');
  const [action, setAction] = useState('on');
  const [time, setTime] = useState(new Date());
  const [repeatDays, setRepeatDays] = useState([]);
  const [active, setActive] = useState(true);
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
      fetchCategories(selectedRoom);
    }
  }, [selectedRoom]);

  async function fetchCategories(roomId) {
    try {
      const catList = await getCategoriesByRoom(roomId);
      setCategories(catList);
      if (catList.length > 0) {
        setSelectedCategory(catList[0]._id);
      } else {
        setSelectedCategory(null);
        setDevices([]);
      }
    } catch (e) {
      console.error('Erro ao carregar categorias:', e);
      setCategories([]);
      setSelectedCategory(null);
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchDevices(selectedCategory);
    }
  }, [selectedCategory]);

  async function fetchDevices(categoryId) {
    try {
      const devicesList = await getDevicesByCategory(categoryId);
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
    setRepeatDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  }

  function openModalToEdit(schedule) {
    setEditingSchedule(schedule);
    setDevice(schedule.device._id || '');
    setAction(schedule.action);
    const [hours, minutes] = schedule.time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    setTime(date);
    setRepeatDays(schedule.repeat || []);
    setActive(schedule.active);
    setModalVisible(true);
  }

  function openModalToCreate() {
    setEditingSchedule(null);
    setDevice(devices.length > 0 ? devices[0]._id : '');
    setAction('on');
    setTime(new Date());
    setRepeatDays([]);
    setActive(true);
    setModalVisible(true);
  }

  async function saveSchedule() {
    if (!device) {
      alert('Seleciona um dispositivo.');
      return;
    }

    const formattedTime = time.toTimeString().slice(0, 5);
    const data = {
      device,
      action,
      time: formattedTime,
      repeat: repeatDays,
      active,
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
      console.error('Erro ao salvar schedule:', e);
      alert('Erro ao salvar temporização.');
    }
  }

  async function deleteSchedule(id) {
    try {
      await deleteScheduleService(id);
      fetchSchedules();
    } catch (e) {
      console.error('Erro ao eliminar schedule:', e);
      alert('Erro ao eliminar temporização.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Selecione a Divisão:</Text>
      <Picker selectedValue={selectedRoom} onValueChange={setSelectedRoom}>
        {rooms.map((r) => (
          <Picker.Item key={r._id} label={r.name} value={r._id} />
        ))}
      </Picker>

      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Categoria:</Text>
      <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
        {categories.map((c) => (
          <Picker.Item key={c._id} label={c.name} value={c._id} />
        ))}
      </Picker>

      <Button title="Adicionar Temporização" onPress={openModalToCreate} />

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Dispositivo: {item.device.name || item.device._id}</Text>
              <Text>Ação: {item.action.toUpperCase()}</Text>
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
              {editingSchedule ? 'Editar Temporização' : 'Nova Temporização'}
            </Text>

            <Text>Dispositivo:</Text>
            <Picker selectedValue={device} onValueChange={setDevice}>
              {devices.map((d) => (
                <Picker.Item key={d._id} label={d.name} value={d._id} />
              ))}
            </Picker>

            <Text>Ação:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.actionBtn, action === 'on' && styles.actionBtnSelected]}
                onPress={() => setAction('on')}
              >
                <Text style={action === 'on' ? styles.actionTextSelected : {}}>Ligar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, action === 'off' && styles.actionBtnSelected]}
                onPress={() => setAction('off')}
              >
                <Text style={action === 'off' ? styles.actionTextSelected : {}}>Desligar</Text>
              </TouchableOpacity>
            </View>

            <Text>Hora:</Text>
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

            <Text>Dias da semana:</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.dayBtn,
                    repeatDays.includes(d.key) && styles.dayBtnSelected,
                  ]}
                  onPress={() => toggleDay(d.key)}
                >
                  <Text
                    style={
                      repeatDays.includes(d.key)
                        ? styles.dayTextSelected
                        : undefined
                    }
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text>Ativo:</Text>
              <Switch value={active} onValueChange={setActive} />
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
