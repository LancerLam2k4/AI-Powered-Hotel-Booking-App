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
  const handleAmenitiesChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => {
      const updatedAmenities = prevFilters.amenities.includes(value)
        ? prevFilters.amenities.filter((amenity) => amenity !== value)
        : [...prevFilters.amenities, value];

      if (value === "Đầy Đủ Tiện Nghi") {
        return {
          ...prevFilters,
          amenities: [value],
        };
      }

      if (updatedAmenities.includes("Đầy Đủ Tiện Nghi")) {
        return {
          ...prevFilters,
          amenities: updatedAmenities.filter(
            (amenity) => amenity !== "Đầy Đủ Tiện Nghi"
          ),
        };
      }

      return {
        ...prevFilters,
        amenities: updatedAmenities,
      };
    });
  };
  const handleImageClick = () => {
    navigate("/room-detail");
  };

  const roomsPerPage = 5;

  return (
    <div className="booking-container">
      <header className="header-container">
        <div className="header-container">
          <div className="logo-container">
            <img src="logo3.png" alt="Logo1" className="logo1" />
          </div>

          <div className="nav-links">
            <ul>
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="">About</a>
              </li>
              <li>
                <a href="">Services</a>
              </li>
              <li>
                <a href="">Contact</a>
              </li>
            </ul>
          </div>
          <button className="booking-button">
            <span className="material-icons">shopping_cart</span>
          </button>
        </div>
      </header>
      {/* Replace the slider with a single image and overlay text */}
      <div className="banner-image-booking">
        <div className="banner-text-overlay">
          <h1>Rooms & Suites</h1>
          <p>Find the best rooms at the best prices</p>
        </div>
      </div>
      <div className="room-for-you">
        <h2>Room For You</h2>
        {rooms && rooms.length > 0 ? (
          <ul>
            {rooms.map((room, index) => (
              <div key={room.roomId} className="room-item-booking">
              <div className="room-image">
                <img
                  src={'http://localhost:8000/'+room.main_image || "default_image.jpg"}
                  alt={room.name}
                  className="room-image-booking"
                />
              </div>
              <div className="room-details">
                <h2>{room.name}</h2>
                <p>
                  Enjoy our classic suites with all the elegance and comfort
                  that its interior has...
                </p>
                <div className="price-section">
                  <span className="price-label">Prices start at</span>
                  <span className="price-value price-highlight">
                    {room.price}
                  </span>
                  <span className="price-unit">/per night</span>
                </div>
                <ul className="room-info">
                  <li>Location: {room.rocation || ""}</li>
                  <li>Size: {room.size || "35m²"}</li>
                  <li>Category: {room.type || "Single"}</li>
                </ul>
                <button className="book-now" onClick={handleImageClick}>
                  More Detail!
                </button>
              </div>
            </div>
            ))}
          </ul>
        ) : (
          <p>Không có phòng nào được gợi ý!</p>
        )}
      </div>



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

        <select name="amenities" onChange={handleFilterChange}>
          <option value="">Select Amenities</option>
          {amenities.map((amenity, index) => (
            <option key={index} value={amenity}>
              {amenity}
            </option>
          ))}
        </select>
      </div>

      <div className="room-list-booking">
        {isLoading ? (
          <p>Loading rooms...</p>
        ) : (
          roomslist
            .slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage)
            .map((room) => (
              <div key={room.roomId} className="room-item-booking">
                <div className="room-image">
                  <img
                    src={room.main_image || "default_image.jpg"}
                    alt={room.name}
                    className="room-image-booking"
                  />
                </div>
                <div className="room-details">
                  <h2>{room.name}</h2>
                  <p>
                    Enjoy our classic suites with all the elegance and comfort
                    that its interior has...
                  </p>
                  <div className="price-section">
                    <span className="price-label">Prices start at</span>
                    <span className="price-value price-highlight">
                      {room.price}
                    </span>
                    <span className="price-unit">/per night</span>
                  </div>
                  <ul className="room-info">
                    <li>Location: {room.rocation || ""}</li>
                    <li>Size: {room.size || "35m²"}</li>
                    <li>Category: {room.type || "Single"}</li>
                  </ul>
                  <button className="book-now" onClick={handleImageClick}>
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
      {/* Footer */}
      <footer className="footer-booking">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              Your go-to platform for convenient and affordable room bookings.
            </p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
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

export default Booking;
