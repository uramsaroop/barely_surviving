import React from 'react';
import { useApp } from '../context/AppContext';
import { colors, fonts, borderRadius } from '../styles/theme';

const Header = () => {
  const { streak } = useApp();
  
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const fullDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.dateBadge}>
          <div style={styles.dayName}>{dayName}</div>
          <div style={styles.fullDate}>{fullDate}</div>
        </div>
        <div style={styles.streakBadge}>
          <span style={styles.streakFlame}>🔥</span>
          <span style={styles.streakNumber}>{streak} Days</span>
        </div>
      </div>
      <h1 style={styles.welcome}>Keep it going!</h1>
      <p style={styles.motivational}>You're building healthy habits, one day at a time.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px 18px 24px',
    maxWidth: '430px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  dateBadge: {
    background: 'white',
    padding: '10px 18px',
    borderRadius: borderRadius.lg,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  dayName: {
    fontSize: '13px',
    color: colors.sage,
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  fullDate: {
    fontSize: '11px',
    color: colors.clay,
    marginTop: '2px',
  },
  streakBadge: {
    background: `linear-gradient(135deg, ${colors.pine}, ${colors.sage})`,
    padding: '10px 18px',
    borderRadius: borderRadius.lg,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(27, 77, 62, 0.2)',
  },
  streakFlame: {
    fontSize: '18px',
  },
  streakNumber: {
    fontWeight: 700,
    fontSize: '16px',
  },
  welcome: {
    fontFamily: fonts.display,
    fontSize: '32px',
    color: colors.pine,
    fontWeight: 600,
    marginBottom: '8px',
  },
  motivational: {
    color: colors.sage,
    fontSize: '15px',
    lineHeight: 1.5,
  },
};

export default Header;
