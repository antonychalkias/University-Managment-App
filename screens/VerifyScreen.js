import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { updateUserVerificationData } from '../components/UpdateUserVerificationData';
import { getAuthenticationStatus } from '../components/VerifiedStatus'; // Import your getAuthenticationStatus function
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export default function VerifyScreen({ route, navigation }) {
  const { userData } = route.params;
  const [authenticationStatus, setAuthenticationStatus] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [isCaptionModalVisible, setIsCaptionModalVisible] = useState(false);

  const checkAuthenticationStatus = async () => {
    try {
      const status = await getAuthenticationStatus(userData.uid);
      setAuthenticationStatus(status);
    } catch (error) {
      console.error('Error checking authentication status:', error.message);
      setAuthenticationStatus('Error');
    }
  };

  useEffect(() => {
    checkAuthenticationStatus(); 
  }, [userData.uid]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      checkAuthenticationStatus(); 
    });

    return () => {
      focusListener(); 
    };
  }, [navigation, userData.uid]);

  useEffect(() => {
    checkAuthenticationStatus();
  }, [userData.uid]);

  const handleImagePicker = async () => {
    try {
      
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (
        mediaLibraryPermission.status !== 'granted' ||
        (cameraPermission.status !== 'granted' && cameraPermission.canAskAgain)
      ) {
        Alert.alert(
          'Permission Denied',
          'Please allow access to your media library and camera to upload images.'
        );
        return;
      }

      Alert.alert(
        'Choose Image Source:',
        '',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Camera',
            onPress: () => pickImage(true),
          },
          {
            text: 'Library',
            onPress: () => pickImage(false),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const pickImage = async (fromCamera) => {
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

      if (!result.canceled) {
        setIdPhoto(result.assets[0].uri);
        if (result.uri.startsWith('file:')) {
          setIsCaptionModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      
      if (idNumber && idPhoto) {
        const submissionStatus = await updateUserVerificationData(userData.uid, {
          firstName,
          lastName,
          idNumber,
          idPhoto,
          caption, 
        });

        setSubmissionStatus(submissionStatus);

        
        checkAuthenticationStatus();
      } else {
        setSubmissionStatus('Please fill in all fields and upload the ID photo.');
      }
    } catch (error) {
      console.error('Error submitting verification:', error.message);
      setSubmissionStatus('Error submitting verification. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verification Screen</Text>

      
      {authenticationStatus === null || authenticationStatus === '' ? (
        <>
          {submissionStatus !== '' && (
            <Text style={styles.error}>{submissionStatus}</Text>
          )}
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
            placeholder="ID Number"
            value={idNumber}
            onChangeText={(text) => setIdNumber(text)}
          />

          
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
            <Text style={styles.buttonText}>Upload ID Photo</Text>
          </TouchableOpacity>

          {idPhoto && (
            <>
              <Image source={{ uri: idPhoto }} style={styles.uploadedImage} />
              
              <TextInput
                style={styles.input}
                placeholder="Caption"
                value={caption}
                onChangeText={(text) => setCaption(text)}
              />
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitVerification}>
            <Text style={styles.buttonText}>Submit Verification</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {authenticationStatus === 'pending' && (
            <Text style={[styles.statusMessage, styles.authStatus]}>
              Your authentication data has been submitted. Please wait for it to be authenticated.
            </Text>
          )}

          {authenticationStatus === 'authenticated' && (
            <Text style={[styles.statusMessage, styles.authStatus]}>
              Your authentication has been successful. You are now authenticated.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  authStatus: {
    color: '#3498db', 
  },
  error: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});
