// src/hooks/useRole.js
// Reads role + userId from sessionStorage (set on login).

export function useRole() {
  const role   = sessionStorage.getItem('role')   || '';
  const userId = sessionStorage.getItem('userId') || null;

  return {
    role,
    userId,
    isAdmin: role === 'ROLE_ADMIN',
    isDonor: role === 'ROLE_USER' || role === 'ROLE_DONOR',
    isHospital: role === 'ROLE_HOSPITAL',
    isLoggedIn: !!userId,
  };
}
