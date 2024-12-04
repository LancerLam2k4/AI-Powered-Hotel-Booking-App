
import React, { useEffect, useState,useContext} from "react";

import axios from "axios";
import provincesData from "../../provinces.json";
import "./Booking.css";
import { useNavigate,useOutletContext } from "react-router-dom";
import { ChatContext } from "../AI/ChatContext";

function Booking() {
  const [roomslist, setRoomsList] = useState([]);
  const { rooms,setRooms} = useContext(ChatContext); // Lấy roomsForyou từ ChatContext
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setRooms(rooms);  // Cập nhật roomsList khi rooms được cập nhật
      console.log("Rooms have been updated in Booking:", rooms);
    }
  }, [rooms]); // Đặt roomsForyou vào dependencies để theo dõi sự thay đổi
  
  const [filters, setFilters] = useState({
    price: "",
    type: "",
    amenities: [],
  });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const banners = [
    "banner-booking-1.jpg",
    "banner-booking-2.jpg",
    "banner-booking-3.jpg",
  ];
  const prices = [
    "Below 1 million VND",
    "1-3 million VND",
    "3-5 million VND",
    "Above 5 million VND",
  ];
  const types = ["Single Room", "Double Room", "Suite", "Apartment"];
  const amenities = [
    "WiFi",
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Đầy Đủ Tiện Nghi",
  ];
  useEffect(() => {
    fetchRooms();
  }, [currentPage, filters]);
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const params = {};


      if (filters.price) params.price = filters.price;
      if (filters.type) params.type = filters.type;
      if (selectedProvince) params.province = selectedProvince;
      if (selectedDistrict) params.district = selectedDistrict;
      if (filters.amenities.length > 0)
        params.amenities = filters.amenities.join(",");

      params.page = currentPage;

      const response = await axios.get("http://localhost:8000/api/bookings", {
        params,
      });
      setRoomsList(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value || "",
    }));
  };

  // Handle province selection
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict("");
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: province,
    }));
  };


  // Handle district selection
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: `${selectedProvince}, ${district}`,
    }));
  };
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageClick = (room) => {
    console.log(room);
    navigate(`/bookingDetail/${room}`);
  };

  const roomsPerPage = 5;


  const scrollRight = () => {
    const container = document.querySelector('.room-for-you ul');
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };


  const RoomList = ({ roomslist, currentPage, roomsPerPage, isLoading, handleImageClick }) => {}
  return (
    <div className="booking-container">
  
      {/* Replace the slider with a single image and overlay text */}
      <div className="banner-image-booking">
        <div className="banner-text-overlay">
          <h1>Rooms & Suites</h1>
          <p>Find the best rooms at the best prices</p>
        </div>
      </div>
      {rooms && rooms.length > 0 && (
  <div className="room-for-you">
    <h2>Room For You</h2>
    <ul>
      {rooms.map((room, index) => (
        <div key={room.roomId} className="room-for-you-item-booking">
          <div className="room-for-you-image">
            <img
              src={`http://localhost:8000/${room.main_image || "default_image.jpg"}`}
              alt={room.name}
              className="room-for-you-image-booking"
            />
          </div>
          <div className="room-for-you-details">
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <div className="price-tag">
             <span className="price-tag-value">
                {room.price.toLocaleString('vi-VN')} VND
              </span>
            </div>

            <ul className="room-for-you-info">
              <li>Location: {room.district + ", " + room.province || ""}</li>
              <li>Category: {room.type || "Single"}</li>
            </ul>
            <button
              className="book-now-for-you"
              onClick={(id) => handleImageClick(room.roomId)}
            >
              More Detail!
            </button>
          </div>
        </div>
      ))}
    </ul>
    <div className="scroll-right"> &gt; </div>
  </div>
)}

      <div className="filters-booking">
        <select name="price" onChange={handleFilterChange}>
          <option value="">Select Price</option>
          {prices.map((price, index) => (
            <option key={index} value={price}>
              {price}
            </option>
          ))}
        </select>

        <select name="type" onChange={handleFilterChange}>
          <option value="">Select Room Type</option>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="location-filter">
          <select value={selectedProvince} onChange={handleProvinceChange}>
            <option value="">Select Province</option>
            {Object.keys(provincesData).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          {selectedProvince && (
            <select value={selectedDistrict} onChange={handleDistrictChange}>
              <option value="">Select District</option>
              {provincesData[selectedProvince].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="room-list-booking">
  {isLoading ? (
    <p>Loading rooms...</p>
  ) : (
    roomslist
      .slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage)
      .map((room) => (
        <div key={room.roomId} className="room-item-booking fade-in">
          <div className="room-image">
            <img
              src={room.main_image || "default_image.jpg"}
              alt={room.name}
              className="room-image-booking"
            />
            {/* Price Tag trên ảnh */}
            <span className="price-tag">
            {room.price?.toLocaleString("vi-VN")} VND
            </span>
          </div>
          <div className="room-details">
            <h2>{room.name}</h2>
            <p>
              Enjoy our classic suites with all the elegance and comfort
              that its interior has...
            </p>
            <div className="price-section">
            
            </div>
            <ul className="room-info">
              <li>Location: {room.location || ""}</li>
              <li>Size: {room.size || "35m²"}</li>
              <li>Category: {room.type || "Single"}</li>
            </ul>
            <button className="book-now" 
            onClick={(id) => handleImageClick(room.roomId)}>
              More Detail!
            </button>
          </div>
        </div>
      ))
  )}
</div>


      <div className="pagination-booking">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={roomslist.length <= currentPage * roomsPerPage}
        >
          Next
        </button>
      </div>
     
    </div>
  );

}

export default Booking;
