import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // se quiser usar picker nativo para hora

import api from '../api/api'; // adaptar conforme tua estrutura

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

  // Form state
  const [device, setDevice] = useState(''); // depois preencher com lista real
  const [action, setAction] = useState('on');
  const [time, setTime] = useState(new Date());
  const [repeatDays, setRepeatDays] = useState([]);
  const [active, setActive] = useState(true); // toggle ativo (pode guardar na API depois)

  // Para mostrar picker hora (se quiser)
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    setLoading(true);
    try {
      const res = await api.get('/schedules'); // adaptar endpoint
      if (Array.isArray(res.data)) {
        setSchedules(res.data);
      } else {
        setSchedules([]);
      }
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
    setActive(true); // assumir ativo, pode adaptar
    setModalVisible(true);
  }

  function openModalToCreate() {
    setEditingSchedule(null);
    setDevice('');
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
    // Format time para HH:mm
    const formattedTime = time.toTimeString().slice(0, 5);

    const data = {
      device,
      action,
      time: formattedTime,
      repeat: repeatDays,
      // ativo não está no schema, podes adicionar se quiser
    };

    try {
      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule._id}`, data);
      } else {
        await api.post('/schedules', data);
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
      await api.delete(`/schedules/${id}`);
      fetchSchedules();
    } catch (e) {
      console.error('Erro ao eliminar schedule:', e);
      alert('Erro ao eliminar temporização.');
    }
  }

  return (
    <View style={styles.container}>
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
              <Text>Dias: {item.repeat.join(', ') || 'Nenhum'}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Button title="Editar" onPress={() => openModalToEdit(item)} />
                <View style={{ width: 10 }} />
                <Button
                  title="Eliminar"
                  color="red"
                  onPress={() => deleteSchedule(item._id)}
                />
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

            <Text>Dispositivo (ID):</Text>
            <TextInput
              style={styles.input}
              placeholder="ID do dispositivo"
              value={device}
              onChangeText={setDevice}
            />

            <Text>Ação:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  action === 'on' && styles.actionBtnSelected,
                ]}
                onPress={() => setAction('on')}
              >
                <Text style={action === 'on' ? styles.actionTextSelected : {}}>
                  Ligar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  action === 'off' && styles.actionBtnSelected,
                ]}
                onPress={() => setAction('off')}
              >
                <Text style={action === 'off' ? styles.actionTextSelected : {}}>
                  Desligar
                </Text>
              </TouchableOpacity>
            </View>

            <Text>Hora:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeText}>
                {time.toTimeString().slice(0, 5)}
              </Text>
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