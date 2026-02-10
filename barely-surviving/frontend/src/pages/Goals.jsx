import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { goals } from '../services/api';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const Goals = () => {
  const { currentGoals, goalProgress, refreshDashboard } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_weight: '',
    target_weight: '',
    target_date: '',
    daily_calorie_goal: '',
    weekly_workouts: '',
    active_days_per_week: '',
  });

  useEffect(() => {
    if (currentGoals) {
      setFormData({
        start_weight: currentGoals.start_weight || '',
        target_weight: currentGoals.target_weight || '',
        target_date: currentGoals.target_date || '',
        daily_calorie_goal: currentGoals.daily_calorie_goal || '',
        weekly_workouts: currentGoals.weekly_workouts || '',
        active_days_per_week: currentGoals.active_days_per_week || '',
      });
    }
  }, [currentGoals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await goals.createOrUpdate(formData);
      setShowForm(false);
      refreshDashboard();
      alert('Goals saved successfully!');
    } catch (err) {
      console.error('Error saving goals:', err);
      alert('Failed to save goals');
    }
  };

  const percentComplete = goalProgress ? goalProgress.percent_complete : 0;
  const lostSoFar = goalProgress ? goalProgress.lost_so_far : 0;
  const remaining = goalProgress ? Math.abs(goalProgress.remaining) : 0;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 Goals</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : currentGoals ? 'Edit Goals' : 'Set Goals'}
        </button>
      </div>

      {/* Progress Display */}
      {goalProgress && (
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <div style={styles.progressTitle}>Weight Loss Journey</div>
            <div style={styles.progressPercent}>{percentComplete.toFixed(0)}%</div>
          </div>
          
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressBarFill,
                width: `${Math.min(percentComplete, 100)}%`,
              }}
            />
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{goalProgress.start_weight?.toFixed(1)}</div>
              <div style={styles.statLabel}>Start</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{goalProgress.current_weight?.toFixed(1)}</div>
              <div style={styles.statLabel}>Current</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{goalProgress.target_weight?.toFixed(1)}</div>
              <div style={styles.statLabel}>Goal</div>
            </div>
          </div>

          <div style={styles.achievementGrid}>
            <div style={styles.achievementItem}>
              <div style={styles.achievementIcon}>🎉</div>
              <div style={styles.achievementValue}>{lostSoFar.toFixed(1)} lbs</div>
              <div style={styles.achievementLabel}>Lost So Far</div>
            </div>
            <div style={styles.achievementItem}>
              <div style={styles.achievementIcon}>🎯</div>
              <div style={styles.achievementValue}>{remaining.toFixed(1)} lbs</div>
              <div style={styles.achievementLabel}>To Goal</div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formSection}>
            <h3 style={styles.formSectionTitle}>Weight Goals</h3>
            <div style={styles.twoCol}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Starting Weight (lbs)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.1"
                  placeholder="200.0"
                  value={formData.start_weight}
                  onChange={(e) => setFormData({ ...formData, start_weight: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Target Weight (lbs)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.1"
                  placeholder="170.0"
                  value={formData.target_weight}
                  onChange={(e) => setFormData({ ...formData, target_weight: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.formSectionTitle}>Daily & Weekly Targets</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Target Date</label>
              <input
                style={styles.input}
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Daily Calorie Goal</label>
              <input
                style={styles.input}
                type="number"
                placeholder="2000"
                value={formData.daily_calorie_goal}
                onChange={(e) => setFormData({ ...formData, daily_calorie_goal: e.target.value })}
              />
            </div>
            <div style={styles.twoCol}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Workouts per Week</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="4"
                  value={formData.weekly_workouts}
                  onChange={(e) => setFormData({ ...formData, weekly_workouts: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Active Days per Week</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="5"
                  value={formData.active_days_per_week}
                  onChange={(e) => setFormData({ ...formData, active_days_per_week: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Save Goals
          </button>
        </form>
      )}

      {!currentGoals && !showForm && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎯</div>
          <h3 style={styles.emptyTitle}>Set Your Goals</h3>
          <p style={styles.emptyText}>
            Define your weight loss target and daily habits to start tracking your progress!
          </p>
          <button 
            style={styles.emptyButton}
            onClick={() => setShowForm(true)}
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: '28px',
    color: colors.pine,
    fontWeight: 600,
  },
  addButton: {
    background: colors.pine,
    color: 'white',
    padding: '10px 20px',
    borderRadius: borderRadius.md,
    fontWeight: 600,
    fontSize: '14px',
  },
  progressCard: {
    background: 'white',
    padding: '28px 24px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    marginBottom: '24px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  progressTitle: {
    fontFamily: fonts.display,
    fontSize: '22px',
    color: colors.pine,
    fontWeight: 600,
  },
  progressPercent: {
    fontFamily: fonts.display,
    fontSize: '36px',
    color: colors.moss,
    fontWeight: 600,
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: colors.sand,
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  progressBarFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.pine}, ${colors.moss})`,
    borderRadius: '6px',
    transition: 'width 0.5s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: '24px',
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: colors.sage,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  achievementGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    paddingTop: '24px',
    borderTop: `2px solid ${colors.sand}`,
  },
  achievementItem: {
    textAlign: 'center',
    background: colors.sand,
    padding: '20px',
    borderRadius: borderRadius.lg,
  },
  achievementIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  achievementValue: {
    fontFamily: fonts.display,
    fontSize: '24px',
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  achievementLabel: {
    fontSize: '12px',
    color: colors.sage,
    fontWeight: 500,
  },
  form: {
    background: 'white',
    padding: '24px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    marginBottom: '24px',
  },
  formSection: {
    marginBottom: '24px',
  },
  formSectionTitle: {
    fontFamily: fonts.display,
    fontSize: '18px',
    color: colors.pine,
    marginBottom: '16px',
    fontWeight: 600,
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: colors.pine,
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: `2px solid ${colors.sand}`,
    borderRadius: borderRadius.sm,
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  submitButton: {
    width: '100%',
    background: colors.pine,
    color: 'white',
    padding: '14px',
    borderRadius: borderRadius.md,
    fontWeight: 600,
    fontSize: '16px',
  },
  emptyState: {
    background: 'white',
    padding: '60px 40px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: '24px',
    color: colors.pine,
    fontWeight: 600,
    marginBottom: '12px',
  },
  emptyText: {
    color: colors.sage,
    fontSize: '15px',
    marginBottom: '24px',
    lineHeight: 1.6,
  },
  emptyButton: {
    background: colors.pine,
    color: 'white',
    padding: '14px 32px',
    borderRadius: borderRadius.md,
    fontWeight: 600,
    fontSize: '16px',
  },
};

export default Goals;
