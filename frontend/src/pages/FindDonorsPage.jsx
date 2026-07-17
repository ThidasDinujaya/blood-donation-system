import { useState } from 'react';
import { searchEligibleDonors } from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function FindDonorsPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city,       setCity]       = useState('');
  const [donors,     setDonors]     = useState([]);
  const [searched,   setSearched]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await searchEligibleDonors(bloodGroup, city);
      setDonors(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Find Eligible Donors</h1>
        <p>Search for available blood donors by blood group and city</p>
      </div>

      {/* Search card */}
      <div className="card" style={{ maxWidth: 520, marginBottom: 28, borderTop: '3px solid var(--red)' }}>
        <div className="section-label">Search Parameters</div>
        <form onSubmit={onSearch} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fd-bloodGroup">Blood group needed</label>
              <select id="fd-bloodGroup" className="input" value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)} required>
                <option value="">Select…</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fd-city">City</label>
              <input id="fd-city" className="input" placeholder="e.g. Colombo"
                value={city} onChange={e => setCity(e.target.value)} required />
            </div>
          </div>

          <button id="fd-search" className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search donors'}
          </button>
        </form>
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {searched && !loading && donors.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <i className="fi fi-rr-search" style={{ fontSize: '2.2rem', color: 'var(--red)', opacity: 0.4 }} />
          </div>
          <h3>No eligible donors found</h3>
          <p>Try a different blood group or city.</p>
        </div>
      )}

      {searched && !loading && donors.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
            {donors.length} eligible donor{donors.length !== 1 ? 's' : ''} found for {bloodGroup} in {city}
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Last Donation</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--red), #8b0027)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                        }}>
                          {d.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: 600 }}>{d.firstName} {d.lastName}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-red">{d.bloodGroup}</span></td>
                    <td style={{ color: 'var(--text-2)' }}>{d.city || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{d.phoneNumber || '—'}</td>
                    <td style={{ color: 'var(--text-3)' }}>{d.lastDonationDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
