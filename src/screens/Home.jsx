import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import StreakCard from '../components/StreakCard';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { useStreaks } from '../context/StreakContextCloud';
import { useAuth } from '../context/AuthContext';

const Home = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, streakId: null, streakName: null });
  const { streaks, validateStreakStatus, deleteStreak, loading } = useStreaks();

  useEffect(() => {
    // Validate streak statuses whenever we navigate back to home
    validateStreakStatus();
  }, [validateStreakStatus]);

  const handleMonthChange = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleStreakClick = (streakId) => {
    onNavigate('streak', streakId);
  };

  const handleDeleteClick = (streakId) => {
    const streak = streaks.find(s => s.id === streakId);
    setDeleteConfirmation({
      isOpen: true,
      streakId: streakId,
      streakName: streak?.name || 'Streak',
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.streakId) {
      deleteStreak(deleteConfirmation.streakId);
      setDeleteConfirmation({ isOpen: false, streakId: null, streakName: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, streakId: null, streakName: null });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close confirmation on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && deleteConfirmation.isOpen) {
        handleCancelDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirmation.isOpen]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">StreakMe</h1>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium rounded-full transition-all"
            style={{
              backgroundColor: '#f7f7f7',
              color: '#666',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Logout
          </button>
        </div>

        {/* Calendar Section */}
        <div className="mb-8 p-6 cardSoft fadeInUp" style={{ backgroundColor: '#f7f7f7' }}>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            highlightToday={true}
            completedDays={[]}
          />
        </div>

        {/* Today's Streaks Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Today's Streaks</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-text-muted">
                Loading streaks...
              </div>
            ) : streaks.length > 0 ? (
              streaks.map((streak) => (
                <StreakCard
                  key={streak.id}
                  id={streak.id}
                  name={streak.name}
                  day={streak.completedDays?.length || 0}
                  color={streak.color}
                  status={streak.status}
                  onClick={() => handleStreakClick(streak.id)}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                No streaks yet. Create your first one!
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="w-full mt-8 py-4 roundedButton font-semibold text-white transition-all cardSoft"
            style={{
              backgroundColor: '#4a6cf7',
            }}
          >
            + New Streak
          </button>
          <button
            onClick={() => onNavigate('achievements')}
            className="w-full mt-4 py-4 roundedButton font-semibold text-primary transition-all cardSoft"
            style={{
              backgroundColor: '#f7f7f7',
            }}
          >
            Achievements
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        streakName={deleteConfirmation.streakName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Home;
