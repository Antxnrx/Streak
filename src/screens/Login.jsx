import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import EmailVerificationDialog from '../components/EmailVerificationDialog';
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';
import { FcGoogle } from 'react-icons/fc';

const Login = ({ onNavigate }) => {
  const { login, signup, signInWithGoogle, forgotPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isSignup) {
        await signup(email, password);
        // After signup (or resending verification), show verification dialog
        setShowVerificationDialog(true);
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLocalError('');
      } else {
        await login(email, password);
        onNavigate('home');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // If it's an unverified email error, still show the dialog to guide them
      if (err.code === 'auth/email-already-in-use' || (error && error.includes('unverified'))) {
        setShowVerificationDialog(true);
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLocalError('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLocalError('');
      setIsSubmitting(true);
      await signInWithGoogle();
      onNavigate('home');
    } catch (err) {
      console.error('Google sign-in error:', err);
      // Error is already set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fadeInUp">
          <h1 className="text-4xl font-bold mb-2">StreakMe</h1>
          <p className="text-text-muted">Build streaks, stay consistent</p>
        </div>

        {/* Form Container */}
        <div className="fadeInUp">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <TextField
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError('');
              }}
              type="email"
              label="Email"
              disabled={isSubmitting}
            />

            {/* Password */}
            <TextField
              placeholder="••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError('');
              }}
              type="password"
              label="Password"
              disabled={isSubmitting}
            />

            {/* Forgot Password Link (Login only) */}
            {!isSignup && (
              <button
                type="button"
                onClick={() => setShowForgotPasswordDialog(true)}
                className="text-sm font-semibold transition-all hover:opacity-80"
                style={{ color: '#4a6cf7' }}
              >
                Forgot Password?
              </button>
            )}

            {/* Confirm Password (Signup only) */}
            {isSignup && (
              <TextField
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setLocalError('');
                }}
                type="password"
                label="Confirm Password"
                disabled={isSubmitting}
              />
            )}

            {/* Error Display */}
            {localError && (
              <div className="p-3 rounded-lg text-sm" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'rgba(239, 68, 68, 0.8)',
              }}>
                {localError}
              </div>
            )}

            {/* Submit Button */}
            <PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting || !email.trim() || !password.trim()}
            >
              {isSubmitting ? 'Loading...' : (isSignup ? 'Sign Up' : 'Log In')}
            </PrimaryButton>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#e5e7eb' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: 'white', color: '#9ca3af' }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#f5f5f5',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              <FcGoogle size={20} />
              {isSubmitting ? 'Signing in...' : 'Continue with Google'}
            </button>
          </form>

          {/* Toggle Signup/Login */}
          <div className="text-center mt-6">
            <p className="text-sm text-text-muted">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setLocalError('');
                  setConfirmPassword('');
                }}
                className="ml-2 font-semibold text-primary hover:underline transition-all"
                style={{ color: '#4a6cf7' }}
              >
                {isSignup ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog 
        isOpen={showVerificationDialog} 
        onClose={() => setShowVerificationDialog(false)}
      />

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        isOpen={showForgotPasswordDialog}
        onClose={() => setShowForgotPasswordDialog(false)}
        onSubmit={forgotPassword}
      />
    </div>
  );
};

export default Login;
