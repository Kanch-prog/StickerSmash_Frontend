import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../navigation/api';


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const handleRegister = async () => {
    if (!email || !password1 || !password2) {
      alert('All fields are required');
      return;
    }
  
    if (password1 !== password2) {
      alert('Passwords do not match');
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return;
    }
  
    try {
      const response = await api.post('/auth/users/', {
        username: email.split('@')[0],
        email,
        password: password1,
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Create an account</Text>

    
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password1}
          onChangeText={setPassword1}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />
      </View>

    
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    position: 'absolute',
    top: 150,
    left: 140,
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '700',
    color: '#171A1F',
  },
  subtitle: {
    position: 'absolute',
    top: 211,
    left: 121,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: '#9095A0',
  },
  formContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  input: {
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 12,
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    color: '#171A1F',
  },
  button: {
    marginTop: 12, // Add spacing from the last input
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#636AE8',
    alignSelf: 'stretch', // Make button match input width
    marginHorizontal: 20, // Align with input field padding
  },  
  buttonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});
