import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/campaigns',          label: 'Campaigns'     },
  { to: '/inventory',          label: 'Inventory'     },
  { to: '/emergency-requests', label: 'Emergency'     },
  { to: '/find-donors',        label: 'Find Donors'   },
  { to: '/my-appointments',    label: 'My Bookings'   },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const userId       = sessionStorage.getItem('userId');

  function handleLogout() {
    sessionStorage.clear();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="auth-logo-dot" />
        BloodLink
      </Link>

      <div className="navbar-links">
        {NAV_LINKS.map(l => (
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
        {userId ? (
          <>
            <Link to={`/profile/${userId}`} className="navbar-link">Profile</Link>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar-link">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
