// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// `https://firebase.google.com/docs/web/setup#available-libraries`

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoX7bHO9u98LB9n6Dq8rMwyb_jci_Ha4g",
  authDomain: "stor2-537b7.firebaseapp.com",
  projectId: "stor2-537b7",
  storageBucket: "stor2-537b7.firebasestorage.app",
  messagingSenderId: "427333905777",
  appId: "1:427333905777:web:7508e43e909004eb741ad0",
  measurementId: "G-47YM6T8MMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export functions to window object
window.createAccount = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

window.loginWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

window.signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
};

window.resetPassword = (email) => {
  return auth.sendPasswordResetEmail(email);
};

window.logoutUser = () => {
  return auth.signOut();
};

window.checkAuthState = (callback) => {
  auth.onAuthStateChanged(callback);
};

window.checkAdminAuth = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdTokenResult();
    return token.claims.admin || false;
  }
  return false;
};