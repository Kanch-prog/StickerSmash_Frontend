import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the HomeScreen component
const HomeScreen = ({ navigation, onLogout }) => {
  
  console.log(navigation); // Debugging navigation

  return (
    <View style={styles.container}>

      {/* Title text for the screen */}
      <Text style={styles.title}>Home</Text>

      {/* Button to navigate to UploadImageScreen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => { 
          console.log('Navigating to UploadImageScreen'); 
          navigation.navigate('UploadImageScreen'); 
        }}
      >
        <Text style={styles.buttonText}>Upload Issue</Text> 
      </TouchableOpacity>

      {/* Button to navigate to SingleIssueListScreen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => { 
          console.log('Navigating to SingleIssueListScreen'); 
          navigation.navigate('SingleIssueListScreen'); 
        }}
      >
        <Text style={styles.buttonText}>Issue List</Text>
      </TouchableOpacity>

      {/* Logout button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={onLogout}
      >
        <Text style={styles.buttonText}>Logout</Text> 
      </TouchableOpacity>

    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '700', // Bold text
    color: '#171A1FFF', // Dark text color
    textAlign: 'center', // Ensures text inside is centered
    alignSelf: 'center', // Centers the title within its container
    marginBottom: 20, // Adds spacing below the title
  },
  button: {
    width: 344,
    height: 36,
    backgroundColor: '#636AE8',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

// Export at the end
export default HomeScreen;
