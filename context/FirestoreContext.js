import React, { createContext, useContext } from "react";
import useSyncFirestore from "../hooks/useSyncData";

const FirestoreContext = createContext(null);

export const FirestoreProvider = ({ children, collectionName }) => {
  const firestoreState = useSyncFirestore({ collectionName });

  return (
    <FirestoreContext.Provider value={firestoreState}>
      {children}
    </FirestoreContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte facilement
export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error("useFirestore doit être utilisé à l'intérieur de FirestoreProvider");
  }
  return context;
};
