
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './BookingRoom.css';

function BookingRoom() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roomType, setRoomType] = useState('');
  const [numGuests, setNumGuests] = useState(1); // Số lượng khách
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Thiết lập ngày hiện tại
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setArrivalDate(currentDate); // Sử dụng currentDate để thiết lập ngày mặc định
  }, []);

  const images = [
    "room1.png",
    
    "room3.png",
    "room3.png",
    "casino.png",
  ];

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentImageIndex(index),
  };

  const handleReservation = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      roomType,
      numGuests, // Sử dụng numGuests thay vì adults và children
      arrivalDate,
      arrivalTime,
      departureDate,
      departureTime,
      specialRequest,
      totalPrice,
    });
  };

  const calculateTotalPrice = () => {
    const pricePerNight = 150; // Giá mỗi đêm
    const nights = 3; // Số đêm ví dụ
    return pricePerNight * nights;
  };

  return (
    <div className="bookingroom-container">
      <div className="bookingroom-description-slider-container">
        <div className="bookingroom-main-slider">
          <Slider {...mainSliderSettings}>
            {images.map((image, index) => (
              <div key={index} className="bookingroom-main-slider-item">
                <img src={image} alt={`Room ${index + 1}`} className="bookingroom-main-image" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="bookingroom-additional-images">
          <img src="bar.png" alt="Cozy hotel bar" className="bookingroom-additional-image" />
          <img src="pool.png" alt="Swimming pool" className="bookingroom-additional-image" />
          <img src="casino.png" alt="Casino area" className="bookingroom-additional-image" />
        </div>
        <div className="bookingroom-description">
        <h3>Description</h3>
      <p>
        Enjoy our classic suites with all the elegance and comfort that its interior has...
        It features such essentials as a flat-screen 45" TV, WiFi, and 2 bathrooms with a living room and 2 bedrooms, 
        big and chic enough to be counted as real suite bedrooms!
      </p>
    </div>
<div className="bookingroom-room-info">
  <p>
    Our rooms are designed with meticulous attention to detail to ensure you have a comfortable and memorable experience. 
    With modern furnishings and comprehensive amenities, we are committed to providing you with an ideal space for relaxation. 
    Each room features a spacious king-sized bed and a cozy sofa, free Wi-Fi, cable television, air conditioning, and a private bathroom stocked with complimentary toiletries. 
    Enjoy 24/7 room service and daily housekeeping to make your stay as enjoyable as possible.
  </p>
        </div>
      </div>
      <div className="booking-separator"></div>
      <div className="bookingroom-details">
        <h3>Hotel Rules</h3>
        <ul>
          <li>Check-in: after 3 PM.</li>
          <li>Check-out: before 11 AM.</li>
          <li>Pets allowed; please notify in advance.</li>
          <li>No smoking indoors; only in designated outdoor areas.</li>
          <li>Quiet hours: 12 PM to 7 AM.</li>
          <li>Please contact staff if you need assistance.</li>
        </ul>
      </div>
      <div className="booking-separator"></div>
      <div className="bookingroom-reservation-section">
  <h3 className="bookingroom-title">Reservation Form</h3>
  <p className="bookingroom-subtitle">Please fill in your details</p>
  <form className="bookingroom-reservation-form-container" onSubmit={handleReservation}>
    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        First Name:
        <input type="text" className="bookingroom-reservation-form-input"  value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </label>
      <label className="bookingroom-reservation-form-label">
        Last Name:
        <input type="text" className="bookingroom-reservation-form-input"  value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </label>
    </div>

    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        Email:
        <input type="email" className="bookingroom-reservation-form-input"  value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
    </div>

    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        Number of Guests:
        <input type="number" className="bookingroom-reservation-form-input" value={numGuests} onChange={(e) => setNumGuests(e.target.value)} min="1" required />
      </label>
    </div>

    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        Arrival Date & Time:
        <input type="date" className="bookingroom-reservation-form-input" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
        <input type="time" className="bookingroom-reservation-form-input" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
      </label>
    </div>

    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        Departure Date & Time:
        <input type="date" className="bookingroom-reservation-form-input" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
        <input type="time" className="bookingroom-reservation-form-input" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
      </label>
    </div>

    <div className="bookingroom-form-row">
      <label className="bookingroom-reservation-form-label">
        Special Request:
        <textarea className="bookingroom-reservation-form-textarea" placeholder="" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
      </label>
    </div>

    <div className="bookingroom-total-price">
      <span>Price: ${calculateTotalPrice()}</span>
    </div>

    <button type="submit" className="bookingroom-reservation-form-button">Reserve Now</button>
  </form>
</div>
      
    </div>
  );
}

export default BookingRoom;
// Trang Đặt Phòng