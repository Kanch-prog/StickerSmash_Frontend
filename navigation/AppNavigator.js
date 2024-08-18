import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UploadImageScreen from '../screens/UploadImageScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  };

  const api = axios.create({
    baseURL: 'http://192.168.1.143:8000/api/',
  });

  // Function to set JWT token in Axios headers
  const setAuthToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('token/', {
        username,
        password,
      });
      console.log('Login successful:', response.data);
      const { access } = response.data; // Adjust if using different field names
      await AsyncStorage.setItem('token', access);
      setAuthToken();
      setToken(access);
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      throw error; // Propagate the error to handle it in LoginScreen
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="UploadImage" component={UploadImageScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AppNavigator;
