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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import BookingRoom from "./components/Traveler/Booking/BookingRoom.js";
=======
>>>>>>> 63f7b7723030ba5c027ba1d333e4bddf75569dcb
=======
>>>>>>> 63f7b7723030ba5c027ba1d333e4bddf75569dcb
=======
>>>>>>> 63f7b7723030ba5c027ba1d333e4bddf75569dcb
=======
>>>>>>> 63f7b7723030ba5c027ba1d333e4bddf75569dcb
=======
import BookingRoom from "./components/Traveler/Booking/BookingRoom.js";
>>>>>>> cebaffa6cdbda2ebc25d51cf009933a0820161c2
=======
import BookingRoom from "./components/Traveler/Booking/BookingRoom.js";
>>>>>>> cebaffa6cdbda2ebc25d51cf009933a0820161c2
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
        <Route path="/bookingDetail/:roomId" element={<BookingDetail/>}/>
        <Route path="/bookingRoom/:roomId" element={<BookingRoom />} />
        <Route path="/edit-advanced-profile" element={<EditAdvancedInfo />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/edit-basic-info" element={<EditBasicInfo />} />
      </Routes>
  );
};

export default App;
