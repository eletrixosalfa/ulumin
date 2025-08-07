import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/UserSettingsScreen.styles';
import * as updateuserService from '../services/updateuserService';

export default function UserSettingsScreen() {
  const [email, setEmail] = useState('usuario@exemplo.com'); // Fictício por agora
  const [editing, setEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggleEdit = () => {
    setEditing(!editing);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      await updateuserService.changePassword(currentPassword, newPassword);
      Alert.alert('Senha alterada com sucesso');
      setEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao alterar senha');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.staticText}>{email}</Text>

      {!editing && (
        <TouchableOpacity style={styles.button} onPress={handleToggleEdit}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      {editing && (
        <>
          <Text style={styles.label}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Digite a senha atual"
            secureTextEntry
          />

          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Digite a nova senha"
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Guardar Nova Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToggleEdit}>
            <Text style={[styles.buttonText, { color: '#007AFF', marginTop: 10 }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
