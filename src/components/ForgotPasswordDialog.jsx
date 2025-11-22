import React, { useState } from 'react';

const ForgotPasswordDialog = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setMessage('');
      await onSubmit(email);
      setMessage('Password reset link sent! Check your email.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg fadeInUp">
        {/* Lock Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 108, 247, 0.1)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-center text-black">Reset Password</h2>
        <p className="text-text-muted text-sm text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="w-full px-6 py-3 rounded-2xl border-0 outline-none transition-all"
              style={{
                backgroundColor: '#f7f7f7',
                color: '#000000',
                fontSize: '16px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0px 6px 20px rgba(74, 108, 247, 0.14), 0px 10px 35px rgba(74, 108, 247, 0.10)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)';
              }}
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgba(239, 68, 68, 0.8)',
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="p-3 rounded-lg text-sm" style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: 'rgba(34, 197, 94, 0.8)',
            }}>
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-full font-semibold text-text-muted bg-soft-bg hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-full font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: '#4a6cf7',
                boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
