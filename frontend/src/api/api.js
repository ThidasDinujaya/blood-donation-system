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

// ── Auth (user-service, context-path: /user) ─────────────────────────────────
export const registerUser = (data)    => post('/user/api/auth/register', data);
export const loginUser    = (data)    => post('/user/api/auth/login',    data);

// ── Users (user-service, context-path: /user) ───────────────────────────────
export const getUserById       = (id)                       => get(`/user/api/users/${id}`);
export const updateUser        = (id, data)                 => put(`/user/api/users/${id}`, data);
export const deleteUser        = (id)                       => del(`/user/api/users/${id}`);
export const getUsersByBloodGroup = (bloodGroup)            => get(`/user/api/users?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const searchEligibleDonors = (bloodGroup, city)     => get(`/user/api/users?eligibleDonors=true&bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);

// ── Admin: Donors & Hospitals (user-service, context-path: /user) ───────────
export const getAllDonors    = () => get('/user/api/users?role=ROLE_USER');
export const getAllHospitals = () => get('/user/api/users?role=ROLE_HOSPITAL');
export const createUser      = (data) => post('/user/api/auth/register', data);

// ── Campaigns (campaign-service, context-path: /campaign) ───────────────────
export const getAllCampaigns        = ()               => get('/campaign/api/campaigns');
export const getCampaignById        = (id)            => get(`/campaign/api/campaigns/${id}`);
export const createCampaign         = (data)          => post('/campaign/api/campaigns', data);
export const updateCampaign         = (id, data)      => put(`/campaign/api/campaigns/${id}`, data);
export const deleteCampaign         = (id)            => del(`/campaign/api/campaigns/${id}`);
export const getUpcomingCampaigns   = ()              => get('/campaign/api/campaigns?upcoming');
export const getCampaignsByLocation = (location)      => get(`/campaign/api/campaigns?location=${encodeURIComponent(location)}`);

// ── Appointments (campaign-service, context-path: /campaign) ────────────────
export const getAllAppointments            = ()           => get('/campaign/api/appointments');
export const getAppointmentById           = (id)         => get(`/campaign/api/appointments/${id}`);
export const createAppointment            = (data)       => post('/campaign/api/appointments', data);
export const updateAppointment            = (id, data)   => put(`/campaign/api/appointments/${id}`, data);
export const deleteAppointment            = (id)         => del(`/campaign/api/appointments/${id}`);
export const getAppointmentsByCampaign    = (campaignId) => get(`/campaign/api/appointments/campaigns/${campaignId}`);
export const getAppointmentsByDonor       = (donorId)    => get(`/campaign/api/appointments/donors/${donorId}`);
export const getAppointmentsByStatus      = (status)     => get(`/campaign/api/appointments?status=${encodeURIComponent(status)}`);
export const getAppointmentCountByCampaign = (campaignId) => get(`/campaign/api/appointments/campaigns/${campaignId}/count`);
export const checkDonorAppointmentExists = (campaignId, donorId) => get(`/campaign/api/appointments/campaigns/${campaignId}/donors/${donorId}/exists`);

// ── Blood Inventory (inventory-service, context-path: /inventory) ────────────
export const getAllInventory         = ()           => get('/inventory/api/bloodinventories');
export const getInventoryById        = (id)        => get(`/inventory/api/bloodinventories/${id}`);
export const getInventoryByBloodGroup= (bloodGroup)=> get(`/inventory/api/bloodinventories?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const createInventory         = (data)      => post('/inventory/api/bloodinventories', data);
export const updateInventory         = (id, data)  => put(`/inventory/api/bloodinventories/${id}`, data);
export const deleteInventory         = (id)        => del(`/inventory/api/bloodinventories/${id}`);

// ── Emergency Requests (emergency-request-service, context-path: /request) ──
export const getAllRequests          = ()              => get('/request/api/requests');
export const getRequestById         = (id)            => get(`/request/api/requests/${id}`);
export const createRequest          = (data)          => post('/request/api/requests', data);
export const updateRequest          = (id, data)      => put(`/request/api/requests/${id}`, data);
export const deleteRequest          = (id)            => del(`/request/api/requests/${id}`);
export const getRequestsByBloodGroup= (bloodGroup)    => get(`/request/api/requests?bloodGroup=${encodeURIComponent(bloodGroup)}`);
export const getRequestsByStatus    = (status)        => get(`/request/api/requests?status=${encodeURIComponent(status)}`);
export const getRequestsByPriority  = (priority)      => get(`/request/api/requests?priority=${encodeURIComponent(priority)}`);
export const getRequestsByHospitalName = (hospitalName) => get(`/request/api/requests?hospitalName=${encodeURIComponent(hospitalName)}`);
export const getEmergencyRequests   = ()              => get('/request/api/requests?type=EMERGENCY');

// ── Notifications (notification-service, context-path: /notification) ───────
export const sendNotification = (data) => post('/notification/api/notifications/send', data);
