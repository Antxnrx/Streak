import React, { useMemo } from 'react';

const Calendar = ({ currentMonth, currentYear, onMonthChange, completedDays = [], highlightToday = true, dotColor = '#4A6CF7' }) => {
  // Generate days for the month
  const days = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0–6

    const dayList = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      dayList.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      dayList.push({
        date: new Date(currentYear, currentMonth, day),
        day,
      });
    }

    return dayList;
  }, [currentMonth, currentYear]);

  const isToday = (dayObj) => {
    if (!highlightToday || !dayObj) return false;
    const today = new Date();
    return (
      today.getDate() === dayObj.day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isCompleted = (dayObj) => {
    if (!dayObj) return false;
    return completedDays.includes(dayObj.day);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-soft-bg rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-soft-bg rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-sm font-medium text-text-muted py-2">
            {day}
          </div>
        ))}

        {/* Day cells */}
        {days.map((dayObj, idx) => (
          <div
            key={idx}
            className="aspect-square flex flex-col items-center justify-center relative"
          >
            {dayObj ? (
              <>
                <div
                  className={`flex items-center justify-center w-10 h-10 transition-all ${
                    isToday(dayObj)
                      ? 'rounded-lg font-semibold text-white'
                      : 'text-black font-medium'
                  }`}
                  style={
                    isToday(dayObj)
                      ? {
                          backgroundColor: '#4A6CF7',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          padding: '6px 8px',
                        }
                      : {}
                  }
                >
                  {dayObj.day}
                </div>
                {isCompleted(dayObj) && !isToday(dayObj) && (
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1"
                    style={{ backgroundColor: dotColor }}
                  ></div>
                )}
              </>
            ) : (
              <div className="text-text-light opacity-40"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
