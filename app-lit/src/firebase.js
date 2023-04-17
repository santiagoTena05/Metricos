import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXM3euqSs6_ybfRu5Q2KwzrOZ9QmJfkis",
    authDomain: "metricos-3b7aa.firebaseapp.com",
    databaseURL: "https://metricos-3b7aa-default-rtdb.firebaseio.com",
    projectId: "metricos-3b7aa",
    storageBucket: "metricos-3b7aa.appspot.com",
    messagingSenderId: "1091042589805",
    appId: "1:1091042589805:web:55c1bab417e954054a5364"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;