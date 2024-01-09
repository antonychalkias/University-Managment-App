// LoginScreen.js
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginHandler from '../components/LoginHandler';

const backgroundImage = require('../assets/university.jpg');

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {

  };

  const handleCancel = () => {

    navigation.goBack();
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <LoginHandler onLogin={handleLogin} onCancel={handleCancel} navigation={navigation} />
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
});
