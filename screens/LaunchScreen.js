import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LaunchScreen = ({ navigation }) => {
  
  useEffect(() => {
    const checkUserToken = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Wait 4s before checking

      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token fetched:', token);

        if (token) {
          navigation.replace('HomeScreen');
        } 
        // If no token let user decide between Sign Up or Login
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    checkUserToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logoImage} />
        <Text style={styles.logo}>CIVIC LINK</Text> 
      </View>

      <Text style={styles.description}>
        Seamlessly report and track your issues today!
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.buttonText1}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText2}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for UI elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#636AE8',
    padding: 16,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    height: 52,
    backgroundColor: '#F2F2FD',
    marginBottom: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
  },
  buttonText2: {
    fontSize: 18,
    fontWeight: '400',
    color: '#636AE8',
  },
});

export default LaunchScreen;
