import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboard, goals } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [streak, setStreak] = useState(0);
  const [currentGoals, setCurrentGoals] = useState(null);
  const [goalProgress, setGoalProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, streakRes, goalsRes, progressRes] = await Promise.allSettled([
        dashboard.getStats(),
        dashboard.getStreak(),
        goals.get(),
        goals.getProgress().catch(() => null), // Progress might fail if no goals set
      ]);

      if (statsRes.status === 'fulfilled') {
        setDashboardStats(statsRes.value.data);
      }

      if (streakRes.status === 'fulfilled') {
        setStreak(streakRes.value.data.streak || 0);
      }

      if (goalsRes.status === 'fulfilled') {
        setCurrentGoals(goalsRes.value.data);
      }

      if (progressRes.status === 'fulfilled' && progressRes.value) {
        setGoalProgress(progressRes.value.data);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const value = {
    dashboardStats,
    streak,
    currentGoals,
    goalProgress,
    loading,
    error,
    refreshDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
