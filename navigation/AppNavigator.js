import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen from '../screens/LoginScreen'; // Check path
import RegisterScreen from '../screens/RegisterScreen'; // Check path
import UploadImageScreen from '../screens/UploadImageScreen'; // Check path
import HomeScreen from '../screens/HomeScreen'; // Check path

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
    };
    initialize();
  }, []);

  const checkAuth = async () => {
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://192.168.1.143:8000/api/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      await AsyncStorage.setItem('token', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      setToken(access);
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      setToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await axios.post('http://192.168.1.143:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const { access } = response.data;
      await AsyncStorage.setItem('token', access);
      setToken(access);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error.response ? error.response.data : error.message);
      return null;
    }
  };

  // Add Axios interceptor
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newAccessToken = await refreshToken();
        
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          // Handle token refresh failure
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          setToken(null);
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="LoginScreen">
              {props => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="UploadImageScreen" component={UploadImageScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
