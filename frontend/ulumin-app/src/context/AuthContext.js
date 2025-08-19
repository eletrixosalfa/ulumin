import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

// Provider que envolve a aplicação e disponibiliza os dados de autenticação
export const AuthProvider = ({ children }) => {

  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        // Tenta obter o token guardado no armazenamento local
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token); // Se existir, atualiza o estado
      } catch (e) {
        console.log('Erro ao carregar token:', e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  // Função de login: guarda o token em memória e no AsyncStorage
  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('userToken', token);
  };

  // Função de logout: remove o token da memória e do AsyncStorage
  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  // Fornece o contexto com o token, estado de carregamento e funções de login/logout
  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
