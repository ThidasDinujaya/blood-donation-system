import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCampaigns, getUpcomingCampaigns, getCampaignsByLocation } from '../api/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [location,  setLocation]  = useState('');
  const [filter,    setFilter]    = useState('all');

  async function load(mode, loc) {
    setLoading(true); setError('');
    try {
      let data;
      if (mode === 'upcoming') data = await getUpcomingCampaigns();
      else if (loc)            data = await getCampaignsByLocation(loc);
      else                     data = await getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load('all', ''); }, []);

  function onApply(e) {
    e.preventDefault();
    load(filter, location);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood Donation Campaigns</h1>
        <p>Find and join a blood donation drive near you</p>
      </div>

      {/* Filters */}
      <form className="filter-bar" onSubmit={onApply}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="camp-filter">Show</label>
          <select id="camp-filter" className="input" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All campaigns</option>
            <option value="upcoming">Upcoming only</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: 260 }}>
          <label htmlFor="camp-loc">Location</label>
          <input id="camp-loc" className="input" placeholder="Filter by city or venue…"
            value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <button id="camp-search" className="btn btn-outline" type="submit" style={{ alignSelf: 'flex-end' }}>
          Apply filters
        </button>
      </form>

      {error   && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && campaigns.length === 0 && (
        <div className="empty">
          <h3>No campaigns found</h3>
          <p>Try adjusting your filters or check back soon.</p>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found
          </p>
          <div className="card-grid">
            {campaigns.map(c => (
              <Link to={`/campaigns/${c.id}`} key={c.id}>
                <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="badge badge-red">{c.date}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                      {c.startTime} – {c.endTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3, color: 'var(--text)' }}>
                    {c.title}
                  </h3>

                  {/* Description */}
                  {c.description && (
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </p>
                  )}

                  <div className="divider" />

                  {/* Footer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--text-2)', paddingTop: 10 }}>
                    <span>Location: {c.location}</span>
                    <span>Organizer: {c.organizer}</span>
                    <span style={{ color: 'var(--text-3)' }}>{c.maxDonors} donor slots</span>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <span className="btn btn-ghost btn-sm" style={{ padding: '5px 0', fontSize: 12 }}>
                      View &amp; Book →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
