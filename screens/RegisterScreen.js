import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { submitRegistration } from '../components/RegisterHandler';
const backgroundImage = require('../assets/university.jpg');


export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    const registrationData = {
      firstName,
      lastName,
      email,
      password,
    };
  
    const registrationResult = await submitRegistration(registrationData);
  
    if (registrationResult.success) {
      
      navigation.navigate('Login');  
    } else {
      
      if (registrationResult.message === 'Email already exists') {
        
        setErrorMessage('Email already exists. Please use a different email.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 15000); 
      } else {
        
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };
  

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {

    return () => {
      setErrorMessage(null);
    };
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Register</Text>
         
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#e74c3c' }]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.registerButton, { backgroundColor: '#27ae60' }]} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerButton: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  
  errorContainer: {
    backgroundColor: '#e74c3c', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#fff', 
    textAlign: 'center',
  },
});
