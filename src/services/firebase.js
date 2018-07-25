import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDzvu6rP9co2FFPLakdoLcsKqOJdyx1Ysg",
    authDomain: "pidi-8d04b.firebaseapp.com",
    databaseURL: "https://pidi-8d04b.firebaseio.com",
    projectId: "pidi-8d04b",
    storageBucket: "pidi-8d04b.appspot.com",
    messagingSenderId: "444789193704"
};

firebase.initializeApp(config);

export default firebase;

