import React from 'react';

const StreakCard = ({ id, name, day, color, onClick, onDelete, status = 'active' }) => {
  const isStreakBroken = status === 'broken';
  const isStreakCompleted = status === 'completed';

  // Use assigned color for all streaks (even broken ones)
  const dotColor = color;

  const handleDeleteClickInside = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete && onDelete(id);
  };

  const handleMainClick = (e) => {
    if (isStreakBroken) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <div className="relative group fadeInUp w-full">
      <div
        onClick={handleMainClick}
        role="button"
        tabIndex={isStreakBroken ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleMainClick(e);
          }
        }}
        className="w-full flex items-center justify-between p-6 cardSoft transition-all text-left"
        style={{
          backgroundColor: '#f7f7f7',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
          opacity: isStreakBroken ? 0.85 : 1,
          cursor: isStreakBroken ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isStreakBroken) {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0px 6px 20px rgba(0, 0, 0, 0.14), 0px 10px 35px rgba(0, 0, 0, 0.10)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isStreakBroken) {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)';
          }
        }}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Circular dot with assigned color */}
          <div
            className="w-3 h-3 rounded-full transition-colors flex-shrink-0"
            style={{
              backgroundColor: dotColor,
              boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.4)`,
            }}
          ></div>
          <div className="flex flex-col">
            <span
              className={`text-base ${isStreakBroken ? 'font-bold text-red-600' : 'font-medium text-black'}`}
            >
              {name}
            </span>
            {isStreakCompleted && (
              <span className="text-xs font-semibold mt-1" style={{ color: color }}>
                Completed
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="text-sm font-medium text-text-muted whitespace-nowrap"
          >
            Day {day}
          </span>
          <button
            onClick={handleDeleteClickInside}
            className="p-2 rounded-full transition-all flex items-center justify-center hover:opacity-70 active:scale-90 flex-shrink-0"
            style={{
              backgroundColor: 'transparent',
              color: '#ef4444',
            }}
            title="Delete streak"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
