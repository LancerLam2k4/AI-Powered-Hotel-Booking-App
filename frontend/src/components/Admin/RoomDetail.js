import React, {useEffect, useState } from 'react';
import axios from 'axios';
import './RoomDetail.css';

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState('room.png');

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  // Fetch room details from the database
  useEffect(() => {
    const fetchRoomDetails = async () => {
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
    try {
      const formData = new FormData();
      formData.append('roomId', roomDetails.id);
      formData.append('quantity', bookingQuantity);
      formData.append('selectedView', selectedView);

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

          <select>
            <option value="">Select View</option>
            <option value="garden">Garden View</option>
            <option value="ocean">Ocean View</option>
            <option value="city">City View</option>
          </select>

          <input type="number" min="1" defaultValue="1" />

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
