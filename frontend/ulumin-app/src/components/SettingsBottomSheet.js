import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import styles from '../styles/SettingsBottomSheet.styles';

const options = [
  { id: 'settings', label: 'Configurações', style: 'NormalButton', onPress: () => console.log('Configurações clicado') },
  { id: 'logout', label: 'Sair', style: 'DangerButton', onPress: null }, // vai ser substituído
];

const SettingsBottomSheet = forwardRef(({ logout }, ref) => {
  const confirmLogout = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  const data = options.map(item =>
    item.id === 'logout' ? { ...item, onPress: confirmLogout } : item
  );

  return (
    <Modalize ref={ref} snapPoint={200} modalHeight={300}>
      <View style={styles.container}>
        {data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles[item.style]}
            onPress={item.onPress}
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modalize>
  );
});

export default SettingsBottomSheet;
