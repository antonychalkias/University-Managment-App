import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

export const updateUserVerificationData = async (uid, data) => {
  try {

    const idPhotoURL = await uploadIdPhoto(data.idPhoto);

    await axios.patch(
      `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        idNumber: data.idNumber,
        idPhoto: idPhotoURL,
        authenticated: 'pending',
      }
    );

    return 'Verification submitted successfully!';
  } catch (error) {
    console.error('Error submitting verification:', error.message);
    throw new Error('Error submitting verification. Please try again.');
  }
};

export const uploadIdPhoto = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `idPhotos/${new Date().getTime()}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error during upload:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
              reject(error);
            });
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image. Please try again.');
  }
};
