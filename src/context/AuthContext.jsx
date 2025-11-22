import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError(null);
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      
      try {
        // Try to create new user
        const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        
        // Send email verification
        await sendEmailVerification(result.user);
        
        // Sign out user after signup so they can't use app until verified
        await signOut(auth);
        setUser(null);
        
        return result.user;
      } catch (createErr) {
        // If email already exists, check if it's verified
        if (createErr.code === 'auth/email-already-in-use') {
          try {
            // Try to sign in with the provided password
            const signInResult = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            
            // If email is not verified, send verification email again
            if (!signInResult.user.emailVerified) {
              await sendEmailVerification(signInResult.user);
              await signOut(auth);
              setUser(null);
              // Return the user - signup dialog will be shown
              return signInResult.user;
            } else {
              // Email already verified, so this is a duplicate account attempt
              throw new Error('auth/email-already-in-use');
            }
          } catch (signInErr) {
            // Wrong password or other error
            throw createErr; // Throw original "email already in use" error
          }
        } else {
          throw createErr;
        }
      }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      // Normalize email: trim whitespace and convert to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        await signOut(auth);
        setUser(null);
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        throw new Error('Email not verified');
      }
      
      setUser(result.user);
      return result.user;
    } catch (err) {
      if (err.message === 'Email not verified') {
        throw err;
      }
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      throw err;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const normalizedEmail = email.trim().toLowerCase();
      await sendPasswordResetEmail(auth, normalizedEmail);
      return true;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    forgotPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered with an unverified account. We\'ve sent a new verification link. Check your email.',
    'auth/invalid-email': 'Please enter a valid email',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Email or password is incorrect',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/operation-not-allowed': 'Sign up is currently disabled',
  };
  return messages[code] || 'An error occurred. Please try again';
};
