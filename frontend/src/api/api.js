// src/api/api.js
// Central API layer — all fetch calls go through the gateway at VITE_GATEWAY_URL.
// To change a service URL, update .env. Pages never know raw service ports.

const GW = import.meta.env.VITE_GATEWAY_URL;

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
export const registerUser = (data)    => post('/api/v1/auth/register', data);
export const loginUser    = (data)    => post('/api/v1/auth/login',    data);

// ── Users (user-service) ─────────────────────────────────────────────────────
export const getUserById       = (id)                       => get(`/api/v1/users/${id}`);
export const updateUser        = (id, data)                 => put(`/api/v1/users/${id}`, data);
export const deleteUser        = (id)                       => del(`/api/v1/users/${id}`);
export const getUsersByBloodGroup = (bloodGroup)            => get(`/api/v1/users/blood-group/${bloodGroup}`);
export const searchEligibleDonors = (bloodGroup, city)     => get(`/api/v1/users/search?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);

// ── Campaigns (campaign-service) ─────────────────────────────────────────────
export const getAllCampaigns        = ()               => get('/api/campaigns');
export const getCampaignById        = (id)            => get(`/api/campaigns/${id}`);
export const createCampaign         = (data)          => post('/api/campaigns', data);
export const updateCampaign         = (data)          => put('/api/campaigns', data);
export const deleteCampaign         = (id)            => del(`/api/campaigns/${id}`);
export const getUpcomingCampaigns   = ()              => get('/api/campaigns?upcoming');
export const getCampaignsByLocation = (location)      => get(`/api/campaigns?location=${encodeURIComponent(location)}`);

// ── Appointments (campaign-service) ──────────────────────────────────────────
export const getAllAppointments            = ()           => get('/api/appointments');
export const getAppointmentById           = (id)         => get(`/api/appointments/${id}`);
export const createAppointment            = (data)       => post('/api/appointments', data);
export const updateAppointment            = (data)       => put('/api/appointments', data);
export const deleteAppointment            = (id)         => del(`/api/appointments/${id}`);
export const getAppointmentsByCampaign    = (campaignId) => get(`/api/appointments/campaign/${campaignId}`);
export const getAppointmentsByDonor       = (donorId)    => get(`/api/appointments/donor/${donorId}`);
export const getAppointmentsByStatus      = (status)     => get(`/api/appointments?status=${encodeURIComponent(status)}`);

// ── Blood Inventory (inventory-service) ──────────────────────────────────────
export const getAllInventory         = ()           => get('/api/bloodinventories');
export const getInventoryById        = (id)        => get(`/api/bloodinventories/${id}`);
export const getInventoryByBloodGroup= (bloodGroup)=> get(`/api/bloodinventories?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const createInventory         = (data)      => post('/api/bloodinventories', data);
export const updateInventory         = (id, data)  => put(`/api/bloodinventories/${id}`, data);
export const deleteInventory         = (id)        => del(`/api/bloodinventories/${id}`);

// ── Emergency Requests (emergency-request-service, context-path: /request) ──
export const getAllRequests          = ()              => get('/request/api/requests');
export const getRequestById         = (id)            => get(`/request/api/requests/${id}`);
export const createRequest          = (data)          => post('/request/api/requests', data);
export const updateRequest          = (id, data)      => put(`/request/api/requests/${id}`, data);
export const deleteRequest          = (id)            => del(`/request/api/requests/${id}`);
export const getRequestsByBloodGroup= (bloodGroup)    => get(`/request/api/requests?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const getRequestsByStatus    = (status)        => get(`/request/api/requests?status=${encodeURIComponent(status)}`);
export const getRequestsByPriority  = (priority)      => get(`/request/api/requests?priority=${encodeURIComponent(priority)}`);
export const getEmergencyRequests   = ()              => get('/request/api/requests?type=EMERGENCY');

// ── Notifications (notification-service) ─────────────────────────────────────
export const sendNotification = (data) => post('/api/v1/notifications/send', data);
