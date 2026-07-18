import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireRole from './components/RequireRole';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DonorsPage from './pages/DonorsPage';
import HospitalsPage from './pages/HospitalsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import InventoryPage from './pages/InventoryPage';
import EmergencyRequestsPage from './pages/EmergencyRequestsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/profile/:id" element={
          <RequireRole allow={['ADMIN', 'DONOR', 'HOSPITAL']}>
            <ProfilePage />
          </RequireRole>
        } />
        <Route path="/my-appointments" element={
          <RequireRole allow={['DONOR', 'ADMIN']}>
            <MyAppointmentsPage />
          </RequireRole>
        } />
        <Route path="/emergency-requests" element={
          <RequireRole allow={['HOSPITAL', 'ADMIN']}>
            <EmergencyRequestsPage />
          </RequireRole>
        } />
        <Route path="/inventory" element={
          <RequireRole allow={['ADMIN']}>
            <InventoryPage />
          </RequireRole>
        } />
        <Route path="/donors" element={
          <RequireRole allow={['ADMIN']}>
            <DonorsPage />
          </RequireRole>
        } />
        <Route path="/hospitals" element={
          <RequireRole allow={['ADMIN']}>
            <HospitalsPage />
          </RequireRole>
        } />
      </Routes>
    </BrowserRouter>
  );
}
