import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { useStreaks } from '../context/StreakContextCloud';

const CreateStreak = ({ onNavigate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { addStreak } = useStreaks();

  const handleMonthChange = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleStartStreak = async () => {
    const targetDays = parseInt(days);
    
    if (!name.trim()) {
      alert('Please enter a streak name');
      return;
    }
    
    if (!days.trim() || targetDays < 3) {
      alert('Target days must be at least 3 days');
      return;
    }

    try {
      setLoading(true);
      // Add streak to Firestore
      await addStreak(name.trim(), days, notes.trim());
      
      // Navigate back to home
      onNavigate('home');
    } catch (error) {
      console.error('Error creating streak:', error);
      alert('Failed to create streak. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = name.trim() && days.trim() && parseInt(days) >= 3;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 p-2 hover:bg-soft-bg rounded-lg transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-3xl font-bold mb-8">Create New Streak</h1>

        {/* Calendar Preview */}
        <div className="mb-8 p-6 cardSoft fadeInUp" style={{ backgroundColor: '#f7f7f7' }}>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            completedDays={[]}
            highlightToday={true}
          />
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8 fadeInUp">
          <TextField
            placeholder="Name your streak"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 15))}
            label={`Streak Name (${name.length}/15)`}
            disabled={loading}
          />
          <TextField
            placeholder="How many days?"
            value={days}
            onChange={(e) => {
              const val = e.target.value;
              // Only allow empty or numbers >= 3
              if (val === '') {
                setDays(val);
              } else {
                const num = parseInt(val);
                if (!isNaN(num) && num >= 3) {
                  setDays(val);
                }
              }
            }}
            type="number"
            min="3"
            label="Target Days (Minimum 3)"
            disabled={loading}
          />
          <div>
            <label className="block text-sm font-medium text-black mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 100))}
              maxLength="100"
              placeholder="Add notes about this streak..."
              className="w-full px-6 py-4 rounded-2xl border-0 outline-none transition-all resize-none"
              rows="3"
              disabled={loading}
              style={{
                backgroundColor: '#f7f7f7',
                color: '#000000',
                fontSize: '16px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0px 6px 20px rgba(74, 108, 247, 0.14), 0px 10px 35px rgba(74, 108, 247, 0.10)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)';
                e.target.style.transform = 'translateY(0px)';
              }}
            />
            <div className="text-xs text-text-muted mt-2 text-right">{notes.length}/100</div>
          </div>
        </div>

        {/* Start Button */}
        <PrimaryButton onClick={handleStartStreak} disabled={!isValid || loading}>
          {loading ? 'Creating...' : 'Start Streak'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CreateStreak;
