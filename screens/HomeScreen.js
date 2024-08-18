import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import LoginScreen from './LoginScreen'; // Check path
import RegisterScreen from './RegisterScreen'; // Check path

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Login" onPress={() => navigation.navigate('LoginScreen')} />
      <Button title="Register" onPress={() => navigation.navigate('RegisterScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
