import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    bloodGroup: '', phoneNumber: '', city: '',
    availableToDonate: true, lastDonationDate: '', role: 'DONOR',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.lastDonationDate) delete payload.lastDonationDate;
      await registerUser(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  const imageUrl = "/register-hero.jpg";

  return (
    <div className="auth-wrap">
      {/* Left panel container — very slight 1.2px blur but darkened to brightness(0.45) for clean text contrast */}
      <div 
        className="auth-left" 
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: 'blur(1.2px) brightness(0.45)',
          WebkitFilter: 'blur(1.2px) brightness(0.45)',
        }}
      />
      
      {/* Absolute overlay container positioned exactly on top of the left photo panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: 'calc(100vh - 58px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        {/* Text rendered directly with sharp text-shadow for readability */}
        <div style={{
          width: '90%',
          maxWidth: '460px',
          textAlign: 'center',
          padding: '0 24px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '34px',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '20px',
            color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 4px 24px rgba(0,0,0,0.4)',
          }}>
            Be the reason<br />someone lives.
          </h2>
          <p style={{
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 1.7,
            color: '#ffffff',
            textShadow: '0 1px 8px rgba(0,0,0,0.85), 0 2px 16px rgba(0,0,0,0.4)',
          }}>
            Register as a donor and connect with hospitals, campaigns, and people who need you most.
          </p>
        </div>
      </div>

      {/* Right panel — scrollable form card containing viewport container */}
      <div className="auth-right" style={{ height: '100%', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-card" style={{ maxWidth: 460, padding: '24px 0' }}>
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            BloodLink
          </div>

          <h2>Create your account</h2>
          <div style={{ height: '16px' }} />

          <form className="auth-form" onSubmit={onSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reg-firstName">First name</label>
                <input id="reg-firstName" className="input" name="firstName"
                  placeholder="John" value={form.firstName} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-lastName">Last name</label>
                <input id="reg-lastName" className="input" name="lastName"
                  placeholder="Doe" value={form.lastName} onChange={onChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email address</label>
              <input id="reg-email" className="input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" className="input" type="password" name="password"
                placeholder="••••••••" value={form.password} onChange={onChange} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reg-bloodGroup">Blood group</label>
                <select id="reg-bloodGroup" className="input" name="bloodGroup"
                  value={form.bloodGroup} onChange={onChange} required>
                  <option value="">Select…</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reg-phone">Phone number</label>
                <input id="reg-phone" className="input" name="phoneNumber"
                  placeholder="+94 77 000 0000" value={form.phoneNumber} onChange={onChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-city">City</label>
              <input id="reg-city" className="input" name="city"
                placeholder="Colombo" value={form.city} onChange={onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="reg-lastDonation">
                Last donation date{' '}
                <span style={{ color: 'var(--text-3)', textTransform: 'none', fontWeight: 400 }}>(optional)</span>
              </label>
              <input id="reg-lastDonation" className="input" type="date"
                name="lastDonationDate" value={form.lastDonationDate} onChange={onChange} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
              <input type="checkbox" id="reg-available" name="availableToDonate"
                checked={form.availableToDonate} onChange={onChange} />
              I am currently available to donate blood
            </label>

            <button
              id="reg-submit"
              className="btn btn-primary btn-full btn-lg"
              type="submit"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
