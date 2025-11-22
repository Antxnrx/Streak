import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToStreaks,
  subscribeToStreak,
  subscribeToBadges,
  createStreak as firestoreCreateStreak,
  deleteStreak as firestoreDeleteStreak,
  updateStreak as firestoreUpdateStreak,
  checkInToday,
  isStreakBroken,
  breakStreak as firestoreBreakStreak,
} from '../services/firestoreService';

const StreakContextCloud = createContext();

const PREMIUM_COLOR_PALETTE = [
  '#4A6CF7',  // soft blue
  '#7D5FFF',  // soft purple
  '#FF7D7D',  // soft salmon red
  '#FFA861',  // soft orange
  '#41C3A9',  // soft teal
  '#89C2FF',  // soft sky blue
  '#FF9ECF',  // soft pink
  '#6EDAB8',  // pastel mint
  '#C89BFF',  // soft violet
  '#FFCC66',  // soft mellow yellow
];

export const StreakProviderCloud = ({ children }) => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time streak updates
  useEffect(() => {
    if (!user) {
      setStreaks([]);
      setBadges([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Subscribe to streaks
      const unsubscribeStreaks = subscribeToStreaks(user.uid, (updatedStreaks) => {
        // Validate streak statuses
        const validatedStreaks = updatedStreaks.map((streak) => {
          if (streak.status === 'active' && isStreakBroken(streak.completedDays)) {
            return { ...streak, status: 'broken' };
          }
          return streak;
        });
        setStreaks(validatedStreaks);
        setLoading(false);
      });

      // Subscribe to badges
      const unsubscribeBadges = subscribeToBadges(user.uid, (updatedBadges) => {
        setBadges(updatedBadges);
      });

      return () => {
        unsubscribeStreaks();
        unsubscribeBadges();
      };
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  }, [user]);

  // Get next available color
  const getNextAvailableColor = () => {
    const usedColors = streaks.map((s) => s.color);
    for (const color of PREMIUM_COLOR_PALETTE) {
      if (!usedColors.includes(color)) {
        return color;
      }
    }
    // Fallback: return random color if all palette colors used
    return PREMIUM_COLOR_PALETTE[Math.floor(Math.random() * PREMIUM_COLOR_PALETTE.length)];
  };

  // Add a new streak
  const addStreak = async (name, targetDays, notes = '') => {
    if (!user) throw new Error('User not authenticated');

    try {
      const color = getNextAvailableColor();
      const streakId = await firestoreCreateStreak(user.uid, {
        name,
        targetDays: parseInt(targetDays),
        notes,
        color,
      });
      return streakId;
    } catch (err) {
      setError('Failed to create streak');
      throw err;
    }
  };

  // Delete a streak
  const deleteStreak = async (streakId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await firestoreDeleteStreak(user.uid, streakId);
    } catch (err) {
      setError('Failed to delete streak');
      throw err;
    }
  };

  // Update a streak
  const updateStreak = async (streakId, updates) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await firestoreUpdateStreak(user.uid, streakId, updates);
    } catch (err) {
      setError('Failed to update streak');
      throw err;
    }
  };

  // Check in for today
  const checkInStreak = async (streakId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const streak = streaks.find((s) => s.id === streakId);
      if (!streak) throw new Error('Streak not found');

      await checkInToday(user.uid, streakId, streak);
    } catch (err) {
      setError('Failed to check in');
      throw err;
    }
  };

  // Break a streak
  const breakStreak = async (streakId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await firestoreBreakStreak(user.uid, streakId);
    } catch (err) {
      setError('Failed to break streak');
      throw err;
    }
  };

  // Validate streak statuses (check for broken streaks)
  const validateStreakStatus = async () => {
    if (!user) return;

    try {
      streaks.forEach((streak) => {
        if (streak.status === 'active' && isStreakBroken(streak.completedDays)) {
          firestoreBreakStreak(user.uid, streak.id);
        }
      });
    } catch (err) {
      console.error('Error validating streak status:', err);
    }
  };

  const value = {
    streaks,
    badges,
    loading,
    error,
    addStreak,
    deleteStreak,
    updateStreak,
    checkInStreak,
    breakStreak,
    validateStreakStatus,
  };

  return (
    <StreakContextCloud.Provider value={value}>{children}</StreakContextCloud.Provider>
  );
};

export const useStreaks = () => {
  const context = useContext(StreakContextCloud);
  if (!context) {
    throw new Error('useStreaks must be used within StreakProviderCloud');
  }
  return context;
};
