// src/components/Traveler/TravelerLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatboxButton from './AI/ChatboxButton';
import './TravelerLayout.css';

const TravelerLayout = () => {
  return (
    <div className="traveler-layout">
       <header className="header-container">
      <div className="header-container">
      <div className="logo-container">
        <img src="logo3.png" alt="Logo1" className="logo1" />
      </div>

      <div className="nav-links">
        <ul>
          <li><a href="">Home</a></li>
          <li><a href="">About</a></li>
          <li><a href="">Services</a></li>
          <li><a href="">Contact</a></li>
        </ul>
      </div>
      <button className="booking-button">
      <span className="material-icons">shopping_cart</span> 
      </button>
    </div>
    </header>
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
