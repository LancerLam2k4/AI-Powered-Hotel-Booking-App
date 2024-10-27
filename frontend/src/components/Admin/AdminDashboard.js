import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch rooms data from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rooms'); // Adjust API route
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  // Search function (based on Room number, type, or amenities)
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/api/rooms/search?q=${searchQuery}`);
      setRooms(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Add, Edit, Delete functionality placeholders
  const handleAddRoom = () => {
    navigate('/add-room');
  };

  const handleEditRoom = (roomId) => {
    // Implement edit room logic here
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      // Implement delete logic here
    }
  };

  // Rating stars rendering logic
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {Array(fullStars).fill('⭐').map((star, index) => <span key={index}>{star}</span>)}
        {halfStar && <span>⭐</span>}
        {Array(emptyStars).fill('☆').map((star, index) => <span key={index}>{star}</span>)}
      </>
    );
  };

  const [showRooms, setShowRooms] = useState(false); // State to control Rooms Management visibility

  const handleRoomsClick = () => {
    setShowRooms(!showRooms); // Toggle Rooms Management visibility
  };

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <header className="header">
        <img src="Logo.png" alt="Logo" className="logo" />
        <label>Group 5</label>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by Room number, type, or amenities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <img src="searchbtn.png" alt="Search" />
          </button>
        </div>
        <img src="profile_icon_admin.png" alt="Profile Icon" className="profile-icon" />
      </header>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <button className="nav-btn">Statistical</button>
        <button className="nav-btn">User</button>
        <button className="nav-btn" onClick={handleRoomsClick}>Rooms</button>
        <button className="nav-btn">Feedback Management</button>
        <button className="nav-btn logout-btn">Log out</button>
      </nav>

      {/* Rooms Management Section */}
      <div className="rooms-management-box">
        <div className="rooms-management-title">Rooms Management</div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Room number</th>
                <th>Room type</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Amenities</th>
                <th>Rating</th>
                <th>Image</th>
                <th><button onClick={handleAddRoom} className="add-room-btn">ADD ROOM</button></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_id}</td>
                  <td>{room.type}</td>
                  <td>${room.price}</td>
                  <td>{room.availability ? 'Available' : 'Not Available'}</td>
                  <td>{room.amenities}</td>
                  <td>{renderStars(room.rating)}</td>
                  <td><img src={room.image_url} alt="Room" width="100" height="80" /></td>
                  <td>
                    <div className="table-buttons">
                      <img src="editbtn.png" alt="Edit" className="edit-room-icon" onClick={() => handleEditRoom(room.room_id)} />
                      <img src="deletebtn.png" alt="Delete" className="delete-room-icon" onClick={() => handleDeleteRoom(room.room_id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-adminDashboard">
        Developed by Group 5
      </footer>
    </div>
  );
};

export default AdminDashboard;
