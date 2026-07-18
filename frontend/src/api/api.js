// src/api/api.js
// Central API layer. In dev, VITE_GATEWAY_URL is empty and Vite proxies /api and
// /request to the gateway (see vite.config.js) to avoid browser CORS issues.

// Empty string = same-origin (Vite proxies /api and /request to the gateway).
const GW = import.meta.env.VITE_GATEWAY_URL || '';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${GW}${path}`, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const d = await res.json(); msg = d.message || JSON.stringify(d); } catch (_) {}
    throw new Error(msg);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

const get  = (path)        => request('GET',    path);
const post = (path, body)  => request('POST',   path, body);
const put  = (path, body)  => request('PUT',    path, body);
const del  = (path)        => request('DELETE', path);

// ── Auth (user-service) ──────────────────────────────────────────────────────
export const registerUser = (data)    => post('/api/auth/register', data);
export const loginUser    = (data)    => post('/api/auth/login',    data);

// ── Users (user-service) ─────────────────────────────────────────────────────
export const getUserById       = (id)                       => get(`/api/users/${id}`);
export const updateUser        = (id, data)                 => put(`/api/users/${id}`, data);
export const deleteUser        = (id)                       => del(`/api/users/${id}`);
export const getUsersByBloodGroup = (bloodGroup)            => get(`/api/users?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const searchEligibleDonors = (bloodGroup, city)     => get(`/api/users?eligibleDonors=true&bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);

// ── Admin: Donors & Hospitals (user-service, role-filtered) ──────────────────
export const getAllDonors    = () => get('/api/users?role=ROLE_USER');
export const getAllHospitals = () => get('/api/users?role=ROLE_HOSPITAL');
export const createUser      = (data) => post('/api/auth/register', data);

// ── Campaigns (campaign-service) ─────────────────────────────────────────────
export const getAllCampaigns        = ()               => get('/api/campaigns');
export const getCampaignById        = (id)            => get(`/api/campaigns/${id}`);
export const createCampaign         = (data)          => post('/api/campaigns', data);
export const updateCampaign         = (id, data)      => put(`/api/campaigns/${id}`, data);
export const deleteCampaign         = (id)            => del(`/api/campaigns/${id}`);
export const getUpcomingCampaigns   = ()              => get('/api/campaigns?upcoming');
export const getCampaignsByLocation = (location)      => get(`/api/campaigns?location=${encodeURIComponent(location)}`);

// ── Appointments (campaign-service) ──────────────────────────────────────────
export const getAllAppointments            = ()           => get('/api/appointments');
export const getAppointmentById           = (id)         => get(`/api/appointments/${id}`);
export const createAppointment            = (data)       => post('/api/appointments', data);
export const updateAppointment            = (id, data)   => put(`/api/appointments/${id}`, data);
export const deleteAppointment            = (id)         => del(`/api/appointments/${id}`);
export const getAppointmentsByCampaign    = (campaignId) => get(`/api/appointments/campaigns/${campaignId}`);
export const getAppointmentsByDonor       = (donorId)    => get(`/api/appointments/donors/${donorId}`);
export const getAppointmentsByStatus      = (status)     => get(`/api/appointments?status=${encodeURIComponent(status)}`);
export const getAppointmentCountByCampaign = (campaignId) => get(`/api/appointments/campaigns/${campaignId}/count`);
export const checkDonorAppointmentExists = (campaignId, donorId) => get(`/api/appointments/campaigns/${campaignId}/donors/${donorId}/exists`);

// ── Blood Inventory (inventory-service) ──────────────────────────────────────
export const getAllInventory         = ()           => get('/api/bloodinventories');
export const getInventoryById        = (id)        => get(`/api/bloodinventories/${id}`);
export const getInventoryByBloodGroup= (bloodGroup)=> get(`/api/bloodinventories?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const createInventory         = (data)      => post('/api/bloodinventories', data);
export const updateInventory         = (id, data)  => put(`/api/bloodinventories/${id}`, data);
export const deleteInventory         = (id)        => del(`/api/bloodinventories/${id}`);

// ── Emergency Requests (emergency-request-service, context-path: /requests) ──
export const getAllRequests          = ()              => get('/requests/api/requests');
export const getRequestById         = (id)            => get(`/requests/api/requests/${id}`);
export const createRequest          = (data)          => post('/requests/api/requests', data);
export const updateRequest          = (id, data)      => put(`/requests/api/requests/${id}`, data);
export const deleteRequest          = (id)            => del(`/requests/api/requests/${id}`);
export const getRequestsByBloodGroup= (bloodGroup)    => get(`/requests/api/requests?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const getRequestsByStatus    = (status)        => get(`/requests/api/requests?status=${encodeURIComponent(status)}`);
export const getRequestsByPriority  = (priority)      => get(`/requests/api/requests?priority=${encodeURIComponent(priority)}`);
export const getRequestsByHospitalName = (hospitalName) => get(`/requests/api/requests?hospitalName=${encodeURIComponent(hospitalName)}`);
export const getEmergencyRequests   = ()              => get('/requests/api/requests?type=EMERGENCY');

// ── Notifications (notification-service) ─────────────────────────────────────
export const sendNotification = (data) => post('/api/notifications/send', data);
