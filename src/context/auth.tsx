import React, { createContext, useContext, useEffect, useState } from 'react';

import firebase, { firestore } from '@/firebase';
import { UserData } from '@/types';

interface AuthState {
  currentUser: UserData | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isLoading: true,
  isLoggedIn: false,
};

export const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoggedIn, toggleLoggedIn] = useState<boolean>(false);
  const [isLoading, toggleIsLoading] = useState<boolean>(true);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Store the information in a table
        firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .then(doc => {
            if (!doc.exists) {
              doc.ref.set({
                photoURL: user?.photoURL,
                displayName: user?.displayName,
              });
            }
          });

        setCurrentUser(Object.assign({}, { id: user.uid }, user) as UserData);
        toggleLoggedIn(true);
      } else {
        setCurrentUser(null);
        toggleLoggedIn(false);
      }

      toggleIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
