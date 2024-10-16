import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterTraveler from './components/Authentication/RegisterTraveler.js'; // Đảm bảo đường dẫn đúng
import Login from './components/Authentication/Login.js'; // Giả sử bạn đã tạo component Login
import AdminDashboard from './components/Admin/AdminDashboard'; // Dashboard Admin
import TravelerDashboard from './components/TravelerDashboard'; // Dashboard Traveler
import StaffDashboard from './components/StaffDashboard'; // Dashboard Staff
import HotelOwnerDashboard from './components/HotelOwnerDashboard'; // Dashboard Hotel Owner
import ForgotPassword from './components/Authentication/ForgotPassword';
import ResetPassword from './components/Authentication/ResetPassword';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterTraveler />} /> {/* Chỉ định trang đầu tiên */}
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/hotel-owner-dashboard" element={<HotelOwnerDashboard />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
};

export default App;
