import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import Calendar from '../components/Calendar';
import TextField from '../components/TextField';
import { useStreaks } from '../context/StreakContextCloud';
import { getTodayIST } from '../utils/dateUtils';

const StreakDetails = ({ streakId, onNavigate }) => {
  const { streaks, updateStreak, checkInStreak, validateStreakStatus } = useStreaks();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [streakName, setStreakName] = useState('');
  const [notes, setNotes] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Find the streak by ID
  const streak = streaks.find(s => s.id === streakId);

  useEffect(() => {
    // Validate all streak statuses on component mount
    validateStreakStatus();
  }, [validateStreakStatus]);

  useEffect(() => {
    if (!streak) return;

    // Initialize name and notes from streak data
    setStreakName(streak.name);
    setNotes(streak.notes || '');

    // Check if already checked in today using IST
    const todayIST = getTodayIST();

    const hasCheckedInToday = streak.completedDays.some(date => {
      const dateStr = typeof date === 'string' ? date : date.split('T')[0];
      return dateStr === todayIST;
    });

    setCheckedInToday(hasCheckedInToday);
  }, [streak]);

  if (!streak) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-6">Streak not found</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-full font-semibold text-white"
            style={{
              backgroundColor: '#4a6cf7',
              boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleMonthChange = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value.slice(0, 15); // Limit to 15 characters
    setStreakName(newName);
    updateStreak(streakId, { name: newName });
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value.slice(0, 100); // Limit to 100 characters
    setNotes(newNotes);
    updateStreak(streakId, { notes: newNotes });
  };

  const handleCheckIn = async () => {
    if (isCheckingIn) return; // Prevent double-click
    
    try {
      setIsCheckingIn(true);
      await checkInStreak(streakId);
      setCheckedInToday(true);

      // Check if streak is now completed
      if (streak.completedDays.length + 1 === streak.targetDays) {
        await updateStreak(streakId, { status: 'completed' });
      }
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const completedDays = streak.completedDays
    .map(dateStr => new Date(dateStr))
    .filter(date => date.getMonth() === currentMonth && date.getFullYear() === currentYear)
    .map(date => date.getDate());

  const today = new Date();

  const isStreakBrokenStatus = streak.status === 'broken';
  const isStreakCompleted = streak.status === 'completed';
  const canCheckIn =
    !checkedInToday &&
    !isStreakBrokenStatus &&
    !isStreakCompleted &&
    !isCheckingIn;

  // Use the color from streak (hex value)
  const streakColor = streak.color || '#4a6cf7';

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: '#ffffff',
        borderTop: isStreakBrokenStatus ? `3px solid rgba(239, 68, 68, 0.3)` : 'none',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button and Streak Title */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-soft-bg rounded-lg transition-colors flex-shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{
                backgroundColor: streakColor,
                boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.4)`,
              }}
            ></div>
            <input
              type="text"
              value={streakName}
              onChange={handleNameChange}
              maxLength="15"
              className="text-2xl font-bold bg-transparent outline-none border-0 transition-all flex-1"
              style={{
                color: '#000000',
              }}
            />
          </div>
        </div>

        {/* Calendar Section */}
        <div
          className="mb-8 p-6 rounded-3xl"
          style={{
            backgroundColor: '#f7f7f7',
            boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
          }}
        >
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            completedDays={completedDays}
            highlightToday={true}
            dotColor={streakColor}
          />
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-black mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            maxLength="100"
            placeholder="Add notes about this streak..."
            readOnly={true}
            className="w-full px-6 py-4 rounded-2xl border-0 outline-none transition-all resize-none"
            rows="3"
            style={{
              backgroundColor: '#f7f7f7',
              color: '#000000',
              fontSize: '16px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
              cursor: 'default',
            }}
          />
        </div>

        {/* Check-In Button */}
        <div className="mb-8">
          <PrimaryButton
            onClick={handleCheckIn}
            disabled={!canCheckIn || isCheckingIn}
          >
            {isStreakBrokenStatus
              ? 'This streak is broken'
              : checkedInToday
              ? '✓ Checked In Today'
              : isStreakCompleted
              ? 'Streak Completed'
              : isCheckingIn
              ? 'Checking In...'
              : 'Check In For Today'}
          </PrimaryButton>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              backgroundColor: '#f7f7f7',
              boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
            }}
          >
            <p
              className="text-3xl font-bold mb-2"
              style={{
                color: isStreakBrokenStatus
                  ? 'rgba(156, 163, 175, 0.6)'
                  : streakColor,
              }}
            >
              {streak.completedDays.length}
            </p>
            <p className="text-sm font-medium text-black">Current Streak</p>
            <p className="text-xs text-text-muted mt-1">Days completed</p>
          </div>

          <div
            className="p-6 rounded-2xl text-center"
            style={{
              backgroundColor: '#f7f7f7',
              boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
            }}
          >
            <p className="text-3xl font-bold text-primary mb-2">
              {streak.targetDays}
            </p>
            <p className="text-sm font-medium text-black">Goal</p>
            <p className="text-xs text-text-muted mt-1">Days to reach</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-black">Progress</p>
            <p className="text-xs text-text-muted">
              {Math.round((streak.completedDays.length / streak.targetDays) * 100)}%
            </p>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(streak.completedDays.length / streak.targetDays) * 100}%`,
                backgroundColor: isStreakBrokenStatus
                  ? 'rgba(255, 99, 99, 0.7)'
                  : streakColor,
              }}
            ></div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="w-full py-4 rounded-full font-semibold transition-all"
          style={{
            backgroundColor: '#f7f7f7',
            color: '#000',
            boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default StreakDetails;
