import firebase from 'firebase';

import * as firebaseConfig from './config/firebase';

import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
