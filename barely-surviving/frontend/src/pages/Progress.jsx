import React, { useState, useEffect } from 'react';
import { weight } from '../services/api';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const Progress = () => {
  const [weightList, setWeightList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [trend, setTrend] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeights();
    loadTrend();
  }, []);

  const loadWeights = async () => {
    try {
      const res = await weight.list({ limit: 30 });
      setWeightList(res.data);
    } catch (err) {
      console.error('Error loading weights:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrend = async () => {
    try {
      const res = await weight.getTrend(7);
      setTrend(res.data);
    } catch (err) {
      console.error('Error loading trend:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await weight.create(formData);
      setFormData({
        weight: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      loadWeights();
      loadTrend();
    } catch (err) {
      console.error('Error creating weight:', err);
      alert('Failed to log weight');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this weight entry?')) {
      try {
        await weight.delete(id);
        loadWeights();
        loadTrend();
      } catch (err) {
        console.error('Error deleting weight:', err);
      }
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Progress</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Log Weight'}
        </button>
      </div>

      {/* Trend Summary */}
      {trend && trend.data_points > 0 && (
        <div style={styles.trendCard}>
          <div style={styles.trendTitle}>7-Day Trend</div>
          <div style={styles.trendGrid}>
            <div style={styles.trendItem}>
              <div style={styles.trendValue}>{trend.start_weight?.toFixed(1)}</div>
              <div style={styles.trendLabel}>Start</div>
            </div>
            <div style={styles.trendItem}>
              <div style={styles.trendValue}>{trend.current_weight?.toFixed(1)}</div>
              <div style={styles.trendLabel}>Current</div>
            </div>
            <div style={styles.trendItem}>
              <div style={{
                ...styles.trendValue,
                color: trend.change < 0 ? colors.moss : colors.clay,
              }}>
                {trend.change > 0 ? '+' : ''}{trend.change?.toFixed(1)}
              </div>
              <div style={styles.trendLabel}>Change</div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (lbs)</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                placeholder="167.5"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                style={styles.input}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Log Weight
          </button>
        </form>
      )}

      {/* Simple Chart Visualization */}
      {trend && trend.trend && trend.trend.length > 0 && (
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Weight Chart</div>
          <div style={styles.chart}>
            {trend.trend.map((point, idx) => {
              const maxWeight = Math.max(...trend.trend.map(p => p.weight));
              const minWeight = Math.min(...trend.trend.map(p => p.weight));
              const range = maxWeight - minWeight || 1;
              const heightPercent = ((point.weight - minWeight) / range) * 80 + 10;
              
              return (
                <div key={idx} style={styles.chartBar}>
                  <div
                    style={{
                      ...styles.chartBarFill,
                      height: `${heightPercent}%`,
                    }}
                  />
                  <div style={styles.chartLabel}>
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.list}>
        <h3 style={styles.listTitle}>Weight History</h3>
        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : weightList.length === 0 ? (
          <div style={styles.emptyState}>
            No weight entries yet. Log your first weight above!
          </div>
        ) : (
          weightList.map((entry) => (
            <div key={entry.id} style={styles.listItem}>
              <div style={styles.listIcon}>⚖️</div>
              <div style={styles.listContent}>
                <div style={styles.listItemTitle}>{entry.weight} lbs</div>
                <div style={styles.listItemDetails}>
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(entry.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
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
  trendCard: {
    background: 'white',
    padding: '24px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    marginBottom: '24px',
  },
  trendTitle: {
    fontFamily: fonts.display,
    fontSize: '20px',
    color: colors.pine,
    marginBottom: '16px',
    fontWeight: 600,
  },
  trendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  trendItem: {
    textAlign: 'center',
  },
  trendValue: {
    fontFamily: fonts.display,
    fontSize: '28px',
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  trendLabel: {
    fontSize: '12px',
    color: colors.sage,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  chartCard: {
    background: 'white',
    padding: '24px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    marginBottom: '24px',
  },
  chartTitle: {
    fontFamily: fonts.display,
    fontSize: '18px',
    color: colors.pine,
    marginBottom: '20px',
    fontWeight: 600,
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    height: '150px',
    paddingBottom: '20px',
  },
  chartBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBarFill: {
    width: '100%',
    background: `linear-gradient(to top, ${colors.pine}, ${colors.moss})`,
    borderRadius: `${borderRadius.sm} ${borderRadius.sm} 0 0`,
    transition: 'height 0.5s ease',
  },
  chartLabel: {
    fontSize: '10px',
    color: colors.clay,
    marginTop: '8px',
    textAlign: 'center',
  },
  form: {
    background: 'white',
    padding: '24px',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    marginBottom: '24px',
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
    marginTop: '8px',
  },
  list: {
    marginTop: '24px',
  },
  listTitle: {
    fontFamily: fonts.display,
    fontSize: '20px',
    color: colors.pine,
    marginBottom: '16px',
  },
  listItem: {
    background: 'white',
    padding: '16px',
    borderRadius: borderRadius.lg,
    marginBottom: '12px',
    boxShadow: shadows.sm,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  listIcon: {
    fontSize: '24px',
    background: colors.sand,
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flex: 1,
  },
  listItemTitle: {
    fontWeight: 600,
    color: colors.pine,
    marginBottom: '4px',
  },
  listItemDetails: {
    fontSize: '13px',
    color: colors.sage,
  },
  deleteButton: {
    background: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    borderRadius: borderRadius.sm,
    fontSize: '12px',
    fontWeight: 600,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: colors.sage,
  },
};

export default Progress;
