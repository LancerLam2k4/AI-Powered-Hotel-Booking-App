import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingDetail.css';
import { useNavigate } from 'react-router-dom';

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState('room.png');
  const [roomDetails, setRoomDetails] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  // Get roomId from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setRoomId(id);
  }, []);

  // Fetch room details from the database
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;

      try {
        const response = await axios.get(`/api/rooms/${roomId}`);
        setRoomDetails(response.data.room);
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleBooking = async () => {
    if (!roomDetails) return;

    try {
      const formData = new FormData();
      formData.append('roomId', roomDetails.id);
      formData.append('quantity', bookingQuantity);
  
      await axios.post('http://localhost:8000/api/bookings', formData);
      console.log('Booking successful');
  
      // Using Promise.resolve with a slight delay
      setTimeout(() => {
        Promise.resolve().then(() => navigate('/booking-room'));
      }, 0);
    } catch (error) {
      console.error('Error making booking:', error);
    } 
  };
  return (
    <div>
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

      <section id="roomdetails-room-detail" className="section-p1-room-detail">
        <div className="single-room-image-room-detail">
          <img src={mainImage} alt="Room" width="100%" id="mainImg-room-detail" />

          <div className="small-img-group-room-detail">
            {['sub-room-1.png', 'sub-room-2.png', 'sub-room-3.png', 'sub-room-4.png'].map((imgSrc, index) => (
              <div key={index} className="small-img-col-room-detail" onClick={() => handleImageClick(imgSrc)}>
                <img src={imgSrc} className="small-img-room-detail" width="100%" alt="Room" />
              </div>
            ))}
          </div>
        </div>

        <div className="single-room-details-room-detail">
          <h6 className="breadcrumbs-room-detail">Hotel / Room</h6>
          <h4>Deluxe King Room</h4>
          <h2>$200 per night</h2>

          <input 
            type="number" 
            min="1" 
            value={bookingQuantity}
            onChange={(e) => setBookingQuantity(parseInt(e.target.value))}
          />

          <button onClick={handleBooking}>Book Now</button>

          <h4>Room Details</h4>
          <span>
            This Deluxe King Room offers a luxurious experience with scenic views. Enjoy a relaxing stay with top-notch amenities and an elegant design that ensures comfort and style.
          </span>
        </div>
      </section>

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

export default RoomDetail;
