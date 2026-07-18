import { useEffect, useState } from 'react';
import { getAllAppointments, getAppointmentsByDonor, deleteAppointment } from '../api/api';
import { useRole } from '../hooks/useRole';

const STATUS_BADGE = {
  PENDING:   'badge-yellow',
  CONFIRMED: 'badge-green',
  CANCELLED: 'badge-grey',
  COMPLETED: 'badge-blue',
};

export default function MyAppointmentsPage() {
  const { userId, isAdmin } = useRole();
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    if (!userId && !isAdmin) {
      setError('Please log in to view bookings.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = isAdmin
        ? await getAllAppointments()
        : await getAppointmentsByDonor(userId);
      setAppts(data);
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId || isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAdmin]);

  async function onCancel(id) {
    if (!confirm(isAdmin ? 'Delete this appointment?' : 'Cancel this appointment?')) return;
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
        <h1>{isAdmin ? 'All Appointments' : 'My Appointments'}</h1>
        <p>
          {isAdmin
            ? 'View and manage every donor booking across campaigns'
            : `Donation bookings for Donor ID ${userId || '—'}`}
        </p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && loaded && appts.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <i className="fi fi-rr-calendar" style={{ fontSize: '2.2rem', color: 'var(--red)', opacity: 0.4 }} />
          </div>
          <h3>No appointments found</h3>
          <p>{isAdmin ? 'No bookings have been made yet.' : 'Book a slot at a campaign to get started.'}</p>
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
                  {isAdmin && <th>Donor ID</th>}
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
                    {isAdmin && (
                      <td style={{ fontWeight: 600 }}>{a.donorId}</td>
                    )}
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
                        disabled={deleting === a.id || (!isAdmin && a.status === 'CANCELLED')}
                      >
                        {deleting === a.id ? '…' : isAdmin ? 'Delete' : 'Cancel'}
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
