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
