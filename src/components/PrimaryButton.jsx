import React from 'react';

const PrimaryButton = ({ children, onClick, disabled = false, fullWidth = true }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-4 px-8 rounded-full font-semibold text-white transition-all duration-200 ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        backgroundColor: '#4a6cf7',
        boxShadow: '0px 4px 15px rgba(74, 108, 247, 0.14), 0px 8px 30px rgba(74, 108, 247, 0.10)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0px 6px 20px rgba(74, 108, 247, 0.16), 0px 12px 35px rgba(74, 108, 247, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0px 4px 15px rgba(74, 108, 247, 0.14), 0px 8px 30px rgba(74, 108, 247, 0.10)';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
        }
      }}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
