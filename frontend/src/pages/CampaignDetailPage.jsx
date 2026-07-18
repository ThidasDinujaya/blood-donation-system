import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCampaignById, createAppointment } from '../api/api';
import { useRole } from '../hooks/useRole';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDonor, isLoggedIn, userId } = useRole();
  const canBook = isDonor && isLoggedIn;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [booking, setBooking] = useState(false);

  const [appt, setAppt] = useState({
    campaignId: id, donorId: userId || '',
    appointmentDate: '', timeSlot: '', status: 'PENDING',
  });

  useEffect(() => {
    getCampaignById(id)
      .then(setCampaign)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function onChange(e) {
    setAppt(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onBook(e) {
    e.preventDefault();
    setBooking(true); setError(''); setSuccess('');
    try {
      await createAppointment({ ...appt, campaignId: Number(id), donorId: Number(appt.donorId) });
      setSuccess('Your appointment is confirmed!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!campaign) return (
    <div className="page">
      <div className="alert alert-error">{error || 'Campaign not found.'}</div>
    </div>
  );

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
        ← Back to Campaigns
      </button>

      <div style={{
        background: 'linear-gradient(135deg, var(--red) 0%, #8b0027 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 28px',
        color: '#fff',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%', background: 'rgba(255,255,255,.06)',
        }} />
        <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none', marginBottom: 12 }}>
          {campaign.date}
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          {campaign.title}
        </h1>
        {campaign.description && (
          <p style={{ fontSize: 14, opacity: .85, maxWidth: 560 }}>{campaign.description}</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: canBook ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div className="card">
          <div className="section-label">Campaign Details</div>
          <div>
            {[
              ['Date', campaign.date],
              ['Time', `${campaign.startTime} – ${campaign.endTime}`],
              ['Location', campaign.location],
              ['Organizer', campaign.organizer],
              ['Max Donors', campaign.maxDonors],
            ].map(([label, value]) => (
              <div className="stat-row" key={label}>
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {canBook && (
          <div className="card" style={{ borderTop: '3px solid var(--red)' }}>
            <div className="section-label">Book an Appointment</div>
            <form onSubmit={onBook} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-group">
                <label htmlFor="appt-donorId">Your Donor ID</label>
                <input id="appt-donorId" className="input" name="donorId" type="number"
                  placeholder="Enter your donor ID"
                  value={appt.donorId} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="appt-date">Preferred Date</label>
                <input id="appt-date" className="input" type="date" name="appointmentDate"
                  value={appt.appointmentDate} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="appt-slot">Preferred Time Slot</label>
                <input id="appt-slot" className="input" name="timeSlot" placeholder="e.g. 09:00"
                  value={appt.timeSlot} onChange={onChange} required />
              </div>
              <button id="appt-submit" className="btn btn-primary btn-full" type="submit" disabled={booking}>
                {booking ? 'Booking…' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        )}

        {!canBook && !isLoggedIn && (
          <div className="card">
            <div className="section-label">Book an Appointment</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
              Log in as a donor to book a slot for this campaign.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
              Log in to book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
