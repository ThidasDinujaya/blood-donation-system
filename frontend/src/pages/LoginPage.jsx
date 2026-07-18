import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res.userId) sessionStorage.setItem('userId', res.userId);
      if (res.role)   sessionStorage.setItem('role',   res.role);
      const role = res.role || '';
      if (role === 'ROLE_ADMIN') navigate('/inventory');
      else if (role === 'ROLE_HOSPITAL') navigate('/emergency-requests');
      else navigate('/campaigns');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  const imageUrl = "/login-hero.jpg";

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 58px)' }}>

      {/* Left panel — hero image */}
      <div style={{
        flex: 1,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            BloodLink
          </div>

          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>

          <form className="auth-form" onSubmit={onSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <button
              id="login-submit"
              className="btn btn-primary btn-full btn-lg"
              type="submit"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
