const firebase = require('firebase');

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

const database = firebase.database();
const auth = firebase.auth();

module.exports = {
  firebase,
  database,
  auth
}