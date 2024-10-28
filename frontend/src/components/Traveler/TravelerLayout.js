// src/components/Traveler/TravelerLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatboxButton from './AI/ChatboxButton';
import './TravelerLayout.css';

const TravelerLayout = () => {
  return (
    <div className="traveler-layout">
      {/* Khung chứa các trang con của Traveler */}
      <div className="traveler-content">
        <Outlet /> {/* Render nội dung của các trang con (Profile, Booking...) */}
      </div>
      {/* Icon ChatboxButton luôn hiển thị trong layout */}
      <ChatboxButton />
    </div>
  );
};

export default TravelerLayout;
