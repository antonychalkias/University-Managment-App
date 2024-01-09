import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { F_AUTH } from '../utils/auth'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { storeUserToken } from '../utils/userToken';

export default function LoginHandler({ onLogin, onCancel, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const auth = F_AUTH;

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await storeUserToken(idToken);

      if (email === 'ant.f.chlks@gmail.com') {

        navigation.navigate('AdminDashboardScreen', { email, idToken });
      } else {

        navigation.navigate('DashboardScreen', { email, idToken });
      }
  
      onLogin();
    } catch (error) {
      console.error('Login Error:', error.message);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Student Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Student Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: '#fff', 
  },
  buttonContainer: {
    flexDirection: 'row', 
    marginTop: 10,
  },
  loginButton: {
    flex: 1, 
    backgroundColor: '#27ae60', 
    padding: 10,
    borderRadius: 20,
    marginRight: 5,
  },
  cancelButton: {
    flex: 1, // Take equal space
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
