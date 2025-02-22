// Import necessary React and React Native modules
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';

// Import Picker for dropdown selection
import { Picker } from '@react-native-picker/picker';

// Import Image Picker from Expo to allow users to select images
import * as ImagePicker from 'expo-image-picker';

// Import Location services from Expo to fetch the user's location
import * as Location from 'expo-location';

// Import Axios for making API requests
import axios from 'axios';

// Import AsyncStorage to store and retrieve authentication tokens
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '../navigation/api';
// Load a placeholder image for when no image is selected
const PlaceholderImage = require('../assets/images/background-image.png');

// Define and export the UploadImageScreen component
export default function UploadImageScreen({ navigation }) {
  // State variables to store selected image, category, description, priority, and location
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [ward, setWard] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Function to pick an image from the user's gallery
  const pickImageAsync = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to enable media library access to pick an image.');
      return; // Stop if permission is not granted
    }
  
    // Now that permission is granted, you can pick an image
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Allow cropping the image
      quality: 1, // Set image quality to highest
    });
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Save the selected image URI to state
    } else {
      Alert.alert('No Image Selected', 'You did not select any image.');
    }
  };
  

  // Function to fetch the user's current location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location access in your device settings.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 5000, // Set a timeout of 5 seconds to get location
      });

      // Extract latitude and longitude from location data
      const { latitude, longitude } = currentLocation.coords;
      setLatitude(latitude);
      setLongitude(longitude);

      // Show an alert displaying the fetched location
      Alert.alert('Location Fetched', `Latitude: ${latitude}\nLongitude: ${longitude}`);
    } catch (error) {
      console.log('Error fetching location:', error); // Changed to console.log
      Alert.alert('Error', 'Failed to fetch location. Ensure GPS is enabled.');
    }
  };

  // Function to submit the image and form details to the backend
  const handleSubmit = async () => {
    // Check if all required fields are filled
    if (!selectedImage || !category || !description || !priority || !latitude || !longitude) {
      Alert.alert('Incomplete Form', 'Please fill out all fields and select an image.');
      return;
    }

    // Retrieve authentication token from storage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Login Required', 'You need to log in first.');
      navigation.navigate('LoginScreen'); // Redirect user to login if no token found
      return;
    }

    // Create form data for API submission
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`, 
    });
    formData.append('category', category);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('ward', ward);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    // generate API request to upload the data
    try {
      const response = await api.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message and navigate to HomeScreen
      Alert.alert('Success', 'Image and details submitted successfully!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
        await AsyncStorage.removeItem('token'); // Remove expired token
        navigation.navigate('LoginScreen');
      } else {
        console.log('Error uploading image:', error); // Changed to console.log
        Alert.alert('Submission Error', 'Error submitting details. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image preview section */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image source={PlaceholderImage} style={styles.image} />
        )}
      </View>

      {/* Button to select an image */}
      <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
        <Text style={styles.buttonText}>Choose a Photo</Text>
      </TouchableOpacity>

      {/* Category dropdown menu */}
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

      <Text style={styles.label}>Ward</Text>
      <Picker
        selectedValue={ward}
        onValueChange={(itemValue) => setWard(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Ward" value="" />
        <Picker.Item label="Gintota" value="Gintota" />
        <Picker.Item label="Dadalla" value="Dadalla" />
        <Picker.Item label="Bope" value="Bope" />
        <Picker.Item label="Kumbalwella" value="Kumbalwella" />
        <Picker.Item label="Madawalamulla" value="Madawalamulla" />
        <Picker.Item label="Deddugoda" value="Deddugoda" />
        <Picker.Item label="Maitipe" value="Maitipe" />
        <Picker.Item label="Dangedara" value="Dangedara" />
        <Picker.Item label="Bataganvila" value="Bataganvila" />
        <Picker.Item label="Sangamiththapura" value="Sangamiththapura" />
        <Picker.Item label="Galwadugoda" value="Galwadugoda" />
        <Picker.Item label="Kandewaththa" value="Kandewaththa" />
        <Picker.Item label="Kaluwella" value="Kaluwella" />
        <Picker.Item label="Galle Town" value="Galle Town" />
        <Picker.Item label="Weliwaththa" value="Weliwaththa" />
        <Picker.Item label="Thalapitiya" value="Thalapitiya" />
        <Picker.Item label="Makuluwa" value="Makuluwa" />
        <Picker.Item label="Milidduwa" value="Milidduwa" />
        <Picker.Item label="Magalle" value="Magalle" />
        <Picker.Item label="Katugoda" value="Katugoda" />
      </Picker>

      {/* Button to get user's location */}
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>

      {/* Priority selection dropdown */}
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

      {/* Description input field */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter a detailed description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Button to navigate to the issue list */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SingleIssueListScreen')}
      >
        <Text style={styles.buttonText}>Go to Issue List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#636AE8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
