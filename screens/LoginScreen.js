import React, { useState } from 'react';  // Import React and useState hook
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// LoginScreen component, receives `navigation` and `onLogin` props
export default function LoginScreen({ navigation, onLogin }) {
  console.log("Rendering LoginScreen");
  // State hooks for user input fields and error messages
  const [username, setUsername] = useState(''); // Store the username
  const [password, setPassword] = useState(''); // Store the password
  const nav = useNavigation();
  // Function to handle login when the button is pressed
  const handleLoginPress = async () => {
    if (!username || !password) {
      alert('Please fill out both fields');
      return;
    }
  
    try {
      await onLogin(username, password, navigation);
    } catch (error) {
      alert("Login failed, please try again.");
    }
  };
  
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign In</Text>

      <View style={styles.formContainer}>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the UI components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    justifyContent: 'center', // Center everything vertically
    padding: 16, // Add padding around the container
  },
  title: {
    position: 'absolute',
    top: 128, // Position at the top
    left: 145, // Move slightly to the right
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '700', // Bold text
    color: '#171A1FFF', // Dark text color
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center', // Center inputs
    marginBottom: 20, // Add spacing
  },
  input: {
    height: 40,
    borderColor: 'gray', // Gray border
    borderWidth: 1, // 1px border
    marginBottom: 12, // Spacing between inputs
    padding: 8, // Padding inside input field
    borderRadius: 8, // Rounded corners
    color: 'black', // Black text color
  },
  errorText: {
    color: 'red', // Red color for error messages
    marginBottom: 12, // Add spacing below
    textAlign: 'center', // Center the error message
  },
  button: {
    height: 52, // Button height
    backgroundColor: '#636AE8', // Blue button
    marginBottom: 12, // Spacing below button
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center text inside button
    alignItems: 'center', // Align text in center
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '400', // Regular font weight
    color: '#ffffff', // White text
  },
});
