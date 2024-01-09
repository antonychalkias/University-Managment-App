import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { getUserDataByEmail } from '../components/GetUserData';
import ProfileSection from '../components/ProfileSection';

export default function DashboardScreen({ route, navigation }) {
  const { email, idToken } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDataByEmail(email, idToken);
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [email, idToken]);

  const handleBoxPress = (box) => {
    switch (box) {
      case 'Profile':
        break;
      case 'Verify':
        navigation.navigate('VerifyScreen', { userData: userData });
        break;
      case 'Maps':

        navigation.navigate('MapsScreen', { userData });
        break;
      case 'Logout':

        navigation.navigate('LogoutScreen');
        break;

      default:
        break;
    }
  };

  const renderBox = (box, imageSource) => {
    return (
      <TouchableOpacity
        style={styles.boxContainer}
        onPress={() => handleBoxPress(box)}
        key={box}
      >
        <View style={styles.box}>
          <Image source={imageSource} style={styles.boxImage} />
          <Text style={styles.boxText}>{box}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData && <ProfileSection user={userData} />}
      <View style={styles.separator} />
      <View style={styles.sectionContainer}>
        {renderBox('Verify', require('../assets/verify.png'))}
      </View>
      <View style={styles.sectionContainer}>
        {renderBox('Maps', require('../assets/maps.png'))}
      </View>
      <View style={styles.sectionContainer}>
        {renderBox('Logout', require('../assets/logout.png'))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  separator: {
    height: 50,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  boxContainer: {
    alignItems: 'center',
    flex: 1,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '50%',
  },
  boxImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
