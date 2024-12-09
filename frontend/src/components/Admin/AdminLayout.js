import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleAvatarHover = () => {
    setDropdownVisible(true);
  };

  const handleAvatarLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="admin-layout">
      {/* Main content area */}
      <div className="admin-content">
        <header className="admin-header-container">
          <div className="admin-logo-container">
            <img src="logo3.png" alt="Logo1" className="admin-logo1" />
          </div>

          <div className="admin-nav-links">
            <ul>
              <li><a href="/admin-dashboard">Room Management</a></li>
              <li><a href="/feedback-management">Feedback Management</a></li>
            </ul>
          </div>

          {/* Avatar Icon with dropdown */}
          <div
            className="admin-avatar-container"
            onMouseEnter={handleAvatarHover}
            onMouseLeave={handleAvatarLeave}
          >
            <span className="material-icons admin-avatar-icon">account_circle</span> {/* Icon avatar */}
            {isDropdownVisible && (
              <div className="admin-avatar-dropdown">
                <ul>
                  <li onClick={() => navigate('/admin-profile')}>Profile</li>
                  <li onClick={() => navigate('/login')}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Outlet for child routes */}
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="admin-footer-booking">
        <div className="admin-footer-container">
          <div className="admin-footer-logo-desc">
            <img src="logo3.png" alt="Logo1" className="admin-logo1" />
            <p>
              A boutique experience in Indianapolis with luxurious rooms, exemplary service, and a prime location.
            </p>
          </div>

          <div className="admin-footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="admin-footer-contact">
            <h4>Contact Us</h4>
            <p>410 S Missouri St, Indianapolis, IN</p>
            <p>Phone: +3(123) 789-5789</p>
            <p>Email: <a href="mailto:info@modernhotel.com">info@modernhotel.com</a></p>
          </div>

          <div className="admin-footer-social">
            <h4>Follow Us</h4>
            <div className="admin-social-icons">
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
        <div className="admin-footer-bottom">
          <p>&copy; 2024 Modern Hotel. All Rights Reserved. <a href="#">Privacy Policy</a></p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
