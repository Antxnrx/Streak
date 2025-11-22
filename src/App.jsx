import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreakProviderCloud } from './context/StreakContextCloud';
import Login from './screens/Login';
import Home from './screens/Home';
import CreateStreak from './screens/CreateStreak';
import Achievements from './screens/Achievements';
import StreakDetails from './screens/StreakDetails';
import './styles/index.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedStreakId, setSelectedStreakId] = useState(null);

  const handleNavigate = (screen, streakId = null) => {
    setCurrentScreen(screen);
    if (streakId) {
      setSelectedStreakId(streakId);
    }
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 mx-auto mb-4"
            style={{
              borderColor: '#f0f0f0',
              borderTopColor: '#4a6cf7',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or email not verified, show login screen
  if (!user || !user.emailVerified) {
    return <Login onNavigate={handleNavigate} />;
  }

  // If authenticated, show main app
  return (
    <StreakProviderCloud>
      <div className="App">
        {currentScreen === 'home' && <Home onNavigate={handleNavigate} />}
        {currentScreen === 'create' && (
          <CreateStreak onNavigate={handleNavigate} />
        )}
        {currentScreen === 'achievements' && <Achievements onNavigate={handleNavigate} />}
        {currentScreen === 'streak' && selectedStreakId && (
          <StreakDetails streakId={selectedStreakId} onNavigate={handleNavigate} />
        )}
      </div>
    </StreakProviderCloud>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
