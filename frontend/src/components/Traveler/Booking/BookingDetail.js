import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick'; // Import Slick Slider
import './BookingDetail.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const RoomDetail = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [roomId, setRoomId] = useState(null);
  const [subImages] = useState(['khach-san-chup-anh-dep-27.jpg', 'sub-room-2.png', 'sub-room-3.png', 'sub-room-4.png']);
  const navigate = useNavigate();

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

  const handleImageClick = (roomId) => {
    // Use navigate to go to the booking page and pass roomId in the URL
    navigate(`/bookingRoom/${roomId}`);
  };

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

  // Slick Carousel Settings
  const settings = {
    dots: true, // Show dots below the slider
    infinite: true, // Infinite loop
    speed: 500, // Slide transition speed
    slidesToShow: 1, // Show 1 image at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Speed of autoplay (2 seconds)
  };

  return (
    <div className="room-detail-container">
      {/* Room Details Section */}
      <section id="roomdetails-room-detail" className="room-detail-section">
        <div className="room-detail-image">
          <div className="price-tag">$200 per night</div>
          {/* Use Slick Slider here */}
          <Slider {...settings}>
            {subImages.map((imgSrc, index) => (
              <div key={index}>
                <img src={imgSrc} alt={`Room Image ${index + 1}`} />
              </div>
            ))}
          </Slider>

          <div className="room-detail-small-images">
            {subImages.map((imgSrc, index) => (
              <div key={index} className="small-img-col-room-detail">
                <img src={imgSrc} className="small-img-room-detail" width="100%" alt="Room" />
              </div>
            ))}
          </div>
        </div>

        <div className="room-detail-info">
          <h6 className="room-detail-breadcrumbs">Hotel / Room</h6>
          <h4>Deluxe King Room</h4>
          <div className="room-booking-quantity">
            {/* <input
              type="number"
              min="1"
              value={bookingQuantity}
              onChange={(e) => setBookingQuantity(parseInt(e.target.value))}
            /> */}
            <button onClick={() => handleImageClick(roomId)} className="room-book-button">Book Now</button>
          </div>

          <h4>Room Details</h4>
          <p>
            This Deluxe King Room offers a luxurious experience with scenic views. Enjoy a relaxing stay with top-notch amenities and an elegant design that ensures comfort and style.
          </p>

          <div className="room-amenities">
            <h4>Room Features</h4>
            <ul>
              <li><span className="icon-circle">&#10003;</span> Free Wi-Fi</li>
              <li><span className="icon-circle">&#10003;</span> Air Conditioning</li>
              <li><span className="icon-circle">&#10003;</span> King-sized Bed</li>
              <li><span className="icon-circle">&#10003;</span> Flat-screen TV</li>
              <li><span className="icon-circle">&#10003;</span> Room Service</li>
            </ul>
          </div>

          <div className="room-rating">
            <h4>Guest Rating</h4>
            <div className="rating-stars">
              <span>⭐⭐⭐⭐⭐</span>
              <span>(4.5/5 based on 120 reviews)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoomDetail;
