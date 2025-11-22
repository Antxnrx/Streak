import React from 'react';

const BadgeCard = ({ number, label = 'Days', streakName = '', status = 'Completed' }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 rounded-3xl transition-all"
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
        minHeight: '200px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0px 6px 20px rgba(0, 0, 0, 0.14), 0px 10px 35px rgba(0, 0, 0, 0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
    >
      <div className="text-5xl font-bold text-primary mb-2">{number}</div>
      <div className="text-base font-medium text-black mb-4">{label}</div>
      <div className="text-sm font-semibold text-black text-center mb-2 px-2">{streakName}</div>
      <div className="text-xs text-text-muted text-center">{status}</div>
    </div>
  );
};

export default BadgeCard;
