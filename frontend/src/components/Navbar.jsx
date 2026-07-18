import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isHospital, isDonor, isLoggedIn, userId } = useRole();

  function handleLogout() {
    sessionStorage.clear();
    navigate('/login');
  }

  // Role-based nav (Campaigns is always shown separately as public)
  const roleLinks = [];
  if (isLoggedIn) {
    if (isDonor) {
      roleLinks.push({ to: '/my-appointments', label: 'My Bookings' });
    }
    if (isHospital || isAdmin) {
      roleLinks.push({ to: '/emergency-requests', label: 'Emergency' });
    }
    if (isAdmin) {
      roleLinks.push(
        { to: '/find-donors', label: 'Find Donors' },
        { to: '/inventory', label: 'Inventory' },
        { to: '/my-appointments', label: 'Bookings' },
      );
    }
  }

  const roleLabel = isAdmin ? 'Admin' : isHospital ? 'Hospital' : 'Donor';
  const roleBadgeStyle = {
    fontSize: 10, fontWeight: 700, padding: '3px 8px',
    borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase',
    background: isAdmin ? '#fff0f3' : isHospital ? '#f0fdf4' : '#eff6ff',
    color: isAdmin ? 'var(--red)' : isHospital ? '#166534' : 'var(--blue)',
    border: isAdmin ? '1px solid var(--red-border)' : isHospital ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="auth-logo-dot" />
        BloodLink
      </Link>

      <div className="navbar-links">
        <Link
          to="/campaigns"
          className={`navbar-link ${pathname.startsWith('/campaigns') ? 'active' : ''}`}
        >
          Campaigns
        </Link>

        {roleLinks.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`navbar-link ${pathname.startsWith(l.to) ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="navbar-divider" />

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <span style={roleBadgeStyle}>{roleLabel}</span>
            <Link to={`/profile/${userId}`} className="navbar-link">Profile</Link>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
