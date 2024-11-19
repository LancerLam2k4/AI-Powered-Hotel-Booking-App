import React, { useEffect, useState } from 'react';
import axios from 'axios';
import provincesData from '../../provinces.json';
import './Booking.css';
import { useNavigate } from 'react-router-dom';

function Booking() {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({ price: '', type: '', amenities: [] });
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    const banners = [
        'banner-booking-1.jpg',
        'banner-booking-2.jpg',
        'banner-booking-3.jpg'
    ];
    const prices = ['Below 1 million VND', '1-3 million VND', '3-5 million VND', 'Above 5 million VND'];
    const types = ['Single Room', 'Double Room', 'Suite', 'Apartment'];
    const amenities = ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym','Đầy Đủ Tiện Nghi'];

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
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > Math.ceil(rooms.length / roomsPerPage)) return;
        setCurrentPage(pageNumber);
    };
    const renderPageNumbers = () => {
        const pageCount = Math.ceil(rooms.length / roomsPerPage);
        const pageNumbers = [];
    
        // Xây dựng các số trang, có thể cần phải giới hạn số trang hiển thị
        for (let i = 1; i <= pageCount; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`page-number ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
    
        return pageNumbers;
    }
    
    const handleImageClick = () => {
        navigate('/room-detail');
      };
    
    const roomsPerPage = 2;


    return (
            <div className="booking-container">
                    <header className="header-container">
        <div className="header-container">
        <div className="logo-container">
            <img src="logo3.png" alt="Logo1" className="logo1" />
        </div>

        <div className="nav-links">
            <ul>
            <li><a href="">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Services</a></li>
            <li><a href="">Contact</a></li>
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
            </div>

            <div className="room-list-booking">
    {isLoading ? (
        <p>Loading rooms...</p>
    ) : (
        rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage).map((room) => (
            <div key={room.roomId} className="room-item-booking">
                <div className="room-image" >
                    <img
                        src={room.main_image || 'default_image.jpg'}
                        alt={room.name}
                        className="room-image-booking"
                    />
                </div>
                <div className="room-details">
                    <h2>{room.name}</h2>
                    <p>Enjoy our classic suites with all the elegance and comfort that its interior has...</p>
                    <div className="price-section">
                    <span className="price-label">Prices start at:</span>
                    <span className="price-value price-highlight">{new Intl.NumberFormat('vi-VN', {currency: 'VND' }).format(room.price)} vnđ</span>

                    <span className="price-unit">/per night</span>
                    </div>
                    <ul className="room-info">
                        <li>Location: {room.rocation || ''}</li>
                        <li>Size: {room.size || '35m²'}</li>
                        <li>Category: {room.type || 'Single'}</li>
                    </ul>
                    <button className="book-now"onClick={handleImageClick}>More Detail!</button>
                </div>
            </div>
        ))
    )}
    </div>
            <div className="pagination-booking">
            <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}>
        Previous
    </button>

    {/* Hiển thị số trang */}
    {renderPageNumbers()}

    <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === Math.ceil(rooms.length / roomsPerPage)}>
        Next
    </button>
            </div>
                    {/* Footer */}
                    <footer className="footer-booking">
            <div className="footer-container">
                
                <div className="footer-logo-desc">
                   <img src="logo3.png" alt="Logo1" className="logo1" />
                    <p>
                        A boutique experience in Indianapolis with luxurious rooms, exemplary service, and a prime location.
                    </p>
                </div>

            
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>410 S Missouri St, Indianapolis, IN</p>
                    <p>Phone: +3(123) 789-5789</p>
                    <p>Email: <a href="mailto:info@modernhotel.com">info@modernhotel.com</a></p>
                </div>

                
                <div className="footer-social">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://google.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-google"></i>
                </a>
            
            </div>
        </div>
    </div>

    
    <div className="footer-bottom">
        <p>&copy; 2024 Modern Hotel. All Rights Reserved. <a href="#">Privacy Policy</a></p>
    </div>
</footer>
        </div>
        
    );
}

export default Booking;
