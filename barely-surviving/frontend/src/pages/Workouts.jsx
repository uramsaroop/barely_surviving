import React, { useState, useEffect } from 'react';
import { workouts } from '../services/api';
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const Workouts = () => {
  const [workoutList, setWorkoutList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'cardio',
    name: '',
    duration: '',
    calories_burned: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const res = await workouts.list({ limit: 50 });
      setWorkoutList(res.data);
    } catch (err) {
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await workouts.create(formData);
      setFormData({
        type: 'cardio',
        name: '',
        duration: '',
        calories_burned: '',
        notes: '',
      });
      setShowForm(false);
      loadWorkouts();
    } catch (err) {
      console.error('Error creating workout:', err);
      alert('Failed to log workout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      try {
        await workouts.delete(id);
        loadWorkouts();
      } catch (err) {
        console.error('Error deleting workout:', err);
      }
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>💪 Workouts</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Log Workout'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              style={styles.input}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="flexibility">Flexibility/Yoga</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., Morning Run"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (min)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Calories</label>
              <input
                style={styles.input}
                type="number"
                placeholder="250"
                value={formData.calories_burned}
                onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px' }}
              placeholder="How did it go?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Log Workout
          </button>
        </form>
      )}

      <div style={styles.list}>
        <h3 style={styles.listTitle}>History</h3>
        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : workoutList.length === 0 ? (
          <div style={styles.emptyState}>
            No workouts logged yet. Start by logging your first workout!
          </div>
        ) : (
          workoutList.map((workout) => (
            <div key={workout.id} style={styles.listItem}>
              <div style={styles.listIcon}>🏃</div>
              <div style={styles.listContent}>
                <div style={styles.listItemTitle}>{workout.name}</div>
                <div style={styles.listItemDetails}>
                  {workout.type} • {workout.duration} min • {workout.calories_burned} cal
                  {workout.notes && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>{workout.notes}</div>}
                </div>
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(workout.id)}
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

export default Workouts;
