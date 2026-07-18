import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

/** Redirects away if the current user does not match any of the allowed roles. */
export default function RequireRole({ allow, children, fallback = '/campaigns' }) {
  const { isLoggedIn, isAdmin, isDonor, isHospital } = useRole();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const roles = {
    ADMIN: isAdmin,
    DONOR: isDonor,
    HOSPITAL: isHospital,
  };

  const ok = allow.some(r => roles[r]);
  if (!ok) return <Navigate to={fallback} replace />;

  return children;
}
