import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as rtdbRef, push as rtdbPush, getDatabase, child, get, set } from 'firebase/database';
import axios from 'axios';
import { F_AUTH } from '../utils/auth';


const encodeEmail = (email) => {
  return email.replace('.', ',');
};

const checkDuplicateEmail = async (email) => {
  try {
    const usersRef = rtdbRef(getDatabase(), 'users');
    const encodedEmail = encodeEmail(email);
    const snapshot = await get(child(usersRef, encodedEmail));
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking duplicate email:', error.message);
    return false;
  }
};

const submitRegistration = async (registrationData) => {
  try {
    const { email, password, firstName, lastName } = registrationData;


    const isDuplicateEmail = await checkDuplicateEmail(email);

    if (isDuplicateEmail) {
      return { success: false, message: 'Email already exists' };
    }

    const userCredential = await createUserWithEmailAndPassword(F_AUTH, email, password);

    const usersRef = rtdbRef(getDatabase(), 'users');
    const userData = {
      uid: userCredential.user.uid,
      email,
      firstName,
      lastName,
      authenticated: '',  
      profilePhoto: '',    
      idPhoto: '',       
    };

    await set(child(usersRef, userCredential.user.uid), userData);


    const backendResponse = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3f1mPPZ04UcxnqooBiNG0-miWeMyR1Y8', {
      email,
      password,
      returnSecureToken: true,
    });


    if (backendResponse.status === 200 && backendResponse.data.idToken) {
      return { success: true, message: 'Registration successful!', userDocRef: userCredential.user.uid };
    } else {
      console.error('Backend processing failed:', backendResponse.data);
      return { success: false, message: 'Backend processing failed.', error: backendResponse.data };
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
    return { success: false, message: 'Registration failed.', error: error.message };
  }
};

export { submitRegistration };
