import React, { createContext, useState, useCallback, useEffect } from 'react';

export const StreakContext = createContext();

// Premium soft pastel color palette - never repeating
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

const STORAGE_KEY = 'streakme_streaks';
const USED_COLORS_KEY = 'streakme_used_colors';

export const StreakProvider = ({ children }) => {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedColors, setUsedColors] = useState([]);

  // Generate a unique pastel color using HSL
  const generateUniqueColor = useCallback((used) => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * (55 - 45) + 45); // 45-55%
    const lightness = Math.floor(Math.random() * (80 - 70) + 70);   // 70-80%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  // Get next available color
  const getNextAvailableColor = useCallback(() => {
    const allUsedColors = streaks.map(s => s.color);
    
    // First check palette
    for (const paletteColor of PREMIUM_COLOR_PALETTE) {
      if (!allUsedColors.includes(paletteColor)) {
        return paletteColor;
      }
    }
    
    // If all palette colors used, generate new unique color
    return generateUniqueColor(allUsedColors);
  }, [streaks, generateUniqueColor]);

  // Load streaks from localStorage on mount
  useEffect(() => {
    const loadStreaksFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedColors = localStorage.getItem(USED_COLORS_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          setStreaks(parsed);
          
          // Load used colors if available
          if (storedColors) {
            const colors = JSON.parse(storedColors);
            setUsedColors(colors);
          }
          // Initialize with demo streaks using premium colors
          const demoStreaks = [
            {
              id: '1',
              name: 'Gym',
              targetDays: 90,
              startDate: new Date(2024, 8, 20).toISOString(),
              completedDays: Array.from({ length: 15 }, (_, i) => 
                new Date(2024, 9, i + 1).toISOString()
              ),
              status: 'active',
              color: PREMIUM_COLOR_PALETTE[0], // #4A6CF7
              notes: 'Workout 30 mins daily',
            },
            {
              id: '2',
              name: 'Study',
              targetDays: 30,
              startDate: new Date(2024, 9, 1).toISOString(),
              completedDays: Array.from({ length: 5 }, (_, i) => 
                new Date(2024, 9, i + 1).toISOString()
              ),
              status: 'active',
              color: PREMIUM_COLOR_PALETTE[1], // #7D5FFF
              notes: '',
            },
            {
              id: '3',
              name: 'Meditation',
              targetDays: 100,
              startDate: new Date(2024, 7, 15).toISOString(),
              completedDays: Array.from({ length: 32 }, (_, i) => 
                new Date(2024, 7, i + 15).toISOString()
              ),
              status: 'active',
              color: PREMIUM_COLOR_PALETTE[2], // #FF7D7D
              notes: '10 min morning meditation',
            },
            {
              id: '4',
              name: 'Read 10 Pages',
              targetDays: 30,
              startDate: new Date(2024, 9, 10).toISOString(),
              completedDays: Array.from({ length: 8 }, (_, i) => 
                new Date(2024, 9, i + 10).toISOString()
              ),
              status: 'active',
              color: PREMIUM_COLOR_PALETTE[3], // #FFA861
              notes: '',
            },
          ];
          
          setStreaks(demoStreaks);
          setUsedColors([...demoStreaks.map(s => s.color)]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStreaks));
          localStorage.setItem(USED_COLORS_KEY, JSON.stringify(demoStreaks.map(s => s.color)));
        }
      } catch (error) {
        console.error('Error loading streaks from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreaksFromStorage();
  }, []);


  // Add new streak with unique color assignment
  const addStreak = useCallback((streakName, targetDays, notes = '') => {
    const nextColor = getNextAvailableColor();
    
    const newStreak = {
      id: `streak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: streakName,
      targetDays: parseInt(targetDays),
      startDate: new Date().toISOString(),
      completedDays: [new Date().toISOString()], // Auto-check today
      status: 'active',
      color: nextColor, // Assign unique color
      notes: notes || '',
    };

    const updatedStreaks = [...streaks, newStreak];
    setStreaks(updatedStreaks);
    
    // Track used colors
    const newUsedColors = [...new Set([...usedColors, nextColor])];
    setUsedColors(newUsedColors);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
    localStorage.setItem(USED_COLORS_KEY, JSON.stringify(newUsedColors));
    return newStreak;
  }, [streaks, usedColors, getNextAvailableColor]);

  // Update streak
  const updateStreak = useCallback((streakId, updates) => {
    const updatedStreaks = streaks.map(streak =>
      streak.id === streakId ? { ...streak, ...updates } : streak
    );
    setStreaks(updatedStreaks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
  }, [streaks]);

  // Delete streak and recycle its color
  const deleteStreak = useCallback((streakId) => {
    const streakToDelete = streaks.find(s => s.id === streakId);
    const updatedStreaks = streaks.filter(streak => streak.id !== streakId);
    
    setStreaks(updatedStreaks);
    
    // Only recycle color if it's from the premium palette and no other streak uses it
    if (streakToDelete && PREMIUM_COLOR_PALETTE.includes(streakToDelete.color)) {
      const remainingStreakColors = updatedStreaks.map(s => s.color);
      if (!remainingStreakColors.includes(streakToDelete.color)) {
        // Color is now available again - update used colors
        const newUsedColors = usedColors.filter(c => c !== streakToDelete.color);
        setUsedColors(newUsedColors);
        localStorage.setItem(USED_COLORS_KEY, JSON.stringify(newUsedColors));
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreaks));
  }, [streaks, usedColors]);

  // Check if a streak should be broken
  const isStreakBroken = useCallback((streak) => {
    // Don't break completed streaks
    if (streak.status === 'completed') return false;

    // Don't break streaks with no check-ins
    if (streak.completedDays.length === 0) return false;

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayIso = yesterday.toISOString();

    // Get the streak start date
    const startDate = new Date(streak.startDate);
    startDate.setHours(0, 0, 0, 0);

    // If streak started today, don't break it
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate.toISOString() === today.toISOString()) {
      return false;
    }

    // If streak only has one day and it's today, don't break it
    if (streak.completedDays.length === 1) {
      const completedDate = new Date(streak.completedDays[0]);
      completedDate.setHours(0, 0, 0, 0);
      if (completedDate.toISOString() === today.toISOString()) {
        return false;
      }
    }

    // Check if yesterday was completed
    const yesterdayCompleted = streak.completedDays.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString() === yesterdayIso;
    });

    // Streak is broken if yesterday was NOT completed
    return !yesterdayCompleted;
  }, []);

  // Update streak status based on break logic
  const validateStreakStatus = useCallback(() => {
    const updated = streaks.map(streak => {
      const shouldBeBroken = isStreakBroken(streak);
      if (shouldBeBroken && streak.status === 'active') {
        return { ...streak, status: 'broken' };
      }
      return streak;
    });

    // Only update if something changed
    if (JSON.stringify(updated) !== JSON.stringify(streaks)) {
      setStreaks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [streaks, isStreakBroken]);

  // Run validation on mount and when navigating
  useEffect(() => {
    validateStreakStatus();
  }, []);

  // Check in to a streak (add today's date)
  const checkInStreak = useCallback((streakId) => {
    const streak = streaks.find(s => s.id === streakId);
    if (!streak) return;

    // Don't allow check-in if streak is broken
    if (streak.status === 'broken') return;

    // Don't allow check-in if streak is completed
    if (streak.status === 'completed') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    // Check if already checked in today
    const alreadyCheckedIn = streak.completedDays.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString() === todayIso;
    });

    if (!alreadyCheckedIn) {
      const newCompletedDays = [...streak.completedDays, todayIso];
      const newStatus =
        newCompletedDays.length === streak.targetDays ? 'completed' : 'active';

      updateStreak(streakId, {
        completedDays: newCompletedDays,
        status: newStatus,
      });
    }
  }, [streaks, updateStreak]);

  // Get current streak count
  const getStreakCount = useCallback((streakId) => {
    const streak = streaks.find(s => s.id === streakId);
    return streak ? streak.completedDays.length : 0;
  }, [streaks]);

  // Get completed days for a specific month
  const getCompletedDaysForMonth = useCallback((streakId, month, year) => {
    const streak = streaks.find(s => s.id === streakId);
    if (!streak) return [];

    return streak.completedDays
      .map(dateStr => new Date(dateStr))
      .filter(date => date.getMonth() === month && date.getFullYear() === year)
      .map(date => date.getDate());
  }, [streaks]);

  const value = {
    streaks,
    loading,
    addStreak,
    updateStreak,
    deleteStreak,
    checkInStreak,
    getStreakCount,
    getCompletedDaysForMonth,
    validateStreakStatus,
    isStreakBroken,
  };

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
};

// Custom hook to use streak context
export const useStreaks = () => {
  const context = React.useContext(StreakContext);
  if (!context) {
    throw new Error('useStreaks must be used within a StreakProvider');
  }
  return context;
};
