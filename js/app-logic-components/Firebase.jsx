import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyChpzJ6YT_cVjozbbvHgIznu76M6iAdslw',
  authDomain: 'scsworkplace-64ff7.firebaseapp.com',
  databaseURL: 'https://scsworkplace-64ff7.firebaseio.com',
  projectId: 'scsworkplace-64ff7',
  storageBucket: 'scsworkplace-64ff7.appspot.com',
  messagingSenderId: '726042632605'
};
firebase.initializeApp(config);

export default firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
