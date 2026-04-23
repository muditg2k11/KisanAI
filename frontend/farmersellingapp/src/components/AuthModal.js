import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../util';

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .auth-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .auth-modal {
    font-family: 'Inter', sans-serif;
    background: #fff;
    width: 480px;
    max-width: 94vw;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
    position: relative;
    overflow: hidden;
    animation: slideUp 0.28s ease;
  }

  .auth-modal-top {
    background: linear-gradient(135deg, #1e3d16 0%, #2d5a27 50%, #4a7c59 100%);
    padding: 24px 30px 20px;
    text-align: center;
    position: relative;
  }
  .auth-modal-logo {
    font-size: 1.6rem;
    margin-bottom: 6px;
  }
  .auth-modal-brand {
    color: white;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .auth-modal-tagline {
    color: rgba(255,255,255,0.75);
    font-size: 0.82rem;
    margin-top: 2px;
  }

  .auth-close-btn {
    position: absolute;
    top: 14px; right: 16px;
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    width: 32px; height: 32px;
    border-radius: 50%;
    padding: 0; box-sizing: border-box;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .auth-close-btn:hover { background: rgba(255,255,255,0.3); }

  .auth-tabs {
    display: flex;
    background: #f7f8f7;
    border-bottom: 1px solid #e8e8e8;
  }
  .auth-tab {
    flex: 1;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #aaa;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
  }
  .auth-tab.active {
    color: #2d5a27;
    border-bottom-color: #2d5a27;
    background: white;
  }

  .auth-form-body { padding: 28px 36px 32px; }

  .auth-input-group {
    margin-bottom: 18px;
    position: relative;
  }
  .auth-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: #555;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .auth-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.97rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    color: #222;
    background: #fafafa;
  }
  .auth-input:focus {
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74,124,89,0.12);
    background: white;
  }
  .auth-input-pw-wrap {
    position: relative;
  }
  .auth-input-pw-wrap .auth-input {
    padding-right: 48px;
  }
  .auth-pw-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    font-size: 15px;
    padding: 0;
    line-height: 1;
    transition: color 0.2s;
  }
  .auth-pw-toggle:hover { color: #4a7c59; }

  .auth-submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #2d5a27, #f4a61e);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.05rem;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 8px 20px rgba(74, 124, 89, 0.4);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .auth-submit-btn:hover:not(:disabled) { opacity: 0.95; transform: translateY(-3px); box-shadow: 0 12px 25px rgba(244, 166, 30, 0.35); }
  .auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; transform: none; }

  .auth-error {
    margin-top: 14px;
    padding: 10px 14px;
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    color: #dc2626;
    font-size: 0.85rem;
    text-align: center;
  }
  .auth-success {
    margin-top: 14px;
    padding: 10px 14px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
    color: #16a34a;
    font-size: 0.85rem;
    text-align: center;
  }

  .auth-footer-text {
    text-align: center;
    margin-top: 20px;
    font-size: 0.9rem;
    color: #000;
    font-weight: 600;
  }
  .auth-footer-text span {
    color: #2d5a27;
    font-weight: 600;
    cursor: pointer;
  }
  .auth-footer-text span:hover { text-decoration: underline; }
`;

function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    if (!isLogin && !email.trim()) {
      setError('Email is required for registration.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await apiClient.post('/login', {
          username: username.trim(),
          password: password.trim(),
        });
        if (response.data && response.data.user) {
          const { role, username: uname, email: uemail } = response.data.user;
          localStorage.setItem('username', uname);
          localStorage.setItem('email', uemail);
          localStorage.setItem('role', role);

          try {
            // Fetch persistent cart from DB
            const cartRes = await apiClient.get(`/api/cart?username=${uname}`);
            if (cartRes.data && cartRes.data.cart && cartRes.data.cart.length > 0) {
              localStorage.setItem('cart', JSON.stringify(cartRes.data.cart));
              // Dispatch event to update navbar/components immediately
              window.dispatchEvent(new Event('storage'));
            }
          } catch (e) {
            console.error('Failed to sync cart:', e);
          }

          onClose();
          if (onSuccess) {
            onSuccess();
          } else {
            const cart = localStorage.getItem('cart');
            navigate(cart ? '/consumer/cart' : '/consumer/products');
            window.location.reload();
          }
        }
      } else {
        const response = await apiClient.post('/register', {
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          role: 'consumer',
        });
        if (response.status === 201) {
          setSuccessMsg('Account created! Please sign in.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || 'Authentication failed.');
      } else {
        setError('Cannot connect to server. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = successMsg && successMsg.includes('success') || successMsg.includes('created');

  return (
    <>
      <style>{authStyles}</style>
      <div className="auth-overlay" onClick={(e) => e.target.className === 'auth-overlay' && onClose()}>
        <div className="auth-modal">

          {/* ─ Top Brand Bar ─ */}
          <div className="auth-modal-top">
            <div className="auth-modal-logo"><i className="fas fa-leaf" style={{ color: '#fff' }}></i></div>
            <div className="auth-modal-brand">Agrinova</div>
            <div className="auth-modal-tagline">Fresh from farm to your door</div>
            <button className="auth-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
          </div>

          {/* ─ Form ─ */}
          <div className="auth-form-body">
            <form onSubmit={handleSubmit}>

              <div className="auth-input-group">
                <label className="auth-label">Username</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {!isLogin && (
                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-pw-wrap">
                  <input
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Processing…</> : isLogin ? <><i className="fas fa-sign-in-alt"></i> Sign In</> : <><i className="fas fa-user-plus"></i> Create Account</>}
              </button>
            </form>

            {error && <div className="auth-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
            {successMsg && <div className="auth-success"><i className="fas fa-check-circle"></i> {successMsg}</div>}

            <div className="auth-footer-text">
              {isLogin
                ? <>Don't have an account? <span onClick={() => switchTab(false)}>Register here</span></>
                : <>Already have an account? <span onClick={() => switchTab(true)}>Sign in</span></>
              }
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AuthModal;
