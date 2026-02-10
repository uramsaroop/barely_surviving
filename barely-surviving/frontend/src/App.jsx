import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Goals from './pages/Goals';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'workouts':
        return <Workouts />;
      case 'nutrition':
        return <Nutrition />;
      case 'progress':
        return <Progress />;
      case 'goals':
        return <Goals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: '90px' }}>
        <Header />
        <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px 18px' }}>
          {renderPage()}
        </div>
        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </Router>
  );
}

export default App;
