import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Top Section */}
      <div className="top-section">
        <img src="Logo.png" alt="Logo" className="logo" />
        <label>Group 5</label>
        <input type="text" className="search-bar" placeholder="Search..." />
        <img src="profile_icon_admin.png" alt="Profile Icon" className="profile-icon" />
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <button className="sidebar-btn">Statistical</button>
        <button className="sidebar-btn">User</button>
        <button className="sidebar-btn">Rooms</button>
        <button className="sidebar-btn">Feedback Management</button>
        <button className="sidebar-btn logout-btn">Log out</button>
      </div>

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
                <th>Image</th>
                <th>
                <button className="add-button">Add</button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>Single</td>
                <td>$50</td>
                <td><img src="/room.png" alt="Room Image" width="180" height="150" /></td>
                <td>
                  <div className="table-buttons">
                    <button className="edit-button">Edit</button> {/* Edit Button */}
                    <button className="delete-button">Delete</button> {/* Delete Button */}
                  </div>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
