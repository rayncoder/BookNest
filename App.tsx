import React, { useEffect, useState } from 'react';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BookDetailsScreen from './src/screens/BookDetailsScreen';

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator<any>();

const BG = '#101A30';
const SURFACE = '#1B2942';
const GOLD = '#D9B66F';
const TEXT = '#F5F0E5';
const MUTED = '#B8B4A8';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: GOLD,
    onPrimary: BG,
    secondary: GOLD,
    onSecondary: BG,
    primaryContainer: GOLD,
    onPrimaryContainer: BG,
    background: BG,
    onBackground: TEXT,
    surface: SURFACE,
    onSurface: TEXT,
    surfaceVariant: '#263650',
    onSurfaceVariant: TEXT,
    secondaryContainer: GOLD,
    onSecondaryContainer: BG,
    outline: '#30405A',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: SURFACE,
      level2: '#263650',
      level3: '#30405A',
    },
  },
};

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BG,
    card: BG,
    primary: GOLD,
    text: TEXT,
    border: '#30405A',
  },
};

const icons: any = {
  Home: 'home-variant',
  Search: 'magnify',
  Library: 'bookshelf',
  Profile: 'account-circle',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => (
          <MaterialCommunityIcons
            name={icons[route.name]}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: '#D9B66F',
        tabBarInactiveTintColor: '#B8B4A8',
        tabBarLabelStyle: { fontWeight: '500' },
        tabBarStyle: {
          backgroundColor: '#101A30',
          borderTopColor: '#30405A',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: 'My Library' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setReady(true);
    });

    const timer = setTimeout(() => setTimerDone(true), 5000);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  if (!ready || !timerDone) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <SplashScreen />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen
              name="Main"
              component={Tabs}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}

          {!user && (
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          )}

          {user && (
            <Stack.Screen
              name="BookDetails"
              component={BookDetailsScreen}
              options={{ title: 'Book details' }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}