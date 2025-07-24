import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    // Pode retornar um loading ou null enquanto verifica o token
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        // Usuário logado: mostra a app principal
        <Stack.Screen name="App" component={TabNavigator} />
      ) : (
        // Usuário não logado: mostra login e registo
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

