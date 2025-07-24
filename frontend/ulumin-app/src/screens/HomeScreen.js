import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/HomeScreen.styles';
import UluminLogo from '../../assets/ulumin-logo.png'

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [temperature, setTemperature] = useState('24°C'); // Simulado

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = today.toLocaleDateString('pt-PT', options);
    setCurrentDate(formatted);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={UluminLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.date}>📅 {currentDate}</Text>
      <Text style={styles.temp}>🌡️ {temperature}</Text>
    </View>
  );
}
