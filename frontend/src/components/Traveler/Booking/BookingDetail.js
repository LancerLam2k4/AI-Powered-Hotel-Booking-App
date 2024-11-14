import React, {useEffect, useState } from 'react';
import axios from 'axios';
import './BookingDetail.css';

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState('room.png');
  const [roomDetails, setRoomDetails] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [roomId, setRoomId] = useState(null);

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

      const response = await axios.post('http://localhost:8000/api/bookings', formData);
      console.log('Booking successful:', response.data);
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  return (
    <div>
      <header className="header-room-detail">
        <a href="#"><img src="logo.png" className="logo-room-detail" alt="Logo" /></a>
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
    </div>
  );
};

export default RoomDetail;


