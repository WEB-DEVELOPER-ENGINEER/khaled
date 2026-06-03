import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with:', { email, apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else if (error.response?.status === 401) {
        const message = error.response?.data?.message || 'Invalid credentials';
        toast.error(message, { duration: 5000 });
        
        // Show specific guidance for email verification
        if (message.toLowerCase().includes('verify')) {
          setTimeout(() => {
            toast('Check your email inbox for the verification link', { 
              icon: '📧',
              duration: 6000 
            });
          }, 1500);
        }
      } else {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign2GPT</h1>
          <p>Welcome back! Sign in to continue learning.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="loading"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
