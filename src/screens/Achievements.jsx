import React, { useState } from 'react';
import BadgeCard from '../components/BadgeCard';
import { useStreaks } from '../context/StreakContextCloud';
import { deleteBadge } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const Achievements = ({ onNavigate }) => {
  const { user } = useAuth();
  const { badges } = useStreaks();
  const [deletingBadgeId, setDeletingBadgeId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState(null);

  const handleDeleteClick = (badgeId) => {
    setBadgeToDelete(badgeId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingBadgeId(badgeToDelete);
      await deleteBadge(user.uid, badgeToDelete);
      setShowDeleteDialog(false);
      setBadgeToDelete(null);
    } catch (error) {
      console.error('Error deleting badge:', error);
      alert('Failed to delete achievement');
    } finally {
      setDeletingBadgeId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setBadgeToDelete(null);
  };

  // Transform badges for display
  const achievements = badges.map((badge) => ({
    id: badge.id,
    number: badge.daysCompleted || '—',
    label: 'Days',
    streakName: badge.streakName,
    status: 'Completed',
  }));

  // Pad with empty badges only if less than 4
  const displayAchievements = achievements.length < 4 
    ? [
        ...achievements,
        ...Array(4 - achievements.length).fill(null).map(() => ({
          number: '—',
          label: 'Days',
          streakName: 'Empty Slot',
          status: 'Not Started',
        }))
      ]
    : achievements;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-8 p-2 hover:bg-soft-bg rounded-lg transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {displayAchievements.map((achievement, idx) => (
            <div key={idx} className="relative">
              <BadgeCard 
                {...achievement}
                deletingBadgeId={deletingBadgeId}
              />
              {achievement.id && (
                <button
                  onClick={() => handleDeleteClick(achievement.id)}
                  disabled={deletingBadgeId !== null}
                  className="absolute top-2 right-2 p-1 rounded-full hover:opacity-70 transition-all disabled:opacity-50"
                  title="Delete achievement"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Button */}
        <button
          onClick={() => onNavigate('home')}
          className="w-full mt-12 py-4 rounded-full font-semibold text-white transition-all hover:shadow-lg active:scale-95"
          style={{
            backgroundColor: '#4a6cf7',
            boxShadow: '0px 4px 20px rgba(74, 108, 247, 0.12)',
          }}
        >
          Back to Home
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg fadeInUp">
            <h2 className="text-xl font-bold mb-2">Delete Achievement?</h2>
            <p className="text-text-muted mb-6">This action cannot be undone. The achievement will be permanently deleted.</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deletingBadgeId !== null}
                className="flex-1 py-3 px-4 rounded-full font-semibold text-text-muted bg-soft-bg hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingBadgeId !== null}
                className="flex-1 py-3 px-4 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {deletingBadgeId !== null ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
