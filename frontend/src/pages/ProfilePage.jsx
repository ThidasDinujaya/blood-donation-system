import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getUserById(id)
      .then(u => setForm({ ...u }))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  const isHospital = form?.role === 'ROLE_HOSPITAL';
  const isDonor = form?.role === 'ROLE_USER' || form?.role === 'ROLE_DONOR';
  const displayName = isHospital
    ? (form.hospitalName || `${form.firstName || ''} ${form.lastName || ''}`.trim() || 'Hospital')
    : `${form?.firstName || ''} ${form?.lastName || ''}`.trim();
  const idLabel = isHospital ? 'Hospital ID' : 'Donor ID';

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = isHospital
        ? {
            hospitalName: form.hospitalName,
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: form.phoneNumber,
            city: form.city,
          }
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            bloodGroup: form.bloodGroup,
            phoneNumber: form.phoneNumber,
            city: form.city,
            availableToDonate: !!form.availableToDonate,
            lastDonationDate: form.lastDonationDate || null,
          };
      await updateUser(id, payload);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!form) return <div className="page"><div className="alert alert-error">{error || 'User not found.'}</div></div>;

  return (
    <div className="page">
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32,
        padding: '20px 24px', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        borderLeft: '4px solid var(--red)',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--red), #8b0027)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
          flexShrink: 0,
        }}>
          {(displayName?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>
            {form.email}
            {isDonor && form.bloodGroup && (
              <span className="badge badge-red" style={{ marginLeft: 10 }}>{form.bloodGroup}</span>
            )}
            {isHospital && (
              <span className="badge" style={{
                marginLeft: 10, background: '#eff6ff', color: 'var(--blue)',
                border: '1px solid #bfdbfe',
              }}>Hospital</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, fontFamily: 'var(--font-mono, monospace)' }}>
            {idLabel}: <strong style={{ color: 'var(--text-1)', letterSpacing: '0.02em' }}>{form.id}</strong>
          </div>
        </div>
        {isDonor && form.availableToDonate && (
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Available to donate</span>
        )}
      </div>

      <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 20 }}>
        <h1>Edit Profile</h1>
        <p>
          {isHospital
            ? 'Update your hospital contact information'
            : 'Update your personal information and donation preferences'}
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {isHospital ? (
            <div className="form-group">
              <label htmlFor="prof-hospitalName">Hospital name</label>
              <input id="prof-hospitalName" className="input" name="hospitalName"
                value={form.hospitalName || ''} onChange={onChange} required />
            </div>
          ) : (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prof-firstName">First name</label>
                <input id="prof-firstName" className="input" name="firstName"
                  value={form.firstName || ''} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="prof-lastName">Last name</label>
                <input id="prof-lastName" className="input" name="lastName"
                  value={form.lastName || ''} onChange={onChange} required />
              </div>
            </div>
          )}

          {isHospital && (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prof-firstName">Contact first name</label>
                <input id="prof-firstName" className="input" name="firstName"
                  value={form.firstName || ''} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="prof-lastName">Contact last name</label>
                <input id="prof-lastName" className="input" name="lastName"
                  value={form.lastName || ''} onChange={onChange} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prof-email">Email address</label>
            <input id="prof-email" className="input" type="email" name="email"
              value={form.email || ''} disabled readOnly />
          </div>

          {isDonor && (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="prof-bloodGroup">Blood group</label>
                <select id="prof-bloodGroup" className="input" name="bloodGroup"
                  value={form.bloodGroup || ''} onChange={onChange} required>
                  <option value="">Select…</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="prof-phone">Phone number</label>
                <input id="prof-phone" className="input" name="phoneNumber"
                  value={form.phoneNumber || ''} onChange={onChange} required />
              </div>
            </div>
          )}

          {isHospital && (
            <div className="form-group">
              <label htmlFor="prof-phone">Phone number</label>
              <input id="prof-phone" className="input" name="phoneNumber"
                value={form.phoneNumber || ''} onChange={onChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prof-city">City</label>
            <input id="prof-city" className="input" name="city"
              value={form.city || ''} onChange={onChange} required />
          </div>

          {isDonor && (
            <>
              <div className="form-group">
                <label htmlFor="prof-lastDonation">Last donation date</label>
                <input id="prof-lastDonation" className="input" type="date" name="lastDonationDate"
                  value={form.lastDonationDate || ''} onChange={onChange} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
                <input type="checkbox" id="prof-available" name="availableToDonate"
                  checked={!!form.availableToDonate} onChange={onChange} />
                I am currently available to donate blood
              </label>
            </>
          )}

          <div className="divider" />

          <div style={{ display: 'flex', gap: 10 }}>
            <button id="prof-save" className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
