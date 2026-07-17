import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllCampaigns, getUpcomingCampaigns, getCampaignsByLocation,
  createCampaign, updateCampaign, deleteCampaign,
} from '../api/api';

const EMPTY = {
  title: '', description: '', date: '', startTime: '', endTime: '',
  location: '', organizer: '', maxDonors: '',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [location,  setLocation]  = useState('');
  const [filter,    setFilter]    = useState('all');

  // form state
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);

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

  function onApply(e) { e.preventDefault(); load(filter, location); }
  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
  function startEdit(c) { setForm({ ...c, maxDonors: c.maxDonors ?? '' }); setEditId(c.id); setShowForm(true); }
  function cancelForm()  { setForm(EMPTY); setEditId(null); setShowForm(false); }

  async function onSave(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, maxDonors: Number(form.maxDonors) };
      if (editId) await updateCampaign(editId, payload);
      else        await createCampaign(payload);
      cancelForm(); load('all', '');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this campaign?')) return;
    try { await deleteCampaign(id); load('all', ''); }
    catch (err) { setError(err.message); }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Blood Donation Campaigns</h1>
        <p>Find, manage, and join blood donation drives near you</p>
      </div>

      {/* Toolbar — filters + Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <form className="filter-bar" style={{ marginBottom: 0 }} onSubmit={onApply}>
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

        <button
          id="camp-add"
          className="btn btn-primary"
          style={{ alignSelf: 'flex-end' }}
          onClick={() => { cancelForm(); setShowForm(true); }}
        >
          + Add Campaign
        </button>
      </div>

      {/* Inline create / edit form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--red)' }}>
          <div className="section-label">{editId ? 'Edit campaign' : 'New campaign'}</div>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="camp-title">Campaign title</label>
              <input id="camp-title" className="input" name="title"
                placeholder="e.g. National Blood Drive 2025" value={form.title} onChange={onChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="camp-desc">Description</label>
              <textarea id="camp-desc" className="input" name="description"
                placeholder="Brief description of the campaign…" value={form.description} onChange={onChange} />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="camp-date">Date</label>
                <input id="camp-date" className="input" type="date" name="date"
                  value={form.date} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="camp-maxDonors">Max donors</label>
                <input id="camp-maxDonors" className="input" type="number" name="maxDonors"
                  min="1" placeholder="50" value={form.maxDonors} onChange={onChange} required />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="camp-start">Start time</label>
                <input id="camp-start" className="input" type="time" name="startTime"
                  value={form.startTime} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="camp-end">End time</label>
                <input id="camp-end" className="input" type="time" name="endTime"
                  value={form.endTime} onChange={onChange} required />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="camp-location">Location / Venue</label>
                <input id="camp-location" className="input" name="location"
                  placeholder="City / Address" value={form.location} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="camp-organizer">Organizer</label>
                <input id="camp-organizer" className="input" name="organizer"
                  placeholder="e.g. Red Cross" value={form.organizer} onChange={onChange} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button id="camp-save" className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save campaign'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && !showForm && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && campaigns.length === 0 && (
        <div className="empty">
          <h3>No campaigns found</h3>
          <p>Try adjusting your filters, or add the first campaign above.</p>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found
          </p>
          <div className="card-grid">
            {campaigns.map(c => (
              <div className="card" key={c.id} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                  <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.5, flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                )}

                <div className="divider" />

                {/* Footer info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-2)', paddingTop: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="fi fi-rr-marker" style={{ fontSize: 13, color: 'var(--red)', flexShrink: 0 }} />
                    {c.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="fi fi-rr-building" style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0 }} />
                    {c.organizer}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-3)' }}>
                    <i className="fi fi-rr-users" style={{ fontSize: 13, flexShrink: 0 }} />
                    {c.maxDonors} donor slots
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/campaigns/${c.id}`} style={{ flex: 1 }}>
                    <span className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      View &amp; Book →
                    </span>
                  </Link>
                  <button id={`camp-edit-${c.id}`} className="btn btn-outline btn-sm" onClick={() => startEdit(c)}>Edit</button>
                  <button id={`camp-del-${c.id}`}  className="btn btn-danger btn-sm"  onClick={() => onDelete(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
