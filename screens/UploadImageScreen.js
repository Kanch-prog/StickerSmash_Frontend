import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure Picker is correctly imported
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaceholderImage = require('../assets/images/background-image.png');

export default function UploadImageScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [location, setLocation] = useState('');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !category || !description || !priority || !location) {
      alert("Please fill out all fields and select an image.");
      return;
    }
  
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      alert("You need to log in first.");
      navigation.navigate('LoginScreen');
      return;
    }
  
    const filename = `upload_${Date.now()}.jpg`;
  
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/png',
      name: filename,
    });
    formData.append('category', category);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('location', location);
  
    try {
      const response = await axios.post('http://192.168.1.143:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Image uploaded successfully:', response.data);
      alert('Success', 'Image and details submitted successfully!');
      navigation.navigate('HomeScreen'); // Navigate to Home or another screen
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        alert('Session expired. Please log in again.');
        await AsyncStorage.removeItem('token'); // Remove expired token
        navigation.navigate('LoginScreen'); // Navigate to login screen
      } else {
        console.error('Error uploading image:', error);
        alert('Error submitting details. Please try again.');
      }
    }
  };
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove the token from AsyncStorage
      navigation.navigate('LoginScreen'); // Navigate to the Login screen or another screen
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image source={PlaceholderImage} style={styles.image} />
        )}
      </View>
      <Button title="Choose a photo" onPress={pickImageAsync} />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Public Safety Incidents" value="Public Safety Incidents" />
        <Picker.Item label="Public Health and Sanitation" value="Public Health and Sanitation" />
        <Picker.Item label="Infrastructure Issues" value="Infrastructure Issues" />
        <Picker.Item label="Environmental Concerns" value="Environmental Concerns" />
        <Picker.Item label="Social Services and Welfare" value="Social Services and Welfare" />
        <Picker.Item label="Community Engagement" value="Community Engagement" />
        <Picker.Item label="Emergency Services" value="Emergency Services" />
      </Picker>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Priority</Text>
      <Picker
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
        <Picker.Item label="Critical" value="Critical" />
      </Picker>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter a detailed description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
