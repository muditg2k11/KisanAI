import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './util';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/login', {
        username: username.trim(),
        password: password.trim(),
      });
      if (response.data && response.data.user) {
        const { role, username: uname, email } = response.data.user;
        localStorage.setItem('role', role);
        localStorage.setItem('username', uname);
        localStorage.setItem('email', email);
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400: setError('Missing username or password.'); break;
          case 401: setError('Wrong email or password.'); break;
          case 500: setError('Server error. Please try again later.'); break;
          default: setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        setError('No response from server. Check your network.');
      } else {
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
        
        .cgpt-auth-page * { 
          box-sizing: border-box !important; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .cgpt-auth-page { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center;
          background-size: cover;
          position: relative;
          color: #2d333a;
        }

        .cgpt-auth-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          z-index: 1;
        }

        .cgpt-auth-box { 
          position: relative;
          z-index: 2;
          width: 100%; 
          max-width: 440px; 
          padding: 40px; 
          background: transparent;
        }

        .cgpt-logo {
          text-align: center;
          margin-bottom: 32px;
        }

        .cgpt-logo a {
          text-decoration: none;
          font-size: 2.6rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .cgpt-logo span {
          color: #f4a61e;
        }

        .cgpt-title { 
          text-align: center; 
          font-size: 32px; 
          font-weight: 600; 
          color: #ffffff; 
          margin: 0 0 32px; 
          line-height: 1.2;
        }

        .cgpt-input-wrapper { 
          position: relative; 
          margin-bottom: 16px; 
        }

        .cgpt-input-wrapper input {
          width: 100% !important;
          padding: 16px 24px !important;
          border: 1px solid #c2c8d0 !important;
          border-radius: 50px !important;
          font-size: 16px !important;
          background-color: #ffffff !important;
          background-image: none !important;
          outline: none !important;
          color: #2d333a !important;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
          height: 52px !important;
        }

        .cgpt-input-wrapper input:focus {
          border-color: #10a37f !important;
          box-shadow: 0 0 0 1px #10a37f !important;
        }

        .cgpt-input-wrapper input::placeholder { color: #8e8ea0 !important; }

        .cgpt-input-wrapper.password-wrapper input {
          padding-right: 85px !important;
        }

        .cgpt-toggle-pw { 
          position: absolute; 
          right: 12px; 
          top: 50%; 
          transform: translateY(-50%); 
          background: none; 
          border: none; 
          color: #8e8ea0; 
          cursor: pointer; 
          font-size: 11px; 
          font-weight: 700;
          text-transform: uppercase;
          padding: 8px 12px; 
          z-index: 2; 
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 20px;
        }

        .cgpt-toggle-pw:hover { 
          color: #2d333a; 
          background: rgba(0, 0, 0, 0.05);
        }

        .cgpt-btn {
          width: 100%; 
          padding: 16px; 
          border: none; 
          border-radius: 50px;
          font-size: 16px; 
          font-weight: 500; 
          color: #ffffff; 
          cursor: pointer;
          background: #10a37f;
          transition: background-color 0.2s; 
          margin-top: 24px;
          height: 52px;
        }

        .cgpt-btn:hover { background: #1a7f64; }
        .cgpt-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .cgpt-footer { 
          text-align: center; 
          margin-top: 24px; 
          color: rgba(255, 255, 255, 0.8); 
          font-size: 14px; 
        }

        .cgpt-footer a { 
          color: #10a37f; 
          font-weight: 600; 
          text-decoration: none; 
        }

        .cgpt-footer a:hover { text-decoration: underline; }

        .cgpt-error { 
          color: #ef4444; 
          font-size: 14px; 
          margin-bottom: 20px; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          background: #fef2f2;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }
        
        .cgpt-divider {
           display: flex;
           align-items: center;
           text-align: center;
           margin: 24px 0;
        }
        
        .cgpt-divider::before, .cgpt-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .cgpt-divider span {
            padding: 0 10px;
            color: #8e8ea0;
            font-size: 12px;
            text-transform: uppercase;
        }
      `}</style>
      <div className="cgpt-auth-page">
        <div className="cgpt-auth-box">

          <div className="cgpt-logo">
            <a href="/"><b>Agri</b><span>nova</span></a>
          </div>

          <h1 className="cgpt-title">Farmer Login</h1>

          {error && <div className="cgpt-error"><i className="fa fa-exclamation-circle"></i> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="cgpt-input-wrapper">
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="cgpt-input-wrapper password-wrapper">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="cgpt-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" className="cgpt-btn" disabled={loading}>
              {loading ? 'Continuing...' : 'Continue'}
            </button>
          </form>

          <div className="cgpt-footer">
            Don't have an account? <a href="/register">Sign up</a>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;
