import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import ChatboxButton from './AI/ChatboxButton';
import './TravelerLayout.css';

const TravelerLayout = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleAvatarHover = () => {
    setDropdownVisible(true);
  };

  const handleAvatarLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="traveler-layout">
      {/* Main content area */}
      <div className="traveler-content">
        <header className="header-container">
          <div className="logo-container">
            <img src="logo3.png" alt="Logo1" className="logo1" />
          </div>

          <div className="nav-links">
            <ul>
              <li><a href="traveler-dashboard">Home</a></li>
              <li><a href="booking">Room&Suites</a></li>
              <li><a href="">Services</a></li>
              <li><a href="">Contact</a></li>
            </ul>
          </div>

          {/* Avatar Icon with dropdown */}
          <div
            className="avatar-container"
            onMouseEnter={handleAvatarHover}
            onMouseLeave={handleAvatarLeave}
          >
            <span className="material-icons avatar-icon">account_circle</span> {/* Icon avatar */}
            {isDropdownVisible && (
              <div className="avatar-dropdown">
                <ul>
                  <li onClick={() => navigate('/traveler-profile')}>Profile</li>
                  <li onClick={() => navigate('/feedback')}>Feedback</li>
                  <li onClick={() => navigate('/login')}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Outlet for child routes */}
        <Outlet />
      </div>

      {/* Chatbox Button */}
      <ChatboxButton />

      {/* Footer */}
      <footer className="footer-booking">
        <div className="footer-container">
          <div className="footer-logo-desc">
            <img src="logo3.png" alt="Logo1" className="logo1" />
            <p>
              A boutique experience in Indianapolis with luxurious rooms, exemplary service, and a prime location.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>410 S Missouri St, Indianapolis, IN</p>
            <p>Phone: +3(123) 789-5789</p>
            <p>Email: <a href="mailto:info@modernhotel.com">info@modernhotel.com</a></p>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://google.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-google"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Modern Hotel. All Rights Reserved. <a href="#">Privacy Policy</a></p>
        </div>
      </footer>
    </div>
  );
};

export default TravelerLayout;
