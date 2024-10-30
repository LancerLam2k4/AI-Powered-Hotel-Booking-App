import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Booking.css';

function Booking() {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({ price: '', type: '', amenities: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = [
        'banner-booking-1.jpg',  // Thay bằng URL ảnh của bạn
        'banner-booking-2.jpg',
        'banner-booking-3.jpg'
    ];

    useEffect(() => {
        // Tự động chuyển ảnh banner sau mỗi 3 giây
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);  // 3 giây

        return () => clearInterval(slideInterval);  // Dọn dẹp interval khi component unmount
    }, [banners.length]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [filters, currentPage]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`/api/bookings`, {
                params: { ...filters, page: currentPage }
            });
            setRooms(response.data.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchRoomDetails = async (id) => {
        try {
            const response = await axios.get(`/api/bookings/${id}`);
            setSelectedRoom(response.data);
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleImageClick = (id) => {
        fetchRoomDetails(id);
    };

    const handleCloseDetails = () => {
        setSelectedRoom(null);
    };

    return (
        <div className="booking-container">
            <div className="banner-slider">
                {banners.map((image, index) => (
                    <div
                        key={index}
                        className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                ))}
            </div>

            <div className="filters">
                <input type="text" name="price" placeholder="Price" onChange={handleFilterChange} />
                <input type="text" name="type" placeholder="Type" onChange={handleFilterChange} />
                <input type="text" name="amenities" placeholder="Amenities" onChange={handleFilterChange} />
            </div>

            <div className="room-list">
                {rooms.map((room) => (
                    <div key={room.id} className="room-item">
                        <img
                            src={room.main_image} // URL ảnh từ JSON hoặc database
                            alt={room.name}
                            onClick={() => handleImageClick(room.id)}
                        />
                        <p>{room.name}</p>
                        <p>{room.price} VND</p>
                        <button>Book Now</button>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {[...Array(5)].map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                ))}
            </div>

            {selectedRoom && (
                <div className="room-details-modal">
                    <div className="room-details-content">
                        <span className="close-button" onClick={handleCloseDetails}>&times;</span>
                        <h2>{selectedRoom.name}</h2>
                        <img src={selectedRoom.main_image} alt={selectedRoom.name} />
                        <p>Price: {selectedRoom.price} VND</p>
                        <p>Type: {selectedRoom.type}</p>
                        <p>Amenities: {selectedRoom.amenities}</p>
                        <p>Description: {selectedRoom.description}</p>
                        {/* Thêm thông tin khác nếu cần */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Booking;
