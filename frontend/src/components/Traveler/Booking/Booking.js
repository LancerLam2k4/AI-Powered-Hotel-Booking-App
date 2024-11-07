import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Booking.css';

function Booking() {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({ price: '', type: '', locate: '', amenities: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const banners = [
        'banner-booking-1.jpg',
        'banner-booking-2.jpg',
        'banner-booking-3.jpg'
    ];
    const locations = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Nha Trang']; // Example locations

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);
        return () => clearInterval(slideInterval);
    }, [banners.length]);

    useEffect(() => {
        fetchRooms();
    }, [currentPage]);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/bookings`, {
                params: { ...filters, page: currentPage }
            });
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

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page for a new search
        fetchRooms();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const roomsPerPage = 12;

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
                <select name="locate" onChange={handleFilterChange}>
                    <option value="">Select Location</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>
                <input type="text" name="amenities" placeholder="Amenities" onChange={handleFilterChange} />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            <div className="room-list-booking">
                {isLoading ? (
                    <p>Loading rooms...</p>
                ) : (
                    rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage).map((room) => (
                        <div key={room.roomId} className="room-item-booking">
                            <img
                                src={room.main_image || 'default_image.jpg'}
                                alt={room.name}
                                onClick={() => handleImageClick(room.roomId)}
                            />
                            <p>{room.name}</p>
                            <p>{room.price} VND</p>
                            <button>Book Now</button>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination-booking">
                {[...Array(Math.ceil(rooms.length / roomsPerPage))].map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Booking;
