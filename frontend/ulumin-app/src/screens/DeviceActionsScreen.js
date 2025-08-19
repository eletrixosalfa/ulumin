import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { getDeviceActions, deleteDevice } from '../services/devicecatalogService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/DeviceActionsScreen.styles';

export default function DeviceActionsScreen({ route, navigation }) {
  const { device, isOn, onToggle } = route.params;
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current; 
  const [isDeviceOn, setIsDeviceOn] = useState(isOn);

  const iconMap = {
    'Ligar': 'power',
    'Desligar': 'power-off',
    'Mudar cor': 'palette',
    'Temporizar': 'timer',
    'Abrir': 'window-open',
    'Fechar': 'window-closed',
    'Parar' : 'stop',
    'Ler valor': 'eye',
  };

  const [selectedAction, setSelectedAction] = useState(
  isDeviceOn ? 'Abrir' : 'Parar' 
);

const [userSelected, setUserSelected] = useState(false);


  useEffect(() => {
    if (device?.model) {
      fetchActions();
    } else {
      setActions([]);
      setLoading(false);
    }
  }, [device.model]);

  useEffect(() => {
  if (!userSelected && actions.lenght > 0) {
    if (isDeviceOn) {
      // Se o dispositivo está ligado, escolha a primeira ação "ativa" possível
      const activeAction = actions.find(a => ['Abrir', 'Fechar', 'Ligar'].includes(a));
      setSelectedAction(activeAction || actions[0]);
    } else {
      const inactiveAction = actions.find(a => ['Parar', 'Desligar'].includes(a));
      setSelectedAction(inactiveAction || actions[0]);
    }
  }
}, [actions, isDeviceOn]);


  async function fetchActions() {
    setLoading(true);
    try {
      const result = await getDeviceActions(device.model);
      setActions(result || []);
    } catch (err) {
      console.error('Erro ao procurar ações:', err);
      setActions([]);
    } finally {
      setLoading(false);
    }
  }

 function handleActionPress(action) {
  setSelectedAction(action);
  setUserSelected(true); 

  switch(action) {
    case 'Abrir':
      if (!isDeviceOn) {
        setIsDeviceOn(true);
        onToggle(true);
      }
      break;
    case 'Fechar':
      if (!isDeviceOn) {
        setIsDeviceOn(true);
        onToggle(true);
      }
      break;
    case 'Ligar':
      if (!isDeviceOn) {
        setIsDeviceOn(true);
        onToggle(true);
      }
      break;
    case 'Desligar':
      if (isDeviceOn) {
        setIsDeviceOn(false);
        onToggle(false);
      }
      break;
    case 'Parar':
      if (isDeviceOn) {
        setIsDeviceOn(false);
        onToggle(false);
      }
      break;
    // Para ações que não alteram isDeviceOn, apenas setSelectedAction
    default:
      break;
  }

  Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
    Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
  ]).start();
}




  async function handleDelete() {
    Alert.alert(
      'Excluir dispositivo',
      'Tem a certeza que deseja excluir este dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(device._id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o dispositivo.');
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : actions.length > 0 ? (
        <View style={styles.actionsContainer}>
          {actions.map(action => {
            const isActive = selectedAction === action;

            return (
              <Animated.View key={action} style={{ transform: [{ scale: isActive ? pulseAnim : 1 }] }}>
                <TouchableOpacity
                  style={[styles.actionButton, isActive ? styles.actionActive : styles.actionInactive]}
                  onPress={() => handleActionPress(action)}
                >
                  <MaterialCommunityIcons
                    name={iconMap[action] || 'cog'}
                    size={30}
                    color={isActive ? '#fff' : '#555'}
                  />
                  <Text style={[styles.actionText, isActive && { color: '#fff' }]}>{action}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      ) : (
        <Text>Nenhuma ação disponível para este modelo.</Text>
      )}

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Excluir dispositivo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
