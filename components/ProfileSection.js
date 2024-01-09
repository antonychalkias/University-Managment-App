import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UploadImage from './UploadImage';

const ProfileSection = ({ user, onImageUpload }) => {
  const { uid, profilePhoto, email, firstName, lastName } = user;

  return (
    <View style={styles.cardContainer}>
      <UploadImage uid={uid} profilePhoto={profilePhoto} onImageUpload={onImageUpload} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 6,
  },
  userInfo: {
    flex: 1,
    margin: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
  },
});

export default ProfileSection;
