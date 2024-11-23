import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './BookingRoom.css';

function BookingRoom() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roomType, setRoomType] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]); 
  const [roomInfor, setRoomInfor] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Thiết lập ngày hiện tại
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setArrivalDate(currentDate);
  }, []);

  useEffect(() => {
    getRoom();
  }, [])


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

  const [error, setError] = useState("");
  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/showDetail", {
          params: { roomId }, // Truyền roomId qua query string
        });
        setRoom(response.data);
        console.log(room) // Lưu dữ liệu phòng vào state
      } catch (err) {
        setError("Error fetching room detail: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  

  const calculateTotalDays = () => {
    if (!arrivalDate || !departureDate) return 0;

    const start = new Date(arrivalDate + "T" + arrivalTime);  // Combine date and time
    const end = new Date(departureDate);
  
    const timeDifference = end - start;
    return timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : 0;
  };
  

  const calculateTotalPrice = () => {
    const totalDays = calculateTotalDays();
    return totalDays * rooms.price; 
  };

  const handleDateChange = () => {
    const totalPriceInVND = calculateTotalPrice();
    setTotalPrice(totalPriceInVND);  
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {currency: 'VND'}).format(amount);
  };

  const exchangeRate = 23000;
  const convertToUSD = (vndPrice) => {
    return (vndPrice / exchangeRate).toFixed(2); 
  };

  const getRoom  = async () =>{
    try {
      const response = await axios.get(`http://localhost:8000/api/booking-Room/${roomId}`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleReservation = async (e) => {
    e.preventDefault();
    const reservationData = {
      roomId,
      firstName,
      lastName,
      email,
      arrivalDate,
      arrivalTime,
      departureDate,
      departureTime,
      specialRequest,
      totalPrice: calculateTotalPrice(),  // Đảm bảo rằng calculateTotalPrice() trả về tổng giá trị
      totalDays: calculateTotalDays(),    // Đảm bảo rằng calculateTotalDays() trả về số ngày lưu trú
    };
  
    try {
      setIsSubmitting(true);
      // Gửi yêu cầu POST đến backend
      const response = await axios.post('http://localhost:8000/api/reserve-room', reservationData);
      console.log(response.data);
      // alert('Reservation successful!');
      // Reset form hoặc redirect khi cần thiết
      setMessage("Reservation successful! Redirecting in");
    let countdownTime = 5;
    setCountdown(countdownTime);

    const timer = setInterval(() => {
      countdownTime -= 1;
      setCountdown(countdownTime);

      if (countdownTime === 0) {
        clearInterval(timer);
        window.location.href = "/booking"; // Chuyển hướng sau khi đếm ngược xong
      }
    }, 1000); 
    } catch (err) {
      setError('There was an error with your reservation.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bookingroom-container">
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
      <div className="bookingroom-description-slider-container">
        <div className="bookingroom-main-slider">
        <Slider {...mainSliderSettings}>
          {/* Kiểm tra nếu room và room.main_image không phải null */}
          {room && room.main_image ? (
            <div key="main-image" className="bookingroom-main-slider-item">
              <img 
                src={room.main_image} 
                alt="Room Main Image" 
                className="bookingroom-main-image" 
              />
            </div>
          ) : (
            <div className="bookingroom-main-slider-item">
              <p>Loading main image...</p> {/* Hiển thị thông báo khi ảnh chưa có */}
            </div>
          )}

          {/* Kiểm tra nếu room.additional_images có dữ liệu */}
          {room && room.additional_images && room.additional_images.length > 0 ? (
            room.additional_images.map((image, index) => (
              <div key={index} className="bookingroom-main-slider-item">
                <img 
                  src={image} 
                  alt={`Room Additional Image ${index + 1}`} 
                  className="bookingroom-main-image" 
                />
              </div>
            ))
          ) : (
            <div className="bookingroom-main-slider-item">
              <p>Loading additional images...</p> {/* Hiển thị thông báo khi ảnh phụ chưa có */}
            </div>
          )}
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
            {rooms.description}
          </p>
          <p>
            {rooms.name}
          </p>
          <p>
            {rooms.price}
          </p>
          <p>
            {rooms.type}
          </p>
        </div>
        <div className="bookingroom-room-info">
          <p>
            Our rooms are designed with meticulous attention to detail to ensure you have a comfortable and memorable experience. 
            Each room features a spacious king-sized bed, free Wi-Fi, cable television, air conditioning, and a private bathroom stocked with complimentary toiletries.
            Enjoy 24/7 room service and daily housekeeping to make your stay as enjoyable as possible.
          </p>
        </div>
      </div>
      <div>
        {message && (
          <p className="countdown-message">
            {message} {countdown > 0 ? `${countdown} seconds` : ""}
          </p>
        )}
      </div>

      <div className="booking-separator"></div>
      <div className="bookingroom-side-by-side">
        <div className="bookingroom-reservation-section">
          <h3 className="bookingroom-title">Reservation Form</h3>
          <p className="bookingroom-subtitle">Please fill in your details</p>
          <form className="bookingroom-reservation-form-container" onSubmit={handleReservation}>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label" >
                First Name:
                <input type="text" className="bookingroom-reservation-form-input"  
                value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className="bookingroom-reservation-form-label">
                Last Name:
                <input type="text" className="bookingroom-reservation-form-input"  
                value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label" >
                Email:
                <input type="email" className="bookingroom-reservation-form-input" 
                value={email}  onChange={(e) => setEmail(e.target.value)} required />
              </label>
            </div>
            <div className="bookingroom-form-row">
            <label className="bookingroom-reservation-form-label">
          Arrival Date & Time:
          <input 
            type="date" 
            className="bookingroom-reservation-form-input"
            name="arrival_date" 
            value={arrivalDate} 
            onChange={(e) => { setArrivalDate(e.target.value); handleDateChange(); }} 
            required 
          />
          <input 
            type="time" 
            className="bookingroom-reservation-form-input"  
            value={arrivalTime} 
            onChange={(e) => { setArrivalTime(e.target.value); handleDateChange(); }} 
            required  
          />
        </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Departure Date:
                <input 
                  type="date" 
                  className="bookingroom-reservation-form-input"
                  name="departure_date" 
                  value={departureDate} 
                  onChange={(e) => { setDepartureDate(e.target.value); handleDateChange(); }} 
            required 
                />
                <input 
                  type="time" 
                  className="bookingroom-reservation-form-input"  
                  value={departureTime} 
                  onChange={(e) => { setDepartureTime(e.target.value); handleDateChange(); }} 
            required 
                />
              </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Special Request:
                <textarea className="bookingroom-reservation-form-textarea" 
                placeholder="" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
              </label>
            </div>
            <div className="bookingroom-total-price">
            <span name="total_days">Total Days: {calculateTotalDays()}</span>
            <span id="grand_total">
              | Price: {formatCurrency(totalPrice)} VNĐ | Price: ${convertToUSD(totalPrice)}
            </span>
            </div>
            <button type="submit" className="bookingroom-reserva tion-form-button"
            onClick={handleReservation}>Reserve Now</button>
          </form>
        </div>
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
      </div>
       {/* Footer */}
       <footer className="footer-booking">
                <div className="footer-content">
                    <div className="footer-section about">
                        <h3>About Us</h3>
                        <p>Your go-to platform for convenient and affordable room bookings.</p>
                    </div>
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section social">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 BudgetWise Solutions | All rights reserved.</p>
                </div>
            </footer>
    </div>
  );
}


export default BookingRoom;