import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getTodayIST, getDateStringIST, normalizeDateString } from '../utils/dateUtils';

// ============================================
// STREAK CRUD OPERATIONS
// ============================================

/**
 * Create a new streak in Firestore
 * @param {string} userId - User ID
 * @param {Object} streakData - { name, notes, color, targetDays }
 * @returns {Promise<string>} - New streak ID
 */
export const createStreak = async (userId, streakData) => {
  try {
    const streaksRef = collection(db, 'users', userId, 'streaks');
    const docRef = await addDoc(streaksRef, {
      ...streakData,
      createdAt: serverTimestamp(),
      status: 'active',
      completedDays: [],
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating streak:', error);
    throw error;
  }
};

/**
 * Delete a streak and its associated badges
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 */
export const deleteStreak = async (userId, streakId) => {
  try {
    // Delete streak document
    await deleteDoc(doc(db, 'users', userId, 'streaks', streakId));

    // Delete all badges associated with this streak
    const badgesRef = collection(db, 'users', userId, 'badges');
    const q = query(badgesRef, where('streakId', '==', streakId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (badgeDoc) => {
      await deleteDoc(badgeDoc.ref);
    });
  } catch (error) {
    console.error('Error deleting streak:', error);
    throw error;
  }
};

/**
 * Update a streak document
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @param {Object} updates - Fields to update
 */
export const updateStreak = async (userId, streakId, updates) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', streakId);
    await updateDoc(streakRef, updates);
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

/**
 * Add today's date to completed days array
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @param {Date} date - Date to add
 */
export const addCompletedDay = async (userId, streakId, date) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', streakId);
    // Handle both Date objects and date strings
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    await updateDoc(streakRef, {
      completedDays: arrayUnion(dateStr),
    });
  } catch (error) {
    console.error('Error adding completed day:', error);
    throw error;
  }
};

/**
 * Get all streaks for a user (one-time fetch)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of streaks
 */
export const getStreaks = async (userId) => {
  try {
    const streaksRef = collection(db, 'users', userId, 'streaks');
    const querySnapshot = await getDocs(streaksRef);
    const streaks = [];
    querySnapshot.forEach((doc) => {
      streaks.push({ id: doc.id, ...doc.data() });
    });
    return streaks;
  } catch (error) {
    console.error('Error getting streaks:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time streak updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function to receive updated streaks
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToStreaks = (userId, callback) => {
  try {
    const streaksRef = collection(db, 'users', userId, 'streaks');
    const unsubscribe = onSnapshot(streaksRef, (querySnapshot) => {
      const streaks = [];
      querySnapshot.forEach((doc) => {
        streaks.push({ id: doc.id, ...doc.data() });
      });
      callback(streaks);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to streaks:', error);
    throw error;
  }
};

/**
 * Get a single streak by ID
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @returns {Promise<Object>} - Streak data
 */
export const getStreakById = async (userId, streakId) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', streakId);
    const streakSnapshot = await getDocs(collection(db, 'users', userId, 'streaks'));
    let streakData = null;
    streakSnapshot.forEach((doc) => {
      if (doc.id === streakId) {
        streakData = { id: doc.id, ...doc.data() };
      }
    });
    return streakData;
  } catch (error) {
    console.error('Error getting streak:', error);
    throw error;
  }
};

/**
 * Subscribe to a single streak's real-time updates
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToStreak = (userId, streakId, callback) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', streakId);
    const unsubscribe = onSnapshot(streakRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback({ id: docSnapshot.id, ...docSnapshot.data() });
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to streak:', error);
    throw error;
  }
};

// ============================================
// BADGE CRUD OPERATIONS
// ============================================

/**
 * Create a new badge (achievement)
 * @param {string} userId - User ID
 * @param {Object} badgeData - { streakId, streakName, daysCompleted }
 * @returns {Promise<string>} - New badge ID
 */
export const createBadge = async (userId, badgeData) => {
  try {
    // Check if badge already exists for this streak
    const existingBadge = await getBadgeByStreakId(userId, badgeData.streakId);
    if (existingBadge) {
      console.log('Badge already exists for this streak');
      return null;
    }

    const badgesRef = collection(db, 'users', userId, 'badges');
    const docRef = await addDoc(badgesRef, {
      ...badgeData,
      dateEarned: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating badge:', error);
    throw error;
  }
};

/**
 * Get all badges for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of badges
 */
export const getBadges = async (userId) => {
  try {
    const badgesRef = collection(db, 'users', userId, 'badges');
    const querySnapshot = await getDocs(badgesRef);
    const badges = [];
    querySnapshot.forEach((doc) => {
      badges.push({ id: doc.id, ...doc.data() });
    });
    return badges;
  } catch (error) {
    console.error('Error getting badges:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time badge updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToBadges = (userId, callback) => {
  try {
    const badgesRef = collection(db, 'users', userId, 'badges');
    const unsubscribe = onSnapshot(badgesRef, (querySnapshot) => {
      const badges = [];
      querySnapshot.forEach((doc) => {
        badges.push({ id: doc.id, ...doc.data() });
      });
      callback(badges);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to badges:', error);
    throw error;
  }
};

/**
 * Get a badge by streak ID
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @returns {Promise<Object|null>} - Badge data or null
 */
export const getBadgeByStreakId = async (userId, streakId) => {
  try {
    const badgesRef = collection(db, 'users', userId, 'badges');
    const q = query(badgesRef, where('streakId', '==', streakId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting badge by streak ID:', error);
    throw error;
  }
};

/**
 * Delete a badge
 * @param {string} userId - User ID
 * @param {string} badgeId - Badge ID
 */
export const deleteBadge = async (userId, badgeId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'badges', badgeId));
  } catch (error) {
    console.error('Error deleting badge:', error);
    throw error;
  }
};

// ============================================
// CHECK-IN LOGIC
// ============================================

/**
 * Check in for today and update streak status
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 * @param {Object} streak - Current streak data
 */
export const checkInToday = async (userId, streakId, streak) => {
  try {
    const todayStr = getTodayIST();

    // Add today to completed days
    await addCompletedDay(userId, streakId, todayStr);

    // Check if streak is now completed
    const updatedCompletedDays = [...(streak.completedDays || []), todayStr];
    if (updatedCompletedDays.length >= streak.targetDays) {
      // Mark as completed and create badge
      await updateStreak(userId, streakId, { status: 'completed' });
      await createBadge(userId, {
        streakId,
        streakName: streak.name,
        daysCompleted: updatedCompletedDays.length,
      });
    }
  } catch (error) {
    console.error('Error checking in:', error);
    throw error;
  }
};

/**
 * Check if a streak is broken based on last completed day
 * @param {Array} completedDays - Array of completed date strings
 * @returns {boolean} - True if streak is broken
 */
export const isStreakBroken = (completedDays) => {
  if (!completedDays || completedDays.length === 0) return false;

  const todayStr = getTodayIST();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const istYesterday = new Date(yesterday.getTime() + (5.5 * 60 * 60 * 1000) - (yesterday.getTimezoneOffset() * 60 * 1000));
  const yesterdayStr = istYesterday.toISOString().split('T')[0];

  const lastCompletedDay = completedDays[completedDays.length - 1];
  const lastCompletedDayStr = typeof lastCompletedDay === 'string' ? lastCompletedDay : lastCompletedDay.split('T')[0];

  // Streak is broken if today wasn't completed and yesterday wasn't the last completed day
  return lastCompletedDayStr !== todayStr && lastCompletedDayStr !== yesterdayStr;
};

/**
 * Mark a streak as broken
 * @param {string} userId - User ID
 * @param {string} streakId - Streak ID
 */
export const breakStreak = async (userId, streakId) => {
  try {
    await updateStreak(userId, streakId, { status: 'broken' });
  } catch (error) {
    console.error('Error breaking streak:', error);
    throw error;
  }
};
