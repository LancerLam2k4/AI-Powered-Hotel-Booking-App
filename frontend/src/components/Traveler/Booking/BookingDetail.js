import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick"; // Import Slick Slider
import "./BookingDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState("room.png");
  const [roomDetails, setRoomDetails] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [RoomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const { roomId } = useParams();
  const [subImages, setSubImages] = useState([]);
  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };
  const navigate = useNavigate();

  const [error, setError] = useState(""); // Lưu lỗi nếu có

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/showDetail",
          {
            params: { roomId }, // Truyền roomId qua query string
          }
        );
        setRoom(response.data);
        setMainImage(response.data.main_image); // Đặt ảnh chính
        setSubImages(response.data.additional_images || []);
      } catch (err) {
        setError(
          "Error fetching room detail: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  if (error) return <div>{error}</div>; // Hiển thị lỗi nếu có
  if (!room) return <div>Loading...</div>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { currency: "VND" }).format(amount);
  };

  const handleBooking = (roomId) => {
    navigate(`/bookingRoom/${roomId}`);
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
    adaptiveHeight: true,
  };
  console.log(room.reviewsCore);
  return (
    <div className="room-detail-container">
      {/* Room Details Section */}
      <section id="roomdetails-room-detail" className="room-detail-section">
        <div className="room-detail-image">
          <div className="price-tag">{formatCurrency(room.price)} VNĐ/per night</div>

          {/* Use Slick Slider here */}
          <Slider {...settings}>
            {[mainImage, ...subImages].map((imgSrc, index) => (
              <div key={index} className="main-image-container-booking-detail">
                <img
                  src={imgSrc}
                  className="main-image-bookingDetail"
                  alt={`Room ${index === 0 ? "Main" : index}`}
                />
              </div>
            ))}
          </Slider>

          {/* Hiển thị các ảnh nhỏ bên dưới */}
          <div className="room-detail-small-images">
            {subImages.map((imgSrc, index) => (
              <div key={index} className="small-img-col-room-detail">
                <img
                  src={imgSrc}
                  className="small-img-room-detail"
                  width="100%"
                  alt="Room"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="room-detail-info">
          <h4>{room.name}</h4>
          <div className="room-booking-quantity">
            <button
              onClick={(id) => handleBooking(roomId)}
              className="room-book-button"
            >
              Book Now
            </button>
          </div>

          <h4>Room Details</h4>
          <p>
            This Deluxe King Room offers a luxurious experience with scenic
            views. Enjoy a relaxing stay with top-notch amenities and an elegant
            design that ensures comfort and style.
          </p>

          <div className="room-amenities">
            <h4>Room Features</h4>
            <ul>
              <li>
                <span className="icon-circle">&#10003;</span> Free Wi-Fi
              </li>
              <li>
                <span className="icon-circle">&#10003;</span> Air Conditioning
              </li>
              <li>
                <span className="icon-circle">&#10003;</span> King-sized Bed
              </li>
              <li>
                <span className="icon-circle">&#10003;</span> Flat-screen TV
              </li>
              <li>
                <span className="icon-circle">&#10003;</span> Room Service
              </li>
            </ul>
          </div>

          <div className="room-rating">
            <h4>Guest Rating</h4>
            <div className="rating-stars">
              <span>⭐⭐⭐⭐⭐</span>
              <span>({room.reviewsCore}/5 based on 120 reviews)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;
