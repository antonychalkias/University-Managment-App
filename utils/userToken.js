
// userToken.js
import { F_AUTH } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error storing user token:', error.message);
  }
};

const getUserToken = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    return userToken;
  } catch (error) {
    console.error('Error getting user token:', error.message);
    return null;
  }
};

const removeUserToken = async () => {
  try {
    
    await AsyncStorage.removeItem('userToken');

   
    await F_AUTH.signOut();
  } catch (error) {
    console.error('Error removing user token:', error.message);
  }
};

export { storeUserToken, getUserToken, removeUserToken };
