import React, { useState, useEffect} from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './BookingRoom.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]); 
  const [roomInfor, setRoomInfor] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [subImages, setSubImages] = useState([]);
  const [mainImage, setMainImage] = useState();
  const [notification, setNotification] = useState(null);
  // Thiết lập ngày hiện tại
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setArrivalDate(currentDate);
  }, []);
  useEffect(() => {
    const fetchRoomImages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/showDetail",
          {
            params: { roomId },
          }
        );
        setRoom(response.data);
        setSubImages(response.data.additional_images)
        setMainImage(response.data.main_image)
      } catch (err) {
        setError(
          "Error fetching room detail: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    };
    fetchRoomImages();
  }, [roomId]);
  useEffect(() => {
    // Check for URL parameters that might contain messages
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (message) setNotification({ type: 'info', message });
    if (success) setNotification({ type: 'success', message: success });
    if (error) setNotification({ type: 'error', message: error });

    // Clear notification after 5 seconds
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  if (!room) return <div>Loading...</div>;
  const handleReservation = async (e) => {
    e.preventDefault();
  
    // Calculate the total price first
    const calculatedTotalPrice = convertToUSD(calculateTotalPrice()); // Convert to USD since PayPal expects USD
  
    // Prepare reservation data
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
      totalPrice: calculateTotalPrice(), // VND price for reservation
      totalDays: calculateTotalDays(),
    };
  
    try {
      setIsSubmitting(true);
  
      // Step 1: Create reservation
      const reservationResponse = await axios.post(
        'http://localhost:8000/api/reserve-room',
        reservationData
      );
  
      if (reservationResponse.data.success) {
        console.log('Reservation successful:', reservationResponse.data);
  
        // Step 2: Create PayPal payment with USD amount
        const paymentResponse = await axios.post('http://localhost:8000/api/payment', {
          roomId: roomId,
          totalPrice: calculatedTotalPrice // Send USD amount
        });
  
        if (paymentResponse.data.success) {
          window.location.href = paymentResponse.data.paymentUrl;
        } else {
          throw new Error(paymentResponse.data.message);
        }
      } else {
        alert('Reservation failed: ' + reservationResponse.data.message);
      }
    } catch (err) {
      setError('There was an error with your reservation or payment: ' + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const calculateTotalDays = () => {
    if (!arrivalDate || !departureDate) return 0;
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    const timeDifference = end - start;
    return timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : 0;
  };

  const calculateTotalPrice = () => {
    const pricePerNight = room.price;
    const totalDays = calculateTotalDays();
    return pricePerNight * totalDays;
  };
  const exchangeRate = 23000; // VND to USD exchange rate

  const convertToUSD = (vndPrice) => {
    return (vndPrice / exchangeRate).toFixed(2); // Convert and format as USD
  };
  return (
    
    <div className="bookingroom-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    <div className="sochi-container">
  <div className="sochi-main-image">
    <img src={room.main_image} alt="Main Hotel Image" className="sochi-main-image-img" />
    <div className="sochi-text-overlay">
      <h1>Hello. Salut. Hola</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <button>MORE INFO</button>
    </div>
  </div>
  <div className="sochi-side-images">
  {subImages.map((imgSrc, index) => (
    <img
      key={index}
      src={imgSrc}
      alt={`Small Image ${index + 1}`}
      className="sochi-side-image"
    />
  ))}
</div>
</div>
<div className="booking-separator"></div>
      <div className="bookingroom-side-by-side">
        <div className="bookingroom-reservation-section">
          <form className="bookingroom-reservation-form-container" onSubmit={handleReservation}>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                First Name
                <input type="Name" className="bookingroom-reservation-form-input"  value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
          
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Last Name
                <input type="LastName" className="bookingroom-reservation-form-input"  value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
          
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Email <span>(*Write your email address*)</span>
                <input type="reservation-email" className="bookingroom-reservation-form-input"  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Arrival Date & Time:
                <input type="date" className="bookingroom-reservation-form-input" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
              </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Departure Date & Time:
                <input type="date" className="bookingroom-reservation-form-input" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                
              </label>
            </div>
            <div className="bookingroom-form-row">
              <label className="bookingroom-reservation-form-label">
                Special Request:
                <textarea className="bookingroom-reservation-form-textarea" placeholder="" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
              </label>
            </div>
            <div className="bookingroom-total-price">
    
          <p>Total Days: {calculateTotalDays()}</p>
          <p className="price">Total Price : {new Intl.NumberFormat('vi-VN', {currency: 'VND' }).format(calculateTotalPrice())} VND</p>
          <p className="price-usd">Price Conversion: {convertToUSD(calculateTotalPrice())} USD</p>
            </div>
            <button type="submit" className="bookingroom-reservation-form-button" onClick={handleReservation}>Reserve Now
            </button>
          </form>
        </div>
      </div>
                    {/* Section mới ở đây */}
      <section className="section-two-2">
        <div className="section-two-container-2">
          <div className="section-two-content-2">
           
            <h1 className="section-two-title">Hotel Rules</h1>
            <p className="section-two-description-2">
            <li>Check-in: after 3 PM.</li>
            <li>Check-out: before 11 AM.</li>
            <li>Pets allowed; please notify in advance.</li>
            <li>No smoking indoors; only in designated outdoor areas.</li>
            <li>Quiet hours: 12 PM to 7 AM.</li>
            <li>Please contact staff if you need assistance.</li>
            </p>
            <button className="section-two-btn-2">Read More</button>
          </div>
          <div className="section-two-image-2">
            
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default BookingRoom;


