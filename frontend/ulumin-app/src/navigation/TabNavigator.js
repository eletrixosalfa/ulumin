import React, { useRef, useContext } from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import DevicesScreen from '../screens/DevicesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import DeviceActionsScreen from '../screens/DeviceActionsScreen';

import SettingsBottomSheet from '../components/SettingsBottomSheet';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function RoomsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="RoomsScreen" component={RoomsScreen} options={{ headerTitle: 'Divisões' }} />
      <Stack.Screen
        name="DevicesScreen"
        component={DevicesScreen}
        options={({ route }) => ({
          headerTitle: route.params?.roomName || 'Dispositivos',
        })}
      />
      <Stack.Screen
        name="DeviceActions"
        component={DeviceActionsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.device?.name || 'Ações do dispositivo',
        })}
      />
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

export default function TabNavigator() {
  const settingsSheetRef = useRef(null);
  const { logout } = useContext(AuthContext);

  const openSettingsSheet = () => {
    settingsSheetRef.current?.open();
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
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

        <Tab.Screen
          name="Settings"
          component={HomeStack} // Dummy
          options={{
            tabBarLabel: 'Configurações',
            tabBarButton: ({ children, onLongPress, accessibilityState }) => (
              <Pressable
                onPress={openSettingsSheet}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityState={accessibilityState}
                style={({ pressed }) => ({
                  flex: 1,
                  opacity: pressed ? 0.7 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                {children}
              </Pressable>
            ),
          }}
        />
      </Tab.Navigator>

      <SettingsBottomSheet ref={settingsSheetRef} logout={logout} />
    </>
  );
}
