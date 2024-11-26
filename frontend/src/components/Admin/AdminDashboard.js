import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch rooms data from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/bookingDetails'); // Adjust API route
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

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    navigate('/edit-room', { state: { room } });
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/rooms/${roomId}`);
        
        if (response.data.message) {
          // Update the local state to remove the deleted room
          setRooms(prevRooms => prevRooms.filter(room => room.roomId !== roomId));
          alert('Room deleted successfully');
        }
      } catch (error) {
        console.error('Failed to delete room:', error);
        alert('Failed to delete room: ' + (error.response?.data?.error || error.message));
      }
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
                <th>Description</th>
                <th>Rating</th>
                <th>Image</th>
                <th><button onClick={handleAddRoom} className="add-room-btn">ADD ROOM</button></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <tr key={room.roomId || index}>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>${room.price}</td>
                    <td>{room.status ? 'Available' : 'Not Available'}</td>
                    <td>{room.description || 'No description'}</td>
                    <td>{room.rating}</td>
                    <td>
                      {room.main_image ? (
                        <img
                          src={`http://localhost:8000/${room.main_image}`}
                          alt="Room"
                          width="100"
                          height="80"
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td>
                      <div className="table-buttons">
                        <img
                          src="editbtn.png"
                          alt="Edit"
                          className="edit-icon"
                          onClick={() => handleEditRoom(room)}
                          style={{ cursor: 'pointer' }}
                        />
                        <img
                          src="deletebtn.png"
                          alt="Delete"
                          className="delete-icon"
                          onClick={() => handleDeleteRoom(room.roomId)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No rooms available</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-admin-dashboard">
        Developed by Group 5
      </footer>
    </div>
  );
};

export default AdminDashboard;