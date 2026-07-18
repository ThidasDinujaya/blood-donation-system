import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getCampaignById, 
  createAppointment, 
  getAppointmentCountByCampaign, 
  checkDonorAppointmentExists,
  getAppointmentsByDonor,
  deleteAppointment
} from '../api/api';
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
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [userAppointment, setUserAppointment] = useState(null);
  const [canceling, setCanceling] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const campaignData = await getCampaignById(id);
      setCampaign(campaignData);

      // Get appointment count for remaining spots
      const countData = await getAppointmentCountByCampaign(Number(id));
      setAppointmentCount(countData.count);

      // Check if user has an appointment for this campaign
      if (canBook) {
        const existsData = await checkDonorAppointmentExists(Number(id), Number(userId));
        setHasAppointment(existsData.exists);

        if (existsData.exists) {
          // Get user's appointments to find the one for this campaign
          const userAppointments = await getAppointmentsByDonor(Number(userId));
          const campaignAppt = userAppointments.find(appt => appt.campaignId === Number(id));
          setUserAppointment(campaignAppt || null);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, canBook, userId]);

  async function onBook(e) {
    e.preventDefault();
    setBooking(true); setError(''); setSuccess('');
    try {
      await createAppointment({ 
        campaignId: Number(id), 
        donorId: Number(userId), 
        status: 'PENDING' 
      });
      setSuccess('Your appointment is confirmed!');
      await loadData(); // Reload data to update count and hasAppointment
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  async function onCancel() {
    if (!userAppointment) return;
    setCanceling(true); setError(''); setSuccess('');
    try {
      await deleteAppointment(userAppointment.id);
      setSuccess('Your appointment has been canceled.');
      await loadData(); // Reload data
    } catch (err) {
      setError(err.message);
    } finally {
      setCanceling(false);
    }
  }

  const remainingSpots = campaign ? (campaign.maxDonors - appointmentCount) : 0;
  const isFull = remainingSpots <= 0;

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <div className="card">
          <div className="section-label">Campaign Details</div>
          <div>
            {[
              ['Date', campaign.date],
              ['Time', `${campaign.startTime} – ${campaign.endTime}`],
              ['Location', campaign.location],
              ['Organizer', campaign.organizer],
              ['Max Donors', campaign.maxDonors],
              ['Remaining Spots', remainingSpots],
            ].map(([label, value]) => (
              <div className="stat-row" key={label}>
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginTop: 16 }}>{success}</div>}

          {canBook && !hasAppointment && !isFull && (
            <form onSubmit={onBook} style={{ marginTop: 24 }}>
              <button id="appt-submit" className="btn btn-primary btn-full" type="submit" disabled={booking}>
                {booking ? 'Booking…' : 'Confirm Appointment'}
              </button>
            </form>
          )}

          {canBook && hasAppointment && (
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 16, color: 'var(--text-2)' }}>
                You have an appointment for this campaign!
              </div>
              <button 
                id="appt-cancel" 
                className="btn btn-outline btn-full" 
                type="button" 
                disabled={canceling}
                onClick={onCancel}
              >
                {canceling ? 'Canceling…' : 'Cancel Appointment'}
              </button>
            </div>
          )}

          {canBook && isFull && !hasAppointment && (
            <div style={{ marginTop: 24, color: 'var(--text-2)' }}>
              This campaign has reached the maximum number of donors!
            </div>
          )}

          {!canBook && !isLoggedIn && (
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                Log in as a donor to book a slot for this campaign.
              </p>
              <Link to="/login" className="btn btn-primary">
                Log in to book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
