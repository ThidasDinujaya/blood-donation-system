import { Link } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export default function HomePage() {
  const { isLoggedIn, role } = useRole();

  return (
    <div className="home-container" style={{ minHeight: 'calc(100vh - 58px)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--red) 0%, #8b0027 100%)',
        color: '#fff',
        padding: '80px 24px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative circles */}
        <div style={{ position: 'absolute', top: -50, left: -50, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -20, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />

        <div style={{ maxWidt: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            background: 'rgba(255,255,255,.15)', padding: '5px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 20
          }}>
            Every Drop Counts
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 20 }}>
            Connecting Lives, <br/>One Donation at a Time
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.6 }}>
            BloodLink brings together volunteer donors, local campaigns, and healthcare facilities to ensure swift, life-saving blood access whenever emergency strikes.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campaigns" className="btn btn-lg" style={{ background: '#fff', color: 'var(--red)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              Explore Campaigns <i className="fi fi-rr-arrow-right" style={{ marginLeft: 6, fontSize: 12 }} />
            </Link>
            {!isLoggedIn && (
              <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }}>
                Join as a Donor
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '70px 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Why Join BloodLink?
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            Simplifying the life-saving process for donors and hospitals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Card 1 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-bg)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fi fi-rr-marker" style={{ fontSize: 20 }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Nearby Campaigns</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>
              Locate open donation hubs and blood drives in your area. Secure your slot and minimize waiting times.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-bg)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fi fi-rr-bell-ring" style={{ fontSize: 20 }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Emergency Broadcasts</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>
              Receive instant alerts about critical shortages in regional hospitals. Respond and help save a patient's life directly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fi fi-rr-search" style={{ fontSize: 20 }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Find Donors</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>
              For admins and verified healthcare organizations. Look up compatible active donors in cities in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics / Impact Banner */}
      <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32, textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--red)' }}>4.9★</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4, fontWeight: 500 }}>User Satisfaction</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)', height: 50, alignSelf: 'center' }} className="divider-h" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)' }}>100%</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4, fontWeight: 500 }}>Volunteer Driven</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)', height: 50, alignSelf: 'center' }} className="divider-h" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)' }}>24/7</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4, fontWeight: 500 }}>Hospital Coverage</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          © {new Date().getFullYear()} BloodLink Donation System. Built for EAD Coursework.
        </p>
      </footer>
    </div>
  );
}
