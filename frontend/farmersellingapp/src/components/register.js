import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../util';
import Header from './header';
import Footer from './footer';

const formStyles = {
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '460px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '32px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5eb',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
    background: '#fafbfc',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4a7c59 0%, #2d5016 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '8px',
    letterSpacing: '0.5px',
  },
  error: {
    color: '#e74c3c',
    background: '#fdf0ef',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginTop: '16px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#666',
  },
  linkA: {
    color: '#4a7c59',
    fontWeight: '600',
    textDecoration: 'none',
  },
  icon: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '48px',
  },
};

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/register', {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        role: 'consumer'
      });
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || 'Registration failed. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="pxl-page" className="pxl-page header-pos-df">
        <Header />
        <div style={formStyles.wrapper}>
          <div style={formStyles.card}>
            <div style={formStyles.icon}>🌾</div>
            <h2 style={formStyles.title}>Create Account</h2>
            <p style={formStyles.subtitle}>Join Agrinova — Fresh from Farm to Table</p>
            <form onSubmit={handleSubmit}>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Username</label>
                <input
                  style={formStyles.input}
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Email</label>
                <input
                  style={formStyles.input}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Password</label>
                <input
                  style={formStyles.input}
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                style={{
                  ...formStyles.button,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
            {error && <div style={formStyles.error}>{error}</div>}
            <p style={formStyles.link}>
              Already have an account?{' '}
              <a href="/login" style={formStyles.linkA}>Sign In</a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Register;
