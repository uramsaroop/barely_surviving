import React from 'react';
import { colors, borderRadius } from '../styles/theme';

const BottomNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', emoji: '🏡', label: 'Home' },
    { id: 'workouts', emoji: '💪', label: 'Workouts' },
    { id: 'nutrition', emoji: '🥗', label: 'Nutrition' },
    { id: 'progress', emoji: '📊', label: 'Stats' },
    { id: 'goals', emoji: '🎯', label: 'Goals' },
  ];

  return (
    <div style={styles.bottomNav}>
      <div style={styles.navContainer}>
        {navItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(currentPage === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => setCurrentPage(item.id)}
          >
            <div
              style={{
                ...styles.navEmoji,
                ...(currentPage === item.id ? styles.navEmojiActive : {}),
              }}
            >
              {item.emoji}
            </div>
            <div
              style={{
                ...styles.navLabel,
                ...(currentPage === item.id ? styles.navLabelActive : {}),
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderTop: `1px solid ${colors.sand}`,
    padding: '12px 20px 24px',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: '430px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: borderRadius.md,
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  navItemActive: {
    background: colors.sand,
  },
  navEmoji: {
    fontSize: '24px',
    opacity: 0.4,
    transition: 'all 0.3s ease',
  },
  navEmojiActive: {
    opacity: 1,
    transform: 'scale(1.1)',
  },
  navLabel: {
    fontSize: '11px',
    color: colors.sage,
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  navLabelActive: {
    color: colors.pine,
  },
};

export default BottomNav;
