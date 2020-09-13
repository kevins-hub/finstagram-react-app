

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCHmK5cuNQH95uLVleVohTbOeo2EnH4HdU",
    authDomain: "finstagram-react.firebaseapp.com",
    databaseURL: "https://finstagram-react.firebaseio.com",
    projectId: "finstagram-react",
    storageBucket: "finstagram-react.appspot.com",
    messagingSenderId: "974905867524",
    appId: "1:974905867524:web:87d1df5d22ddd36969a451",
    measurementId: "G-G0CRXG21B3"

});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};