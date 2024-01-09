// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Card } from 'react-native-elements';


const backgroundImage = require('../assets/university.jpg');

export default function HomeScreen({ navigation }) {
  const [selectedPage, setSelectedPage] = useState(null);

  const navigateToPage = (pageName) => {
    setSelectedPage(pageName);
    navigation.navigate(pageName);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          <Text style={styles.appTitle}>University App</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.pillButton}
              onPress={() => navigateToPage('Login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pillButton, styles.registerButton]}
              onPress={() => navigateToPage('Register')}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
    justifyContent: 'flex-start', 
    paddingTop: 40, 
  },
  cardContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pillButton: {
    width: '40%',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
  },
  registerButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
