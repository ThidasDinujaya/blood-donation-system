import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import LoginPage              from './pages/LoginPage';
import RegisterPage           from './pages/RegisterPage';
import ProfilePage            from './pages/ProfilePage';
import FindDonorsPage         from './pages/FindDonorsPage';
import CampaignsPage          from './pages/CampaignsPage';
import CampaignDetailPage     from './pages/CampaignDetailPage';
import MyAppointmentsPage     from './pages/MyAppointmentsPage';
import InventoryPage          from './pages/InventoryPage';
import EmergencyRequestsPage  from './pages/EmergencyRequestsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"                    element={<Navigate to="/campaigns" replace />} />
        <Route path="/campaigns"           element={<CampaignsPage />} />
        <Route path="/campaigns/:id"       element={<CampaignDetailPage />} />
        <Route path="/profile/:id"         element={<ProfilePage />} />
        <Route path="/find-donors"         element={<FindDonorsPage />} />
        <Route path="/my-appointments"     element={<MyAppointmentsPage />} />
        <Route path="/inventory"           element={<InventoryPage />} />
        <Route path="/emergency-requests"  element={<EmergencyRequestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}


