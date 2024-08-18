import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import ImageViewer from '../components/ImageViewer';

const PlaceholderImage = require('../assets/images/background-image.png');

export default function UploadImageScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

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

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("No image selected.");
      return;
    }

    const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
    const filename = `upload_${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/png', // or the appropriate type for your image
      name: filename,
    });

    try {
      const response = await axios.post('http://192.168.1.143:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Attach JWT token to headers
        },
      });
      console.log('Image uploaded successfully:', response.data);
      Alert.alert('Success', 'Image uploaded successfully!');
      setSelectedImage(null); // Clear selected image after upload
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Error uploading image. Please try again.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login'); // Assuming your login screen is named 'Login'
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button label="Use this photo" onPress={uploadImage} />
        <Button label="Logout" onPress={logout} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
