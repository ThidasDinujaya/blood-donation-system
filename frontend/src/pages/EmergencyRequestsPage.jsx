import { useEffect, useState } from 'react';
import {
  getAllRequests, createRequest, updateRequest, deleteRequest,
  getRequestsByBloodGroup, getRequestsByStatus, getRequestsByPriority,
} from '../api/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const PRIORITIES   = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES     = ['PENDING', 'FULFILLED', 'CANCELLED'];

const EMPTY = {
  hospitalName: '', contactNumber: '', bloodGroup: '', unitsNeeded: '',
  priority: 'MEDIUM', requestDate: '', requiredBefore: '', status: 'PENDING',
};

const PRIORITY_BADGE = { LOW: 'badge-blue', MEDIUM: 'badge-yellow', HIGH: 'badge-red', CRITICAL: 'badge-red' };
const STATUS_BADGE   = { PENDING: 'badge-yellow', FULFILLED: 'badge-green', CANCELLED: 'badge-grey' };

export default function EmergencyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [filterBG, setFilterBG] = useState('');
  const [filterSt, setFilterSt] = useState('');
  const [filterPr, setFilterPr] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      let data;
      if (filterBG)      data = await getRequestsByBloodGroup(filterBG);
      else if (filterSt) data = await getRequestsByStatus(filterSt);
      else if (filterPr) data = await getRequestsByPriority(filterPr);
      else               data = await getAllRequests();
      setRequests(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
  function startEdit(item) { setForm({ ...item }); setEditId(item.id); setShowForm(true); }
  function cancelForm()    { setForm(EMPTY); setEditId(null); setShowForm(false); }

  async function onSave(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, unitsNeeded: Number(form.unitsNeeded) };
      if (editId) await updateRequest(editId, payload);
      else        await createRequest(payload);
      cancelForm(); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function onDelete(id) {
    if (!confirm('Delete this request?')) return;
    try { await deleteRequest(id); load(); }
    catch (err) { setError(err.message); }
  }

  const pending  = requests.filter(r => r.status === 'PENDING').length;
  const critical = requests.filter(r => r.priority === 'CRITICAL').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Emergency Blood Requests</h1>
        <p>Track and submit urgent blood requirements from hospitals</p>
      </div>

      {/* Alert banner for critical requests */}
      {!loading && critical > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fi fi-rr-triangle-warning" style={{ fontSize: 16, flexShrink: 0 }} />
          {critical} CRITICAL request{critical > 1 ? 's' : ''} require immediate attention.
        </div>
      )}

      {/* Stat row */}
      {!loading && requests.length > 0 && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total requests', value: requests.length, color: 'var(--text)' },
            { label: 'Pending', value: pending, color: 'var(--yellow)' },
            { label: 'Critical', value: critical, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, minWidth: 130, textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Blood group</label>
            <select className="input" value={filterBG}
              onChange={e => { setFilterBG(e.target.value); setFilterSt(''); setFilterPr(''); }}>
              <option value="">All</option>
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select className="input" value={filterSt}
              onChange={e => { setFilterSt(e.target.value); setFilterBG(''); setFilterPr(''); }}>
              <option value="">All</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Priority</label>
            <select className="input" value={filterPr}
              onChange={e => { setFilterPr(e.target.value); setFilterBG(''); setFilterSt(''); }}>
              <option value="">All</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button id="er-filter" className="btn btn-outline" onClick={load} style={{ alignSelf: 'flex-end' }}>
            Apply
          </button>
        </div>
        <button id="er-add" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}
          onClick={() => { cancelForm(); setShowForm(true); }}>
          + New request
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--red)' }}>
          <div className="section-label">{editId ? 'Edit request' : 'New emergency request'}</div>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="er-hospital">Hospital name</label>
                <input id="er-hospital" className="input" name="hospitalName"
                  placeholder="e.g. Colombo General Hospital"
                  value={form.hospitalName} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="er-contact">Contact number</label>
                <input id="er-contact" className="input" name="contactNumber"
                  placeholder="+94 11 XXX XXXX"
                  value={form.contactNumber} onChange={onChange} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="er-bg">Blood group needed</label>
                <select id="er-bg" className="input" name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
                  <option value="">Select…</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="er-units">Units needed</label>
                <input id="er-units" className="input" type="number" name="unitsNeeded"
                  min="1" placeholder="1" value={form.unitsNeeded} onChange={onChange} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="er-priority">Priority level</label>
                <select id="er-priority" className="input" name="priority" value={form.priority} onChange={onChange}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="er-status">Status</label>
                <select id="er-status" className="input" name="status" value={form.status} onChange={onChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="er-reqDate">Request date</label>
                <input id="er-reqDate" className="input" type="date" name="requestDate" value={form.requestDate} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="er-reqBefore">Required before</label>
                <input id="er-reqBefore" className="input" type="date" name="requiredBefore" value={form.requiredBefore} onChange={onChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button id="er-save" className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save request'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && !showForm && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && requests.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <i className="fi fi-rr-bell-ring" style={{ fontSize: '2.2rem', color: 'var(--red)', opacity: 0.4 }} />
          </div>
          <h3>No requests found</h3>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Blood group</th>
                <th>Units</th>
                <th>Priority</th>
                <th>Required before</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} style={r.priority === 'CRITICAL' ? { background: '#fff8f9' } : {}}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.hospitalName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{r.contactNumber}</div>
                  </td>
                  <td><span className="badge badge-red" style={{ fontWeight: 800 }}>{r.bloodGroup}</span></td>
                  <td style={{ fontWeight: 600 }}>{r.unitsNeeded}</td>
                  <td><span className={`badge ${PRIORITY_BADGE[r.priority] || 'badge-grey'}`}>{r.priority}</span></td>
                  <td style={{ color: 'var(--text-2)' }}>{r.requiredBefore || '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-grey'}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`er-edit-${r.id}`} className="btn btn-outline btn-sm" onClick={() => startEdit(r)}>Edit</button>
                      <button id={`er-del-${r.id}`}  className="btn btn-danger btn-sm"  onClick={() => onDelete(r.id)}>Delete</button>
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
