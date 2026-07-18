import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const EMPTY_FORM = {
  firstName: '', lastName: '', hospitalName: '', email: '', password: '',
  bloodGroup: '', phoneNumber: '', city: '',
  availableToDonate: true, role: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = choose type, 2 = details
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isHospital = form.role === 'ROLE_HOSPITAL';
  const isDonor = form.role === 'ROLE_USER';

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function chooseType(role) {
    setError('');
    setForm(prev => ({
      ...EMPTY_FORM,
      role,
      availableToDonate: role === 'ROLE_USER',
    }));
    setStep(2);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: form.role,
        phoneNumber: form.phoneNumber,
        city: form.city,
      };

      if (isHospital) {
        payload.hospitalName = form.hospitalName;
        payload.firstName = form.firstName || form.hospitalName;
        payload.lastName = form.lastName || 'Hospital';
        payload.bloodGroup = null;
        payload.availableToDonate = false;
      } else {
        payload.firstName = form.firstName;
        payload.lastName = form.lastName;
        payload.bloodGroup = form.bloodGroup;
        payload.availableToDonate = !!form.availableToDonate;
        payload.hospitalName = null;
      }

      await registerUser(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  const imageUrl = '/register-hero.jpg';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 58px)' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(1.2px) brightness(0.45)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', maxWidth: 440, padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1.25, marginBottom: 16,
            textShadow: '0 2px 12px rgba(0,0,0,0.85)',
          }}>
            Be the reason<br />someone lives.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, textShadow: '0 1px 8px rgba(0,0,0,0.85)' }}>
            Register as a donor or a hospital and connect with people who need you most.
          </p>
        </div>
      </div>

      <div className="auth-right" style={{
        flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '40px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            BloodLink
          </div>

          {step === 1 ? (
            <>
              <h2>Create your account</h2>
              <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8, marginBottom: 28 }}>
                First, tell us how you want to register.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  type="button"
                  id="reg-type-donor"
                  className="btn btn-outline btn-full btn-lg"
                  onClick={() => chooseType('ROLE_USER')}
                  style={{ textAlign: 'center', padding: '18px 20px', height: 'auto' }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>I am a Donor</div>
                </button>

                <button
                  type="button"
                  id="reg-type-hospital"
                  className="btn btn-outline btn-full btn-lg"
                  onClick={() => chooseType('ROLE_HOSPITAL')}
                  style={{ textAlign: 'center', padding: '18px 20px', height: 'auto' }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>I am a Hospital</div>
                </button>
              </div>

              <div className="auth-switch" style={{ marginTop: 28 }}>
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); }}
                style={{
                  background: 'none', border: 'none', padding: 0, marginBottom: 12,
                  color: 'var(--text-2)', fontSize: 13, cursor: 'pointer',
                }}
              >
                ← Change account type
              </button>

              <h2>{isHospital ? 'Hospital registration' : 'Donor registration'}</h2>
              <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6, marginBottom: 20 }}>
                {isHospital
                  ? 'Enter your hospital details to create an account.'
                  : 'Enter your details so we can match you with donation opportunities.'}
              </p>

              <form className="auth-form" onSubmit={onSubmit}>
                {error && <div className="alert alert-error">{error}</div>}

                {isHospital ? (
                  <div className="form-group">
                    <label htmlFor="reg-hospitalName">Hospital name</label>
                    <input
                      id="reg-hospitalName"
                      className="input"
                      name="hospitalName"
                      placeholder="Colombo General Hospital"
                      value={form.hospitalName}
                      onChange={onChange}
                      required
                    />
                  </div>
                ) : (
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
                )}

                {isHospital && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="reg-firstName">Contact first name</label>
                      <input id="reg-firstName" className="input" name="firstName"
                        placeholder="Contact person" value={form.firstName} onChange={onChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-lastName">Contact last name</label>
                      <input id="reg-lastName" className="input" name="lastName"
                        placeholder="Name" value={form.lastName} onChange={onChange} required />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="reg-email">Email address</label>
                  <input id="reg-email" className="input" type="email" name="email"
                    placeholder="you@example.com" value={form.email} onChange={onChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">
                    Password{' '}
                    <span style={{ color: 'var(--text-3)', textTransform: 'none', fontWeight: 400 }}>(min. 8 characters)</span>
                  </label>
                  <input id="reg-password" className="input" type="password" name="password"
                    placeholder="••••••••" value={form.password} onChange={onChange} required minLength={8} />
                </div>

                {isDonor && (
                  <div className="form-group">
                    <label htmlFor="reg-bloodGroup">Blood group</label>
                    <select id="reg-bloodGroup" className="input" name="bloodGroup"
                      value={form.bloodGroup} onChange={onChange} required>
                      <option value="">Select…</option>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone number</label>
                    <input id="reg-phone" className="input" name="phoneNumber"
                      placeholder="+94 77 000 0000" value={form.phoneNumber} onChange={onChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-city">City</label>
                    <input id="reg-city" className="input" name="city"
                      placeholder="Colombo" value={form.city} onChange={onChange} required />
                  </div>
                </div>

                {isDonor && (
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 9, fontSize: 13,
                    color: 'var(--text-2)', cursor: 'pointer', marginTop: 4,
                  }}>
                    <input type="checkbox" name="availableToDonate"
                      checked={!!form.availableToDonate} onChange={onChange} />
                    I am currently available to donate blood
                  </label>
                )}

                <button
                  id="reg-submit"
                  className="btn btn-primary btn-full btn-lg"
                  type="submit"
                  disabled={loading}
                  style={{ marginTop: 8 }}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <div className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}