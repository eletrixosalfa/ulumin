import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: 'Dashboard',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        //adicionar botões no headerRight e headerLeft
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      {/* outras telas relacionadas ao Home podem entrar aqui */}
    </Stack.Navigator>
  );
}

function RoomsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: 'Divisões',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="RoomsScreen" component={RoomsScreen} />
    </Stack.Navigator>
  );
}

function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: 'Temporizações',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: 'Configurações',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // desativa header padrão do tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Rooms') iconName = focused ? 'business' : 'business-outline';
          else if (route.name === 'Schedule') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Rooms" component={RoomsStack} options={{ tabBarLabel: 'Divisões' }} />
      <Tab.Screen name="Schedule" component={ScheduleStack} options={{ tabBarLabel: 'Temporizações' }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ tabBarLabel: 'Configurações' }} />
    </Tab.Navigator>
  );
}
