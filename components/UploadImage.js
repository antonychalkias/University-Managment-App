import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { F_APP } from "../utils/auth";
import axios from "axios"; // Import axios for making HTTP requests
import UploadStatus from "./UploadStatus"; // Make sure to provide the correct path to your UploadStatus component

const UploadImage = ({ uid }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    requestPermissions();

    fetchUserData();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to your media library to upload images."
      );
    }
  };

  const fetchUserData = async () => {
    try {

      const userDataResponse = await axios.get(
        `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`
      );


      const { profilePhoto } = userDataResponse.data;

      if (profilePhoto) {
        setProfilePhoto(profilePhoto);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleImagePress = () => {
    Alert.alert(
      "Choose Image from:",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Camera",
          onPress: () => handleImagePicker("camera"),
        },
        {
          text: "Library",
          onPress: () => handleImagePicker("library"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const updateProfilePhotoInDatabase = async (downloadURL) => {
    try {
e
      await axios.patch(
        `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
        { profilePhoto: downloadURL }
      );
    } catch (error) {
      console.error("Error updating profile photo in the database:", error);
    }
  };

  const handleImagePicker = async (source) => {
    try {
      let result;
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setProfilePhoto(selectedAsset.uri);


        setUploading(true);


        const downloadURL = await uploadImage(selectedAsset.uri, "image");

        updateProfilePhotoInDatabase(downloadURL);

        setUploading(false);
      }
    } catch (error) {
      console.error("Error picking image", error);

      setUploading(false);
    }
  };

  const uploadImage = (imageUri, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();


        const storage = getStorage();
        const storageRef = ref(storage, `profilePhotos` + new Date().getTime());

        const uploadTask = uploadBytesResumable(storageRef, blob);


        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error during upload:", error);
            reject(error); 
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
                reject(error);
              });
          }
        );
      } catch (error) {
        console.error("Error fetching image:", error);
        reject(error);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
        ) : (
          <View style={styles.uploadTextView}>
            <Text style={styles.uploadText}>Upload Image{"\n"}Here</Text>
          </View>
        )}
      </TouchableOpacity>

      <UploadStatus uploading={uploading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  uploadTextView: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default UploadImage;