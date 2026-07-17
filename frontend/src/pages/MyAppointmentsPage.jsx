import { useEffect, useState } from 'react';
import { getAppointmentsByDonor, deleteAppointment } from '../api/api';

const STATUS_BADGE = {
  PENDING:   'badge-yellow',
  CONFIRMED: 'badge-green',
  CANCELLED: 'badge-grey',
  COMPLETED: 'badge-blue',
};

export default function MyAppointmentsPage() {
  const userId = sessionStorage.getItem('userId');
  const [donorId,  setDonorId]  = useState(userId || '');
  const [appts,    setAppts]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [deleting, setDeleting] = useState(null);
  const [loaded,   setLoaded]   = useState(false);

  async function load(id) {
    if (!id) return;
    setLoading(true); setError('');
    try {
      setAppts(await getAppointmentsByDonor(id));
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (userId) load(userId); }, []);

  async function onCancel(id) {
    if (!confirm('Cancel this appointment?')) return;
    setDeleting(id);
    try {
      await deleteAppointment(id);
      setAppts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage your donation bookings</p>
      </div>

      {/* Load bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="appts-id">Donor ID</label>
          <input id="appts-id" className="input" type="number" placeholder="Enter donor ID"
            value={donorId} onChange={e => setDonorId(e.target.value)} style={{ width: 160 }} />
        </div>
        <button id="appts-load" className="btn btn-primary" onClick={() => load(donorId)}>
          Load appointments
        </button>
      </div>

      {error   && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && loaded && appts.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📅</div>
          <h3>No appointments found</h3>
          <p>Book a slot at a campaign to get started.</p>
        </div>
      )}

      {!loading && appts.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
            {appts.length} appointment{appts.length !== 1 ? 's' : ''}
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Campaign</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--text-3)', fontWeight: 500 }}>#{a.id}</td>
                    <td style={{ fontWeight: 600 }}>Campaign #{a.campaignId}</td>
                    <td>{a.appointmentDate}</td>
                    <td style={{ color: 'var(--text-2)' }}>{a.timeSlot}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[a.status] || 'badge-grey'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        id={`appt-cancel-${a.id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => onCancel(a.id)}
                        disabled={deleting === a.id || a.status === 'CANCELLED'}
                      >
                        {deleting === a.id ? '…' : 'Cancel'}
                      </button>
                    </td>
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
