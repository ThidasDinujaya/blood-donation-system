import { useEffect, useState } from 'react';
import {
  getAllDonors, deleteUser, updateUser, createUser,
} from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', password: '',
  phoneNumber: '', city: '', bloodGroup: '', availableToDonate: true,
};

export default function DonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchBG, setSearchBG] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await getAllDonors();
      setDonors(data.content || data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function onChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [e.target.name]: value }));
  }

  function startEdit(d) {
    setForm({
      firstName: d.firstName || '',
      lastName: d.lastName || '',
      email: d.email || '',
      password: '',
      phoneNumber: d.phoneNumber || '',
      city: d.city || '',
      bloodGroup: d.bloodGroup || '',
      availableToDonate: d.availableToDonate ?? true,
    });
    setEditId(d.id);
    setShowForm(true);
  }

  function cancelForm() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  }

  async function onSave(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editId) {
        await updateUser(editId, {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          city: form.city,
          bloodGroup: form.bloodGroup,
          availableToDonate: form.availableToDonate,
        });
      } else {
        await createUser({
          ...form,
          role: 'ROLE_USER',
        });
      }
      cancelForm(); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function onDelete(id) {
    if (!confirm('Delete this donor account permanently?')) return;
    try { await deleteUser(id); load(); }
    catch (err) { setError(err.message); }
  }

  // Filtering
  const filtered = donors.filter(d => {
    if (searchBG && d.bloodGroup !== searchBG) return false;
    if (searchCity && !d.city?.toLowerCase().includes(searchCity.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Donors</h1>
        <p>Manage all registered blood donor accounts</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <div className="filter-bar" style={{ marginBottom: 0, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
            <label htmlFor="don-bg">Blood group</label>
            <select id="don-bg" className="input" value={searchBG}
              onChange={e => setSearchBG(e.target.value)}>
              <option value="">All</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 160 }}>
            <label htmlFor="don-city">City</label>
            <input id="don-city" className="input" placeholder="Filter by city"
              value={searchCity} onChange={e => setSearchCity(e.target.value)} />
          </div>
        </div>
        <button id="don-add" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}
          onClick={() => { cancelForm(); setShowForm(true); }}>
          + Add donor
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--red)' }}>
          <div className="section-label">{editId ? 'Edit donor' : 'New donor account'}</div>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="don-fn">First name</label>
                <input id="don-fn" className="input" name="firstName" value={form.firstName} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="don-ln">Last name</label>
                <input id="don-ln" className="input" name="lastName" value={form.lastName} onChange={onChange} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="don-email">Email</label>
                <input id="don-email" className="input" type="email" name="email" value={form.email} onChange={onChange}
                  required={!editId} disabled={!!editId} />
              </div>
              <div className="form-group">
                <label htmlFor="don-pass">Password</label>
                <input id="don-pass" className="input" type="password" name="password" value={form.password} onChange={onChange}
                  required={!editId} placeholder={editId ? 'Leave blank to keep' : ''} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="don-phone">Phone</label>
                <input id="don-phone" className="input" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="don-city-f">City</label>
                <input id="don-city-f" className="input" name="city" value={form.city} onChange={onChange} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="don-bg-f">Blood group</label>
                <select id="don-bg-f" className="input" name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
                  <option value="">Select…</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" name="availableToDonate" checked={form.availableToDonate} onChange={onChange} />
                  <span style={{ fontSize: 13 }}>Available to donate</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button id="don-save" className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update donor' : 'Create donor'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && !showForm && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <h3>No donors found</h3>
          <p>{donors.length === 0 ? 'No donor accounts registered yet.' : 'Try a different filter.'}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Donor ID</th>
                  <th>Donor</th>
                  <th>Blood group</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Available</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.id}</td>
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
                        <div>
                          <span style={{ fontWeight: 600 }}>{d.firstName} {d.lastName}</span>
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-red">{d.bloodGroup || '—'}</span></td>
                    <td style={{ color: 'var(--text-2)' }}>{d.city || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{d.phoneNumber || '—'}</td>
                    <td>
                      <span className={`badge ${d.availableToDonate ? 'badge-green' : 'badge-red'}`}>
                        {d.availableToDonate ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`don-edit-${d.id}`} className="btn btn-outline btn-sm" onClick={() => startEdit(d)}>Edit</button>
                        <button id={`don-del-${d.id}`} className="btn btn-danger btn-sm" onClick={() => onDelete(d.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}