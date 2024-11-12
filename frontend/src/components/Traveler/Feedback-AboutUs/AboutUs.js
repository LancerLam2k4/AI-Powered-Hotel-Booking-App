import React from 'react';
import './AboutUs.css';


const AboutUs = () => {
  return (
    <div className="about-us-container">
      
      {/* Section 1 with banner image */}
      <div className="section banner-section">
        <div className="welcome-text">
          <h1>Welcome to My Hotel</h1>
          <p>Write a description here about your hotel. This will give visitors a warm welcome and introduce your unique offerings.</p>
        </div>
      </div>

    {/* Section 2 - About Hotel */}
    <div className="section about-hotel-section">
        <div className="about-hotel">
          <div className="about-hotel-left">
            <h2>My Modern Hotel</h2>
            <p>This is where you can talk about the modern features, comfort, and aesthetic of your hotel. Make it appealing and informative.</p>
          </div>
         
        
<div className="about-hotel-right">
  <div className="image-stack">
    <img src="about-us.png" alt="Hotel 1" className="image-1" />
    <img src="bg-register.png" alt="Hotel 2" className="image-2" />
  </div>
</div>


         
        </div>
      </div>

      {/* Section 3 - Team Members (3 members) */}
      <div className="section team-section">
        <h2>About Us</h2>
        <div className="team-members">
          <div className="member">
            <img src="Hình-nền-đẹp-chất-lượng-cao-cho-PC-scaled-2048x1152.jpg" alt="Member 1" />
            <p>Member 1</p>
          </div>
          <div className="member">
            <img src="Hình-nền-đẹp-chất-lượng-cao-cho-PC-scaled-2048x1152.jpg" alt="Member 2" />
            <p>Member 2</p>
          </div>
          <div className="member">
            <img src="Hình-nền-đẹp-chất-lượng-cao-cho-PC-scaled-2048x1152.jpg" alt="Member 3" />
            <p>Member 3</p>
          </div>
        </div>
      </div>

      {/* Section 4 - Remaining Team Members (2 members) */}
      <div className="section team-section">
        <div className="team-members2">
          <div className="member">
            <img src="Hình-nền-đẹp-chất-lượng-cao-cho-PC-scaled-2048x1152.jpg" alt="Member 4" />
            <p>Member 4</p>
          </div>
          <div className="member">
            <img src="Hình-nền-đẹp-chất-lượng-cao-cho-PC-scaled-2048x1152.jpg" alt="Member 5" />
            <p>Member 5</p>
          </div>
        </div>
      </div>

      {/* Section 5 - Company Logos */}
      <div className="section logos-section">
        <h2>Our Partners</h2>
        <div className="logos">
          <img src="path-to-logo1.jpg" alt="Company 1" />
          <img src="path-to-logo2.jpg" alt="Company 2" />
          <img src="path-to-logo3.jpg" alt="Company 3" />
        </div>
      </div>

     
    </div>
   
   
  );
};

export default AboutUs;
