import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import styles from '../styles/SettingsBottomSheet.styles';

const SettingsBottomSheet = forwardRef(({ logout, onSettingsPress }, ref) => {

  // Função para abrir a tela de configurações e fechar o bottom sheet
 const handleSettingsPress = () => {
  if (ref && ref.current) {
    ref.current.close();
  }

  setTimeout(() => {
  if (typeof onSettingsPress === 'function') {
    onSettingsPress();
  } else {
    console.warn('onSettingsPress não está definido');
  }
  }, 300);
};

  // Confirmação para logout
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

  // Opções com as ações do settingsbottom
  const options = [
    { id: 'settings', label: 'Configurações', style: 'NormalButton', onPress: handleSettingsPress },
    { id: 'logout', label: 'Sair', style: 'DangerButton', onPress: confirmLogout },
  ];

  return (
    <Modalize ref={ref} adjustToContentHeight>
      <View style={styles.container}>
        {options.map(item => (
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
