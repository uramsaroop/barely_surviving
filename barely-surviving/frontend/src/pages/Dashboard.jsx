import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dashboard } from '../services/api';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const Dashboard = () => {
  const { dashboardStats, streak, goalProgress, refreshDashboard } = useApp();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      const res = await dashboard.getRecentActivity(5);
      setRecentActivity(res.data.activities || []);
    } catch (err) {
      console.error('Error loading activity:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: colors.sage }}>
        Loading...
      </div>
    );
  }

  const percentComplete = goalProgress ? goalProgress.percent_complete : 0;

  return (
    <div>
      {/* Achievement Cards */}
      <div style={styles.achievements}>
        <AchievementCard icon="🌱" value="Week 1" label="Completed" />
        <AchievementCard icon="🎯" value={`${percentComplete}%`} label="To Goal" />
        <AchievementCard icon="⚡" value="Active" label="Lifestyle" />
      </div>

      {/* Quick Actions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>✨</span>
          <span>Log Today</span>
        </h2>
        <div style={styles.actionGrid}>
          <ActionCard icon="🏃" title="Workout" subtitle="Track activity" />
          <ActionCard icon="🍽️" title="Meal" subtitle="Log nutrition" />
        </div>
      </section>

      {/* Today's Stats */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>📊</span>
          <span>Today</span>
        </h2>
        <div style={styles.statsGrid}>
          <StatCard 
            value={dashboardStats?.calories_consumed || 0} 
            label="Calories" 
            trend="↓ 150"
          />
          <StatCard 
            value={dashboardStats?.workout_count || 0} 
            label="Workouts" 
            trend="🔥"
          />
          <StatCard 
            value={dashboardStats?.current_weight || '--'} 
            label="Weight" 
            trend="↓ 2.3"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>📝</span>
          <span>Recent</span>
        </h2>
        {recentActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.sage }}>
            No activity yet. Start logging to see your progress!
          </div>
        ) : (
          recentActivity.map((activity) => (
            <TimelineItem
              key={activity.id}
              icon={activity.icon}
              title={activity.title}
              details={activity.details}
              time="Recently"
            />
          ))
        )}
      </section>
    </div>
  );
};

// Sub-components
const AchievementCard = ({ icon, value, label }) => (
  <div style={achievementStyles.card}>
    <div style={achievementStyles.icon}>{icon}</div>
    <div style={achievementStyles.value}>{value}</div>
    <div style={achievementStyles.label}>{label}</div>
  </div>
);

const ActionCard = ({ icon, title, subtitle, onClick }) => (
  <div style={actionStyles.card} onClick={onClick}>
    <div style={actionStyles.emoji}>{icon}</div>
    <div style={actionStyles.title}>{title}</div>
    <div style={actionStyles.subtitle}>{subtitle}</div>
  </div>
);

const StatCard = ({ value, label, trend }) => (
  <div style={statStyles.card}>
    <div style={statStyles.value}>{value}</div>
    <div style={statStyles.label}>{label}</div>
    {trend && <div style={statStyles.trend}>{trend}</div>}
  </div>
);

const TimelineItem = ({ icon, title, details, time }) => (
  <div style={timelineStyles.item}>
    <div style={timelineStyles.icon}>{icon}</div>
    <div style={timelineStyles.content}>
      <div style={timelineStyles.title}>{title}</div>
      <div style={timelineStyles.details}>{details}</div>
    </div>
    <div style={timelineStyles.time}>{time}</div>
  </div>
);

// Styles
const styles = {
  achievements: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: '22px',
    color: colors.pine,
    fontWeight: 600,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
};

const achievementStyles = {
  card: {
    minWidth: '140px',
    background: 'white',
    borderRadius: borderRadius.lg,
    padding: '20px 18px',
    boxShadow: shadows.md,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  value: {
    fontWeight: 700,
    fontSize: '20px',
    color: colors.pine,
    marginBottom: '4px',
  },
  label: {
    fontSize: '12px',
    color: colors.sage,
    fontWeight: 500,
  },
};

const actionStyles = {
  card: {
    background: 'white',
    borderRadius: borderRadius.xl,
    padding: '24px 20px',
    boxShadow: shadows.md,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  emoji: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  title: {
    fontWeight: 600,
    fontSize: '16px',
    color: colors.pine,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: colors.sage,
  },
};

const statStyles = {
  card: {
    background: 'white',
    border: `2px solid ${colors.sand}`,
    borderRadius: borderRadius.lg,
    padding: '20px 16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  value: {
    fontFamily: fonts.display,
    fontSize: '28px',
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  label: {
    fontSize: '11px',
    color: colors.sage,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trend: {
    fontSize: '12px',
    marginTop: '6px',
    color: colors.moss,
    fontWeight: 500,
  },
};

const timelineStyles = {
  item: {
    background: 'white',
    borderRadius: borderRadius.lg,
    padding: '20px',
    marginBottom: '12px',
    boxShadow: shadows.md,
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  icon: {
    width: '48px',
    height: '48px',
    background: colors.sand,
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: '15px',
    color: colors.pine,
    marginBottom: '4px',
  },
  details: {
    fontSize: '13px',
    color: colors.sage,
  },
  time: {
    fontSize: '12px',
    color: colors.clay,
    fontWeight: 500,
  },
};

export default Dashboard;
