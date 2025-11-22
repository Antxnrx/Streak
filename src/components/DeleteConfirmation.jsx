import React, { useState } from 'react';

const DeleteConfirmation = ({ isOpen, streakName, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
      setIsClosing(false);
    }, 200);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200"
      style={{
        backgroundColor: isClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.28)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onClick={handleCancel}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 max-w-sm w-full mx-4 transition-all duration-200 roundedModal"
        style={{
          boxShadow: '0px 6px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transform: isClosing ? 'translateY(6px)' : 'translateY(-4px)',
          opacity: isClosing ? 0.95 : 1,
          animation: !isClosing && isOpen ? 'fadeInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        }}
      >
        {/* Title */}
        <h2 className="text-xl font-semibold text-black mb-2">Delete Streak?</h2>

        {/* Subtext */}
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>

        {/* Streak Name */}
        <div
          className="px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          style={{
            backgroundColor: '#f7f7f7',
            color: '#000',
          }}
        >
          {streakName}
        </div>

        {/* Button Container */}
        <div className="flex gap-4">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-full font-semibold transition-all hover:shadow-md active:scale-95"
            style={{
              backgroundColor: '#f7f7f7',
              color: '#000',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            Cancel
          </button>

          {/* Delete Button - Blue style */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-full font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{
              backgroundColor: '#4a6cf7',
              boxShadow: '0px 4px 15px rgba(74, 108, 247, 0.14), 0px 8px 30px rgba(74, 108, 247, 0.10)',
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmation;
