import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { levelService } from '../services/api';
import './Home.css';

const Home = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await levelService.getLevels();
      setLevels(response.data.levels);
    } catch (error) {
      toast.error('Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="loading"></div>
          <p>Loading levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="container">
          <div className="header-content">
            <h1>Sign2GPT Learning Platform</h1>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="container">
          <div className="welcome-section">
            <h2>Choose Your Learning Level</h2>
            <p>Select a level below to start learning sign language</p>
          </div>

          <div className="levels-grid">
            {levels.map((level) => (
              <div
                key={level.id}
                className="level-card"
                onClick={() => navigate(`/level/${level.id}`)}
              >
                <div className="level-icon">🎯</div>
                <h3>{level.name}</h3>
                <p>{level.wordCount} words</p>
                <div className="level-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
