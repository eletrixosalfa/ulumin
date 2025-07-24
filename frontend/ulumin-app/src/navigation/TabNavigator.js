import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Button, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import DevicesScreen from '../screens/DevicesScreen';
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
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
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
      <Stack.Screen
        name="RoomsScreen"
        component={RoomsScreen}
        options={{ headerTitle: 'Divisões' }}
      />
      <Stack.Screen
        name="DevicesScreen"
        component={DevicesScreen}
        options={({ route }) => ({
          // Usa o parâmetro roomName passado na navegação para o título do header
          headerTitle: route.params?.roomName || 'Dispositivos',
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

// Wrapper para o SettingsScreen que injeta logout nas opções do header
function SettingsStackScreenWrapper(props) {
  const { logout } = useContext(AuthContext);

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            Alert.alert(
              'Confirmação',
              'Deseja sair da aplicação?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', onPress: logout, style: 'destructive' },
              ],
              { cancelable: true }
            )
          }
          title="Sair"
          color="#000"
        />
      ),
    });
  }, [props.navigation, logout]);

  return <SettingsScreen {...props} />;
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
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsStackScreenWrapper}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Headers são gerenciados pelos Stacks
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
