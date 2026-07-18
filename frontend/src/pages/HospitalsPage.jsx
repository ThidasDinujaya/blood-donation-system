import { useEffect, useState } from 'react';
import {
  getAllHospitals, deleteUser, updateUser, createUser,
} from '../api/api';

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', password: '',
  phoneNumber: '', city: '', hospitalName: '',
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await getAllHospitals();
      setHospitals(data.content || data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function onChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function startEdit(h) {
    setForm({
      firstName: h.firstName || '',
      lastName: h.lastName || '',
      email: h.email || '',
      password: '',
      phoneNumber: h.phoneNumber || '',
      city: h.city || '',
      hospitalName: h.hospitalName || '',
    });
    setEditId(h.id);
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
          hospitalName: form.hospitalName,
        });
      } else {
        await createUser({
          ...form,
          role: 'ROLE_HOSPITAL',
        });
      }
      cancelForm(); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function onDelete(id) {
    if (!confirm('Delete this hospital account permanently?')) return;
    try { await deleteUser(id); load(); }
    catch (err) { setError(err.message); }
  }

  const filtered = hospitals.filter(h => {
    if (searchCity && !h.city?.toLowerCase().includes(searchCity.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Hospitals</h1>
        <p>Manage all registered hospital accounts</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <div className="filter-bar" style={{ marginBottom: 0, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 160 }}>
            <label htmlFor="hosp-city">City</label>
            <input id="hosp-city" className="input" placeholder="Filter by city"
              value={searchCity} onChange={e => setSearchCity(e.target.value)} />
          </div>
        </div>
        <button id="hosp-add" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}
          onClick={() => { cancelForm(); setShowForm(true); }}>
          + Add hospital
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--red)' }}>
          <div className="section-label">{editId ? 'Edit hospital' : 'New hospital account'}</div>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hosp-fn">First name</label>
                <input id="hosp-fn" className="input" name="firstName" value={form.firstName} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="hosp-ln">Last name</label>
                <input id="hosp-ln" className="input" name="lastName" value={form.lastName} onChange={onChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="hosp-name">Hospital / Blood bank name</label>
              <input id="hosp-name" className="input" name="hospitalName" value={form.hospitalName} onChange={onChange} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hosp-email">Email</label>
                <input id="hosp-email" className="input" type="email" name="email" value={form.email} onChange={onChange}
                  required={!editId} disabled={!!editId} />
              </div>
              <div className="form-group">
                <label htmlFor="hosp-pass">Password</label>
                <input id="hosp-pass" className="input" type="password" name="password" value={form.password} onChange={onChange}
                  required={!editId} placeholder={editId ? 'Leave blank to keep' : ''} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hosp-phone">Phone</label>
                <input id="hosp-phone" className="input" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="hosp-city-f">City</label>
                <input id="hosp-city-f" className="input" name="city" value={form.city} onChange={onChange} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button id="hosp-save" className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update hospital' : 'Create hospital'}
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
          <h3>No hospitals found</h3>
          <p>{hospitals.length === 0 ? 'No hospital accounts registered yet.' : 'Try a different filter.'}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Hospital ID</th>
                  <th>Hospital</th>
                  <th>Contact person</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 700 }}>{h.id}</td>
                    <td style={{ fontWeight: 600 }}>{h.hospitalName || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{h.firstName} {h.lastName}</td>
                    <td style={{ color: 'var(--text-2)' }}>{h.city || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{h.phoneNumber || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{h.email || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`hosp-edit-${h.id}`} className="btn btn-outline btn-sm" onClick={() => startEdit(h)}>Edit</button>
                        <button id={`hosp-del-${h.id}`} className="btn btn-danger btn-sm" onClick={() => onDelete(h.id)}>Delete</button>
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