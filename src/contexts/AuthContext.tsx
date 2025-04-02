
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';

import type { Prestataire, User } from '../utils/database';
import { auth, db } from '../utils/firebase';

interface AuthContextType {
  user: Prestataire | null;
  loading: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser): any => {
      if (firebaseUser) {
        const userRef = doc(db, 'prestataires', firebaseUser.uid);

        const unsubscribeDoc = onSnapshot(
          userRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const userData: Prestataire = {
                id: docSnapshot.id,
                ...data
              };
              setUser(userData);
              console.log("userData" , userData)
              setError(null);
            } else {
              setUser(null);
            }
            setLoading(false);
          },
          (snapshotError) => {
            console.error('Snapshot error:', snapshotError);
            setError(snapshotError);
            setLoading(false);
          },
        );

        // Nettoyer `onSnapshot`
        return () => unsubscribeDoc();
      }
    
    });

    // Nettoyer `onAuthStateChanged`
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
