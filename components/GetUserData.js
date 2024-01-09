import axios from "axios";

export const getUserDataByEmail = async (email, idToken) => {
  try {
    //Get Auth Token
    const authResponse = await axios.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA3f1mPPZ04UcxnqooBiNG0-miWeMyR1Y8',
      {
        idToken: idToken,
        email: email,
      }
    );

    const uid = authResponse.data.users[0].localId;

    const userDataResponse = await axios.get(
      `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`
    );

    const userData = userDataResponse.data;

    const { firstName, lastName, email, profilePhoto, authenticated, idPhoto, id } = userData; 

    return { uid, id, firstName, lastName, email, profilePhoto, authenticated, idPhoto };
  } catch (error) {
    console.error('Error fetching user data:', error.message);

    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }

    if (error.response && error.response.status === 401) {
      console.error('Invalid or expired ID token. Refresh or obtain a new ID token.');
    }

    throw new Error('Error fetching user data');
  }
};
