// components/MQTTSettingsBottomSheet.js
import React, { useMemo, useRef, useCallback, useState } from 'react';
import {
  View, Text, TextInput, Switch, Button, StyleSheet
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export default function MQTTSettingsBottomSheet({ visible, onClose, onLogout }) {
  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  const [server, setServer] = useState('');
  const [port, setPort] = useState('1883');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ssl, setSsl] = useState(false);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) onClose();
  }, [onClose]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
    >
      <View style={styles.container}>
        <Text style={styles.label}>Servidor MQTT</Text>
        <TextInput style={styles.input} value={server} onChangeText={setServer} placeholder="mqtt.exemplo.com" />

        <Text style={styles.label}>Porta</Text>
        <TextInput style={styles.input} value={port} onChangeText={setPort} keyboardType="numeric" />

        <Text style={styles.label}>Usuário</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="user" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="password" />

        <View style={styles.switchRow}>
          <Text style={styles.label}>SSL</Text>
          <Switch value={ssl} onValueChange={setSsl} />
        </View>

        <View style={styles.buttonRow}>
          <Button title="Testar conexão" onPress={() => {
            console.log({ server, port, username, password, ssl });
          }} />
          <Button title="Sair" onPress={onLogout} color="red" />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    padding: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  buttonRow: {
    marginTop: 16,
  },
});
