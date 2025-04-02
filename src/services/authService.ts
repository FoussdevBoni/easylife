import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
  } from 'firebase/auth';
  import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
  
  import type { User } from '../utils/database';
  import { auth, db } from '../utils/firebase';
  
  export const authService = {
    async register(email: string, password: string, userData: User) {
      try {
        // Create Firebase Auth user first
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const userId = userCredential.user.uid;
  
        // Create user document
        const userRef = doc(db, 'users', userId);
  
        await setDoc(userRef, userData);
  
        return userCredential.user;
      } catch (error: any) {
        throw error;
      }
    },
  
    async sendVerificationEmail(user: any) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        throw new Error("Impossible d'envoyer l'email de vérification.");
      }
    },
  
    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const { user } = userCredential;
  
        const userRef = doc(db, 'prestataires', user.uid);
        const userDoc = await getDoc(userRef);
  
        if (!userDoc.exists()) {
          throw new Error('User account not found');
        }
  
        const userData = userDoc.data();
  
        // Update lastActive timestamp
        await setDoc(
          userRef,
          {
            lastActive: serverTimestamp(),
          },
          { merge: true },
        );
  
        return {
          user,
          userData,
        };
      } catch (error: any) {
        throw error;
      }
    },
  
    async logout() {
      try {
        await signOut(auth);
      } catch (error: any) {
        throw new Error('Error during logout');
      }
    },
  
    // Nouvelle méthode : Réinitialisation du mot de passe
    async resetPassword(email: string) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (error: any) {
        throw new Error('Unable to send password reset email');
      }
    },
  
    getAuthError(error: any) {
      console.log(error.code);
      const errorCode = error?.code || 'unknown-error';
      const errorMessages: any = {
        'auth/invalid-credential': 'Adresse email ou mot de passe incorrect.',
        'auth/user-disabled': 'Votre compte a été désactivé.',
        'auth/user-not-found': 'Utilisateur non trouvé.',
        'auth/missing-password': 'Veuillez insérer votre mot de passe.',
        'auth/network-request-failed':
          "Problème lié à l'internet. Veuillez réessayer.",
        'auth/too-many-requests':
          'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
        'auth/invalid-email':
          'Adresse email invalide. Veuillez vérifier et réessayer.',
        'auth/email-already-in-use':
          'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.',
        'auth/non-merchant-account': error.message,
        'auth/merchant-account': error.message,
      };
  
      const defaultMessage =
        'Une erreur inconnue est survenue. Veuillez réessayer plus tard.';
      return errorMessages[errorCode] || defaultMessage;
    },
    // Nouvelle méthode : Validation des mots de passe forts
    isPasswordStrong(password: string): boolean {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      return passwordRegex.test(password);
    },
  };
  