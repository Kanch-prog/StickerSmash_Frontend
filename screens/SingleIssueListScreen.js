import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../navigation/api';


const SingleIssueListScreen = ({ navigation }) => {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStickers = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      navigation.navigate('LoginScreen');
      return;
    }

    try {
      const response = await api.get('/stickers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStickers(response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)));
      console.log('Stickers:', response.data); 
    } catch (err) {
      console.log('API Error:', err); 
      setError(err.message || 'An error occurred while fetching stickers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchStickers();
    }, 30000); // 30 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'orange';
      case 'Medium':
        return 'green';
      case 'Low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'black';
    }
  };

  const renderStickerItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      )}

      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.description}>Description: {item.description || 'N/A'}</Text>
      
      <Text style={[styles.priority, { color: getPriorityColor(item.priority) }]}>
        Priority: {item.priority}
      </Text>

      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>

      <Text style={styles.timestamp}>Uploaded At: {new Date(item.uploaded_at).toLocaleString()}</Text>

      <Text style={styles.location}>
        Location: {item.latitude}, {item.longitude}
      </Text>

    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#636AE8" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchStickers}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (stickers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No stickers reported yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stickers}
        keyExtractor={(item) => item.report_id ? item.report_id.toString() : item.id.toString()}
        renderItem={renderStickerItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636AE8',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  priority: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  user: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  empty: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#636AE8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SingleIssueListScreen;
