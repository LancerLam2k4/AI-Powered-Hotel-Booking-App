import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Heading and Introduction */}
      <section className="intro">
        <div className="intro-text">
          <h2>About Us</h2>
          <p>
            Welcome to our hotel booking platform, where we offer the best accommodations and services to make your stay enjoyable and memorable.
          </p>
        </div>
        <div className="intro-image">
          <img src="hotel.jpg" alt="Hotel" />
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h3>Our Services</h3>
        <div className="service-list">
          <div className="service-item">
            <div className="service-icon">📶</div>
            <p>Free WiFi</p>
          </div>
          <div className="service-item">
            <div className="service-icon">🛎️</div>
            <p>Room Service</p>
          </div>
          <div className="service-item">
            <div className="service-icon">🅿️</div>
            <p>Free Parking Lots</p>
          </div>
          <div className="service-item">
            <div className="service-icon">⏰</div>
            <p>Early Check-in, Late Check-out</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team">
        <h3>Our Team</h3>
        <div className="team-members">
          <div className="team-member">
            <div className="member-photo">👤</div>
            <p>Member 1</p>
          </div>
          <div className="team-member">
            <div className="member-photo">👤</div>
            <p>Member 2</p>
          </div>
          <div className="team-member">
            <div className="member-photo">👤</div>
            <p>Member 3</p>
          </div>
          <div className="team-member">
            <div className="member-photo">👤</div>
            <p>Member 4</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
