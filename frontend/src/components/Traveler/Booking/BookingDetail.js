import React, {useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './BookingDetail.css';

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState('room.png');
  const [roomDetails, setRoomDetails] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [RoomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const {roomId} = useParams();
  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };
  const navigate = useNavigate();
  
  
  // const {room} = useParams();
  // console.log(room);
  
  // useEffect(() => {
  //   fetchRooms();
  // },[]);
  // Fetch room details from the database
  // useEffect(() => {
  //   const fetchRoomDetails = async () => {
  //     if (!roomId) return;
      
  //     try {
  //       const response = await axios.get(/api/rooms/${roomId});
  //       setRoomDetails(response.data.room);
  //     } catch (error) {
  //       console.error('Error fetching room details:', error);
  //     }
  //   };
  //   fetchRoomDetails();
  // }, [roomId]);

  const [error, setError] = useState(""); // Lưu lỗi nếu có

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

  if (error) return <div>{error}</div>; // Hiển thị lỗi nếu có
  if (!room) return <div>Loading...</div>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {  currency: 'VND' }).format(amount);
  };

  const handleBooking = (roomId) => {
    navigate(`/bookingRoom/${roomId}`);
    console.log(room);
  };
  return (
    <div>
      <header className="header-room-detail">
        <a href="#"><img src="logo.png" className="logo-room-detail" alt="Logo" /></a>
      </header>

      <section id="roomdetails-room-detail" className="section-p1-room-detail">
        <div className="single-room-image-room-detail">
          <img src={room.main_image} alt="Room" width="100%" id="mainImg-room-detail" />

          <div className="small-img-group-room-detail">
          <div>
        {room.additional_images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Additional ${index + 1}`}
            style={{ width: "200px", margin: "10px" }}
          />
        ))}
      </div>
          {/* <img src={room.main_image} alt="Main" />
            {['sub-room-1.png', 'sub-room-2.png', 'sub-room-3.png', 'sub-room-4.png'].map((imgSrc, index) => (
              <div>
              {room.additional_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Additional ${index + 1}`}
                  style={{ width: "200px", margin: "10px" }}
                />
              ))}
            </div>
            ))} */}
          </div>
        </div>

        <div className="single-room-details-room-detail">
          <h6 className="breadcrumbs-room-detail">Hotel / Room</h6>
          <h4>{room.name}</h4>
          <h2>{formatCurrency(room.price)} VNĐ</h2>

          <input 
            type="number" 
            min="1" 
            value={bookingQuantity}
            onChange={(e) => setBookingQuantity(parseInt(e.target.value))}
          />

          <button onClick={() => handleBooking(roomId)}>Book Now</button>

          <h4>Room Details</h4>
          <span>
            {room.description}
          </span>
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;