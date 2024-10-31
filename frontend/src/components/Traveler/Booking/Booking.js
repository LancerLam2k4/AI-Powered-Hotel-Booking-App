import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Booking.css';

function Booking() {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({ price: '', type: '', amenities: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
    const banners = [
        'banner-booking-1.jpg',
        'banner-booking-2.jpg',
        'banner-booking-3.jpg'
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, [banners.length]);

    useEffect(() => {
        fetchRooms();
    }, [filters, currentPage]);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/bookings`, {
                params: { ...filters, page: currentPage }
            });
            console.log(response.data);
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = (roomId) => {
        console.log("Room ID clicked:", roomId);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="booking-container">
            <div className="banner-slider-booking">
                {banners.map((image, index) => (
                    <div
                        key={index}
                        className={`banner-slide-booking ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                ))}
            </div>

            <div className="filters-booking">
                <input type="text" name="price" placeholder="Price" onChange={handleFilterChange} />
                <input type="text" name="type" placeholder="Type" onChange={handleFilterChange} />
                <input type="text" name="amenities" placeholder="Amenities" onChange={handleFilterChange} />
            </div>

            <div className="room-list-booking">
                {isLoading ? (
                    <p>Loading rooms...</p>
                ) : (
                    rooms.slice((currentPage - 1) * 12, currentPage * 12).map((room) => ( // Hiển thị tối đa 12 phòng (3x4)
                        <div key={room.id} className="room-item-booking">
                            <img
                                src={room.main_image || 'default_image.jpg'}
                                alt={room.name}
                                onClick={() => handleImageClick(room.id)}
                            />
                            <p>{room.name}</p>
                            <p>{room.price} VND</p>
                            <button>Book Now</button>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination-booking">
                {[...Array(Math.ceil(rooms.length / 12))].map((_, index) => ( // Cập nhật số trang dựa vào dữ liệu
                    <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                ))}
            </div>
        </div>
    );
}

export default Booking;
