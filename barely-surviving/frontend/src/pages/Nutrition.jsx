import React, { useState, useEffect } from 'react';
import { meals } from '../services/api';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const Nutrition = () => {
  const [mealList, setMealList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dailySummary, setDailySummary] = useState(null);
  const [formData, setFormData] = useState({
    type: 'breakfast',
    description: '',
    calories: '',
    protein: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
    loadDailySummary();
  }, []);

  const loadMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await meals.list({ start_date: today, end_date: today });
      setMealList(res.data);
    } catch (err) {
      console.error('Error loading meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDailySummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await meals.getDailySummary(today);
      setDailySummary(res.data);
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await meals.create(formData);
      setFormData({
        type: 'breakfast',
        description: '',
        calories: '',
        protein: '',
        notes: '',
      });
      setShowForm(false);
      loadMeals();
      loadDailySummary();
    } catch (err) {
      console.error('Error creating meal:', err);
      alert('Failed to log meal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meal?')) {
      try {
        await meals.delete(id);
        loadMeals();
        loadDailySummary();
      } catch (err) {
        console.error('Error deleting meal:', err);
      }
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🥗 Nutrition</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Log Meal'}
        </button>
      </div>

      {/* Daily Summary */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            {dailySummary?.total_calories || 0}
          </div>
          <div style={styles.summaryLabel}>Total Calories</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            {dailySummary?.total_protein || 0}g
          </div>
          <div style={styles.summaryLabel}>Total Protein</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Meal Type</label>
            <select
              style={styles.input}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., Grilled chicken salad"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Calories</label>
              <input
                style={styles.input}
                type="number"
                placeholder="450"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Protein (g)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="35"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              style={{ ...styles.input, minHeight: '60px' }}
              placeholder="Optional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Log Meal
          </button>
        </form>
      )}

      <div style={styles.list}>
        <h3 style={styles.listTitle}>Today's Meals</h3>
        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : mealList.length === 0 ? (
          <div style={styles.emptyState}>
            No meals logged today. Start by logging your first meal!
          </div>
        ) : (
          mealList.map((meal) => (
            <div key={meal.id} style={styles.listItem}>
              <div style={styles.listIcon}>🍽️</div>
              <div style={styles.listContent}>
                <div style={styles.listItemTitle}>{meal.description}</div>
                <div style={styles.listItemDetails}>
                  {meal.type} • {meal.calories} cal • {meal.protein}g protein
                  {meal.notes && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>{meal.notes}</div>}
                </div>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(meal.id)}
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
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
  },
  summaryCard: {
    background: `linear-gradient(135deg, ${colors.pine}, ${colors.sage})`,
    color: 'white',
    padding: '20px',
    borderRadius: borderRadius.lg,
    textAlign: 'center',
  },
  summaryValue: {
    fontFamily: fonts.display,
    fontSize: '32px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    opacity: 0.9,
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

export default Nutrition;
