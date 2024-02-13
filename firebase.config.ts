import { InjectionToken } from '@angular/core';
import { getAuth } from '@angular/fire/auth';

export const firebaseConfig = {
  projectId: 'vocapp-55740',
  appId: '1:665105657279:web:46d54e129bca6640ce050a',
  storageBucket: 'vocapp-55740.appspot.com',
  apiKey: 'AIzaSyDJRVlnHdrUJTatcw6tLL5FsrWqL9wiZv8',
  authDomain: 'vocapp-55740.firebaseapp.com',
  messagingSenderId: '665105657279',
};

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    return auth;
  },
});
