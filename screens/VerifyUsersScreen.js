import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const FIREBASE_DATABASE_URL = 'https://managment-university-default-rtdb.europe-west1.firebasedatabase.app';

const fetchUserData = async () => {
  try {
    const response = await axios.get(`${FIREBASE_DATABASE_URL}/users.json`);
    const userData = response.data;
    return userData ? Object.values(userData) : [];
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return [];
  }
};

const VerifyUsersScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      setUsers(userData.filter(user => user.idPhoto && user.authenticated === 'pending'));
    };

    fetchData();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await axios.patch(`${FIREBASE_DATABASE_URL}/users/${userId}.json`, {
        authenticated: 'authenticated',
      });

      setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId));
    } catch (error) {
      console.error('Error accepting user:', error.message);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`${FIREBASE_DATABASE_URL}/users/${userId}.json`, {
        authenticated: '',
      });

      setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Verify Users Screen</Text>
      {users.length === 0 ? (
        <Text>No users pending authentication.</Text>
      ) : (
        users.map((user) => (
          <View key={user.uid} style={styles.card}>
            <Image source={{ uri: user.idPhoto }} style={styles.userImage} />
            <Text>{`First Name: ${user.firstName}`}</Text>
            <Text>{`Last Name: ${user.lastName}`}</Text>
            <Text>{`Id Number: ${user.idNumber}`}</Text>
            <TouchableOpacity onPress={() => handleAccept(user.uid)} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(user.uid)} style={styles.rejectButton}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 3,
  },
  userImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VerifyUsersScreen;
