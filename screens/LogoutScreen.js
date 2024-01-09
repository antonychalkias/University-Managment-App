import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { removeUserToken } from '../utils/userToken'; 

const LogoutScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {

          await removeUserToken();
      

          navigation.navigate('Login'); 
        } catch (error) {
          console.error('Error during logout:', error.message);
        }
      };
      

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutScreen;
