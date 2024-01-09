import axios from 'axios';


export const getAuthenticationStatus = async (uid) => {
  try {
    const response = await axios.get(
      `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`
    );

    if (response.data) {
      const userData = response.data;
      return userData.authenticated || '';
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error fetching user data and authentication status:', error.message);
    throw error;
  }
};
