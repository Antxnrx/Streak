import React from 'react';

const EmailVerificationDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg fadeInUp text-center">
        {/* Envelope Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 108, 247, 0.1)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 text-black">Check Your Inbox</h2>
        
        {/* Description */}
        <p className="text-text-muted mb-2 text-sm">
          We've sent a verification link to your email address.
        </p>
        <p className="text-text-muted mb-6 text-sm">
          Click the link to verify your email and unlock access to StreakMe.
        </p>

        {/* Steps */}
        <div className="bg-soft-bg rounded-xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">1</div>
            <p className="text-sm text-black">Check your email inbox</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">2</div>
            <p className="text-sm text-black">Click the verification link</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">3</div>
            <p className="text-sm text-black">Return and log in</p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-text-muted mb-6">
          Didn't receive the email? Check your spam folder.
        </p>

        {/* Okay Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-full font-semibold text-white transition-all active:scale-95"
          style={{
            backgroundColor: '#4a6cf7',
            boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
          }}
        >
          Okay, I'll Verify Now
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationDialog;
