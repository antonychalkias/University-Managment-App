import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminDashboardScreen = ({ navigation }) => {
  const handleVerifyUsers = () => {
    // Navigate to VerifyUsersScreen
    navigation.navigate('VerifyUsersScreen');
  };

  const handleLogout = () => {
    // Navigate to the LogoutScreen
    navigation.navigate('LogoutScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={handleVerifyUsers}>
        <Text style={styles.buttonText}>Verify Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
