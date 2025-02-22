// Import required libraries and modules
import React, { useState } from 'react'; // React and useState for managing component state
import { NavigationContainer } from '@react-navigation/native'; // Navigation container for handling navigation state
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigator for screen navigation
import { api, setTokenInStorage, removeTokens } from '../navigation/api';


// Import all screen components for navigation
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UploadImageScreen from '../screens/UploadImageScreen';
import HomeScreen from '../screens/HomeScreen';
import SingleIssueListScreen from '../screens/SingleIssueListScreen';
import LaunchScreen from '../screens/LaunchScreen';

// Create a Stack Navigator instance
const Stack = createStackNavigator();

// Define the main navigation component
const AppNavigator = () => {
  const [token, setToken] = useState(null); // State to store authentication token

  // handle user login
  const handleLogin = async (username, password, navigation) => {
    try {
      const response = await api.post('/token/', { username, password });
  
      console.log('Login Response:', response.data); 
  
      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error('Invalid response from the server');
      }
  
      await setTokenInStorage('token', access);
      await setTokenInStorage('refreshToken', refresh);
      setToken(access);
  
      console.log('Access Token Set:', access);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log("Login Failed:", error.response?.status || error.message);
      alert("Login failed, please try again.");
    }
  };
  
  // handle user logout
  const handleLogout = async (navigation) => {
    try {
      await removeTokens(); // Remove tokens from storage
      setToken(null); // Reset token state
      navigation.navigate('LoginScreen'); 
    } catch (error) {
      console.error('Error logging out:', error.message); 
      alert('Error logging out. Please try again.'); 
    }
  };

  return (
    // Navigation container to manage the navigation state of the app
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        
        {/* Launch screen - the initial screen with no header */}
        <Stack.Screen
          name="LaunchScreen"
          component={LaunchScreen}
          options={{ headerShown: false }}
        />

        {/* Login screen with a custom login handler */}
        <Stack.Screen 
          name="LoginScreen" 
          options={{
            headerShown: true,  // Show the header with back button
            title: 'Sign In',  // Customize header title
          }}
        >
          {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>


        {/* Register screen for user signup */}
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: true, title: 'Sign Up' }}/>

        {/* Home screen with a custom logout handler */}
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
          {(props) => (
            <HomeScreen {...props} onLogout={() => handleLogout(props.navigation)} />
          )}
        </Stack.Screen>

        {/* Upload image screen */}
        <Stack.Screen name="UploadImageScreen" component={UploadImageScreen} options={{ title: 'Upload Issue' }}  />

        {/* Screen for displaying a list of issues */}
        <Stack.Screen name="SingleIssueListScreen" component={SingleIssueListScreen} options={{ title: 'Reported Issues' }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;