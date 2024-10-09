import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterTraveler from './components/RegisterTraveler'; // Đảm bảo đường dẫn đúng
import Login from './components/Login'; // Giả sử bạn đã tạo component Login
import AdminDashboard from './components/AdminDashboard'; // Dashboard Admin
import TravelerDashboard from './components/TravelerDashboard'; // Dashboard Traveler
import StaffDashboard from './components/StaffDashboard'; // Dashboard Staff
import HotelOwnerDashboard from './components/HotelOwnerDashboard'; // Dashboard Hotel Owner

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RegisterTraveler />} /> {/* Chỉ định trang đầu tiên */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/hotel-owner-dashboard" element={<HotelOwnerDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
