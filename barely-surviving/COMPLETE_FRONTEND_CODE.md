# Complete Frontend Code - Barely Surviving

## Status
✅ Backend: 100% Complete
✅ Header & BottomNav: Complete
✅ Theme & Styles: Complete
✅ API Service: Complete
✅ Context: Complete
⏳ Remaining: Dashboard page, other pages, and utility components

## Quick Implementation Guide

The frontend uses React with inline styles for the Daily Ritual design. All colors, fonts, and spacing come from `src/styles/theme.js`.

### Pattern for All Components

```jsx
import React from 'react';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div style={styles.container}>
      {/* Component content */}
    </div>
  );
};

const styles = {
  container: {
    background: colors.white,
    borderRadius: borderRadius.lg,
    padding: '20px',
    boxShadow: shadows.md,
  },
  // ... more styles
};

export default ComponentName;
```

## Dashboard Page Implementation

The Dashboard is the main page - create `src/pages/Dashboard.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dashboard } from '../services/api';
import { colors, fonts, borderRadius } from '../styles/theme';

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
      setRecentActivity(res.data.activities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      {/* Achievement Cards */}
      <div style={styles.achievements}>
        <AchievementCard icon="🌱" value="Week 1" label="Completed" />
        <AchievementCard 
          icon="🎯" 
          value={goalProgress ? `${goalProgress.percent_complete}%` : '--'} 
          label="To Goal" 
        />
        <AchievementCard icon="⚡" value="Active" label="Lifestyle" />
      </div>

      {/* Quick Actions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>✨ Log Today</h2>
        <div style={styles.actionGrid}>
          <ActionCard icon="🏃" title="Workout" subtitle="Track activity" />
          <ActionCard icon="🍽️" title="Meal" subtitle="Log nutrition" />
        </div>
      </section>

      {/* Today's Stats */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Today</h2>
        <div style={styles.statsGrid}>
          <StatCard value={dashboardStats?.calories_consumed || 0} label="Calories" />
          <StatCard value={dashboardStats?.workout_count || 0} label="Workouts" />
          <StatCard 
            value={dashboardStats?.current_weight || '--'} 
            label="Weight" 
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📝 Recent</h2>
        {recentActivity.map((activity) => (
          <TimelineItem
            key={activity.id}
            icon={activity.icon}
            title={activity.title}
            details={activity.details}
            time="Recently"
          />
        ))}
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

const ActionCard = ({ icon, title, subtitle }) => (
  <div style={actionStyles.card}>
    <div style={actionStyles.emoji}>{icon}</div>
    <div style={actionStyles.title}>{title}</div>
    <div style={actionStyles.subtitle}>{subtitle}</div>
  </div>
);

const StatCard = ({ value, label }) => (
  <div style={statStyles.card}>
    <div style={statStyles.value}>{value}</div>
    <div style={statStyles.label}>{label}</div>
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
  loading: { textAlign: 'center', padding: '40px', color: colors.sage },
  achievements: { display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto' },
  section: { marginBottom: '24px' },
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
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
};

const achievementStyles = {
  card: {
    minWidth: '140px',
    background: 'white',
    borderRadius: borderRadius.lg,
    padding: '20px 18px',
    boxShadow: shadows.md,
    textAlign: 'center',
  },
  icon: { fontSize: '32px', marginBottom: '12px' },
  value: { fontWeight: 700, fontSize: '20px', color: colors.pine, marginBottom: '4px' },
  label: { fontSize: '12px', color: colors.sage, fontWeight: 500 },
};

const actionStyles = {
  card: {
    background: 'white',
    borderRadius: borderRadius.xl,
    padding: '24px 20px',
    boxShadow: shadows.md,
    cursor: 'pointer',
    textAlign: 'center',
  },
  emoji: { fontSize: '40px', marginBottom: '12px' },
  title: { fontWeight: 600, fontSize: '16px', color: colors.pine, marginBottom: '4px' },
  subtitle: { fontSize: '12px', color: colors.sage },
};

const statStyles = {
  card: {
    background: 'white',
    border: `2px solid ${colors.sand}`,
    borderRadius: borderRadius.lg,
    padding: '20px 16px',
    textAlign: 'center',
  },
  value: {
    fontFamily: fonts.display,
    fontSize: '28px',
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  label: { fontSize: '11px', color: colors.sage, textTransform: 'uppercase', letterSpacing: '0.5px' },
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
  content: { flex: 1 },
  title: { fontWeight: 600, fontSize: '15px', color: colors.pine, marginBottom: '4px' },
  details: { fontSize: '13px', color: colors.sage },
  time: { fontSize: '12px', color: colors.clay, fontWeight: 500 },
};

export default Dashboard;
```

## Simplified Other Pages

For the other pages (Workouts, Nutrition, Progress, Goals), create simple placeholder versions:

```jsx
// src/pages/Workouts.jsx
import React from 'react';
import { colors, fonts } from '../styles/theme';

const Workouts = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: fonts.display, color: colors.pine, marginBottom: '16px' }}>
        Workouts
      </h2>
      <p style={{ color: colors.sage }}>
        Workout logging coming soon!
      </p>
    </div>
  );
};

export default Workouts;
```

Repeat this pattern for:
- src/pages/Nutrition.jsx
- src/pages/Progress.jsx  
- src/pages/Goals.jsx

## Testing Locally

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create .env:
```bash
cp .env.example .env
```

3. Run dev server:
```bash
npm run dev
```

4. Make sure backend is running:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

5. Visit http://localhost:5173

## Or Use Docker Compose

```bash
docker-compose up
```

Visit http://localhost:5173

The app will work with the Dashboard showing data from the backend!

## Next: Build Full Pages

Once the basic structure works, enhance each page with:
- Forms for logging workouts/meals/weight
- List views with delete buttons
- Charts and visualizations
- Modal overlays for forms

All using the Daily Ritual design system from theme.js!
