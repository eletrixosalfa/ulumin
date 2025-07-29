import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/HomeScreen.styles';
import UluminLogo from '../../assets/ulumin-logo.png'

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Formatar data
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = today.toLocaleDateString('pt-PT', options);
    setCurrentDate(formatted);

    // Pedir permissão e procurar localização
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Procurar temperatura e cidade pela API
      fetchWeather(latitude, longitude);
    })();
  }, []);

  async function fetchWeather(lat, lon) {
    const API_KEY = 'a935298814c6af7eba8775773159accf';
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`
      );
      const data = await response.json();
      if (response.ok) {
        setTemperature(`${Math.round(data.main.temp)}°C`);
        setCity(data.name);
      } else {
        setErrorMsg('Erro ao buscar dados do tempo');
      }
    } catch (error) {
      console.error('Erro na requisição do tempo:', error);
      setErrorMsg('Erro na requisição do tempo');
    }
  }

  return (
    <View style={styles.container}>
      <Image source={UluminLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.date}>📅 {currentDate}</Text>
      {errorMsg ? (
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      ) : (
        <>
          <Text style={styles.city}>📍 {city || 'Obtendo localização...'}</Text>
          <Text style={styles.temp}>🌡️ {temperature || 'Carregando...'}</Text>
        </>
      )}
    </View>
  );
}
