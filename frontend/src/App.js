import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterTraveler from "./components/Authentication/RegisterTraveler.js"; // Đảm bảo đường dẫn đúng
import Login from "./components/Authentication/Login.js"; // Giả sử bạn đã tạo component Login
import AdminDashboard from "./components/Admin/AdminDashboard"; // Dashboard Admin
import TravelerDashboard from "./components/Traveler/TravelerDashboard"; // Dashboard Traveler
import StaffDashboard from "./components/Staff/StaffDashboard"; // Dashboard Staff
import HotelOwnerDashboard from "./components/HotelOwner/HotelOwnerDashboard"; // Dashboard Hotel Owner
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import TravelerProfile from "../src/components/Traveler/ProfileTraveler/HomeProfile";
import EditBasicInfo from "./components/Traveler/ProfileTraveler/EditBasicInfo";
import TravelerLayout from "./components/Traveler/TravelerLayout";
import AddRoom from "./components/Admin/AddRoom.js";
import BookingDetail from "./components/Traveler/Booking/BookingDetail.js";
import Booking from "./components/Traveler/Booking/Booking.js";
import EditAdvancedInfo from "./components/Traveler/ProfileTraveler/EditAdvancedInfo.js";
import Feedback from "./components/Traveler/Feedback-AboutUs/Feedback"
const App = () => {
  return (
      <Routes>
        <Route path="/register" element={<RegisterTraveler />} />{" "}
        {/* Chỉ định trang đầu tiên */}
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/hotel-owner-dashboard"element={<HotelOwnerDashboard />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/add-room" element={<AddRoom/>}/>
        <Route element={<TravelerLayout />}>
          <Route path="/traveler-profile" element={<TravelerProfile />} />
          <Route path="/edit-basic-profile" element={<EditBasicInfo />} />
          <Route path="/booking" element={<Booking />} />
        </Route>
        <Route path="/room-detail" element={<BookingDetail/>}/>
        <Route path="/edit-advanced-profile" element={<EditAdvancedInfo />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/edit-basic-info" element={<EditBasicInfo />} />
      </Routes>
  );
};

export default App;
