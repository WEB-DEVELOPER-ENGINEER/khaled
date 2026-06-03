import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        
        if (response.data.success) {
          setStatus('success');
          localStorage.setItem('token', response.data.token);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        const message = error.response?.data?.message || 'Verification failed';
        toast.error(message);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        {status === 'verifying' && (
          <>
            <div className="verification-icon">⏳</div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
            <div className="loading" style={{ margin: '0 auto' }}></div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verification-icon">✅</div>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified. Redirecting to home page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verification-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>The verification link is invalid or has expired. Please try signing up again.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/signup')}
            >
              Back to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
