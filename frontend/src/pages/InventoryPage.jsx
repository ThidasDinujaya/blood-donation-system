import { useEffect, useState } from 'react';
import {
  getAllInventory, getInventoryByBloodGroup,
  createInventory, updateInventory, deleteInventory,
} from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const EMPTY = { bloodGroup: '', unitsAvailable: '', bloodBankName: '', location: '', expiryDate: '' };

function stockBadge(n) {
  if (n >= 20) return 'badge-green';
  if (n >= 5)  return 'badge-yellow';
  return 'badge-red';
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [filterBG,  setFilterBG]  = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);

  async function load(bg) {
    setLoading(true); setError('');
    try {
      setInventory(bg ? await getInventoryByBloodGroup(bg) : await getAllInventory());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(''); }, []);

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
  function startEdit(item) { setForm({ ...item }); setEditId(item.id); setShowForm(true); }
  function cancelForm()    { setForm(EMPTY); setEditId(null); setShowForm(false); }

  async function onSave(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, unitsAvailable: Number(form.unitsAvailable) };
      if (editId) await updateInventory(editId, payload);
      else        await createInventory(payload);
      cancelForm(); load('');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function onDelete(id) {
    if (!confirm('Delete this inventory record?')) return;
    try { await deleteInventory(id); load(''); }
    catch (err) { setError(err.message); }
  }

  // Summary stats
  const totalUnits = inventory.reduce((s, i) => s + (i.unitsAvailable || 0), 0);
  const lowStock   = inventory.filter(i => i.unitsAvailable < 5).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood Inventory</h1>
        <p>Monitor and manage blood bank stock levels</p>
      </div>

      {/* Stats row */}
      {!loading && inventory.length > 0 && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total units', value: totalUnits, color: 'var(--red)' },
            { label: 'Blood banks', value: new Set(inventory.map(i => i.bloodBankName)).size, color: 'var(--text)' },
            { label: 'Low stock alerts', value: lowStock, color: lowStock > 0 ? 'var(--yellow)' : 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inv-filter">Filter by blood group</label>
            <select id="inv-filter" className="input" value={filterBG}
              onChange={e => { setFilterBG(e.target.value); load(e.target.value); }}>
              <option value="">All groups</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <button id="inv-add" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}
          onClick={() => { cancelForm(); setShowForm(true); }}>
          + Add record
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--red)' }}>
          <div className="section-label">{editId ? 'Edit record' : 'New inventory record'}</div>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="inv-bg">Blood group</label>
                <select id="inv-bg" className="input" name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
                  <option value="">Select…</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inv-units">Units available</label>
                <input id="inv-units" className="input" type="number" name="unitsAvailable"
                  min="0" placeholder="0" value={form.unitsAvailable} onChange={onChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inv-bank">Blood bank name</label>
              <input id="inv-bank" className="input" name="bloodBankName"
                placeholder="e.g. National Blood Bank" value={form.bloodBankName} onChange={onChange} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="inv-location">Location</label>
                <input id="inv-location" className="input" name="location"
                  placeholder="City / Address" value={form.location} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="inv-expiry">Expiry date</label>
                <input id="inv-expiry" className="input" type="date" name="expiryDate" value={form.expiryDate} onChange={onChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button id="inv-save" className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save record'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && !showForm && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && inventory.length === 0 && (
        <div className="empty">
          <h3>No inventory records</h3>
          <p>Add the first record to start tracking stock.</p>
        </div>
      )}

      {!loading && inventory.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Blood group</th>
                <th>Units</th>
                <th>Blood bank</th>
                <th>Location</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td><span className="badge badge-red" style={{ fontSize: 13, fontWeight: 800 }}>{item.bloodGroup}</span></td>
                  <td>
                    <span className={`badge ${stockBadge(item.unitsAvailable)}`}>
                      {item.unitsAvailable} units
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.bloodBankName}</td>
                  <td style={{ color: 'var(--text-2)' }}>{item.location || '—'}</td>
                  <td style={{ color: item.expiryDate ? 'var(--text-2)' : 'var(--text-3)' }}>
                    {item.expiryDate || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`inv-edit-${item.id}`} className="btn btn-outline btn-sm" onClick={() => startEdit(item)}>Edit</button>
                      <button id={`inv-del-${item.id}`}  className="btn btn-danger btn-sm"  onClick={() => onDelete(item.id)}>Delete</button>
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
