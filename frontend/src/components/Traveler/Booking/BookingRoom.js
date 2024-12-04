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
  // Thiết lập ngày hiện tại
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setArrivalDate(currentDate);
  }, []);

  const images = [
    "sub-room-2.png",
    "sub-room-3.png",
    "sub-room-4.png",
  ];
  const handleReservation = async (e) => {
    e.preventDefault();
  
    // Chuẩn bị dữ liệu đặt phòng
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
      totalPrice: calculateTotalPrice(), // Tổng giá
      totalDays: calculateTotalDays(),  // Tổng số ngày
      
    };
  
    try {
      setIsSubmitting(true);
  
      // **Bước 1: Gửi yêu cầu đặt phòng (Reservation) đến backend**
      const reservationResponse = await axios.post(
        'http://localhost:8000/api/reserve-room',
        reservationData
      );
  
      if (reservationResponse.data.success) {
        console.log('Reservation successful:', reservationResponse.data);
  
        // **Bước 2: Tạo thanh toán PayPal**
        axios.post('http://localhost:8000/api/payment', {
          roomId: roomId,
          totalPrice:totalPrice // Gửi id đến backend
      })
      .then(response => {
          if (response.data.success) {
              window.location.href = response.data.paymentUrl; // Chuyển hướng đến PayPal
          }
      })
      .catch(error => {
          console.error('Error creating payment:', error);
      });
  
      } else {
        alert('Reservation failed: ' + reservationResponse.data.message);
      }
    } catch (err) {
      setError('There was an error with your reservation or payment.');
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
    const pricePerNight = 20;
    const totalDays = calculateTotalDays();
    return pricePerNight * totalDays;
  };
  const exchangeRate = 23000; // VND to USD exchange rate

  const convertToUSD = (vndPrice) => {
    return (vndPrice / exchangeRate).toFixed(2); // Convert and format as USD
  };
  const handleImageClick = (imgSrc) => {
    console.log("Image clicked:", imgSrc);
    // Thực hiện hành động khi nhấn vào ảnh, ví dụ:
    // - Cập nhật ảnh hiển thị lớn
    // - Lưu đường dẫn hình ảnh đã chọn
  };

  return (
    
    <div className="bookingroom-container">

    <div className="sochi-container">
  <div className="sochi-main-image">
    <img src="bg-login.png" alt="Main Hotel Image" className="sochi-main-image-img" />
    <div className="sochi-text-overlay">
      <h1>Hello. Salut. Hola</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <button>MORE INFO</button>
    </div>
  </div>
  <div className="sochi-side-images">
  {['bg-register.png', 'bg-login.png', 'bg-login.png', 'bg-login.png'].map((imgSrc, index) => (
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
          {/* Phần hình ảnh chi tiết phòng */}
  {/* <div className="bookingroom-room-images">
    <div className="room-detail-small-images">
      {['bg-login.png', 'bg-login.png', 'bg-login.png', 'bg-login.png'].map((imgSrc, index) => (
        <div key={index} className="small-img-col-room-detail" onClick={() => handleImageClick(imgSrc)}>
          <img src={imgSrc} className="small-img-room-detail" width="100%" alt="Room" />
        </div>
      ))}
    </div>
  </div> */}
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
          <p className="price">Total Price : {new Intl.NumberFormat('vi-VN', {currency: 'VND' }).format(calculateTotalPrice() * 23000)} VND</p>
          <p className="price-usd">Price Conversion: {convertToUSD(calculateTotalPrice() * 23000)} USD</p>
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
            <img src="2.jpg" alt="Hotel View" />
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default BookingRoom;
