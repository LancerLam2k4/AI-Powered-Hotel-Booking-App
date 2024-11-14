import React, { useEffect, useState } from 'react';
import axios from 'axios';
import provincesData from '../../provinces.json';
import './Booking.css';
import ChatbotComponent from "../AI/BookingChatbox"
function Booking() {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({ price: '', type: '', amenities: [] });
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const banners = [
        'banner-booking-1.jpg',
        'banner-booking-2.jpg',
        'banner-booking-3.jpg'
    ];
    const prices = ['Below 1 million VND', '1-3 million VND', '3-5 million VND', 'Above 5 million VND'];
    const types = ['Single Room', 'Double Room', 'Suite', 'Apartment'];
    const amenities = ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym','Đầy Đủ Tiện Nghi'];

    // Slide banner every 3 seconds
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);
        return () => clearInterval(slideInterval);
    }, [banners.length]);

    // Fetch rooms whenever page or filters change
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
            if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
    
            params.page = currentPage;
    
            const response = await axios.get('http://localhost:8000/api/bookings', { params });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value || ''
        }));
    };

    // Handle province selection
    const handleProvinceChange = (e) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setSelectedDistrict('');
        setFilters(prevFilters => ({
            ...prevFilters,
            location: province,
        }));
    };

    // Handle district selection
    const handleDistrictChange = (e) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        setFilters(prevFilters => ({
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
        setFilters(prevFilters => {
            const updatedAmenities = prevFilters.amenities.includes(value)
                ? prevFilters.amenities.filter(amenity => amenity !== value)
                : [...prevFilters.amenities, value];
    
            if (value === 'Đầy Đủ Tiện Nghi') {
                return {
                    ...prevFilters,
                    amenities: [value]
                };
            }
    
            if (updatedAmenities.includes('Đầy Đủ Tiện Nghi')) {
                return {
                    ...prevFilters,
                    amenities: updatedAmenities.filter(amenity => amenity !== 'Đầy Đủ Tiện Nghi')
                };
            }
    
            return {
                ...prevFilters,
                amenities: updatedAmenities
            };
        });
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
                <select name="price" onChange={handleFilterChange}>
                    <option value="">Select Price</option>
                    {prices.map((price, index) => (
                        <option key={index} value={price}>{price}</option>
                    ))}
                </select>

                <select name="type" onChange={handleFilterChange}>
                    <option value="">Select Room Type</option>
                    {types.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>

                <div className="location-filter">
                    <select value={selectedProvince} onChange={handleProvinceChange}>
                        <option value="">Select Province</option>
                        {Object.keys(provincesData).map((province) => (
                            <option key={province} value={province}>{province}</option>
                        ))}
                    </select>

                    {selectedProvince && (
                        <select value={selectedDistrict} onChange={handleDistrictChange}>
                            <option value="">Select District</option>
                            {provincesData[selectedProvince].map((district) => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    )}
                </div>

                <select name="amenities" onChange={handleFilterChange}>
                    <option value="">Select Amenities</option>
                    {amenities.map((amenity, index) => (
                        <option key={index} value={amenity}>{amenity}</option>
                    ))}
                </select>
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
                                className="room-image-booking"
                            />
                            <div className="room-details-booking">
                                <h3>{room.name}</h3>
                                <p>{room.location}</p>
                                <p>{room.price}</p>
                                <p>{room.type}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination-booking">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={rooms.length <= currentPage * roomsPerPage}>
                    Next
                </button>
            </div>
            <ChatbotComponent />
        </div>
    );
}

export default Booking;
