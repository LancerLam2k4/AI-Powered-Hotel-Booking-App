import React, { useState } from 'react';
import axios from 'axios';
import './HomeProfile.css';

const HomeProfile = () => {
    // State variables (initialize them as needed)
    const [name, setName] = useState("John Doe"); // Example placeholder
    const [id, setId] = useState("12345"); // Example placeholder
    const [email, setEmail] = useState("john.doe@example.com"); // Example placeholder
    const [password, setPassword] = useState("password123"); // Example placeholder
    const [personId, setPersonId] = useState("67890"); // Example placeholder
    const [isEditing, setIsEditing] = useState({ password: false, personId: false });
    const [history, setHistory] = useState("Some history information."); // Example placeholder

    const handleEditPassword = () => {
        setIsEditing((prev) => ({ ...prev, password: !prev.password }));
        // Add any additional logic for saving the password here
    };

    const handleEditPersonId = () => {
        setIsEditing((prev) => ({ ...prev, personId: !prev.personId }));
        // Add any additional logic for saving the person ID here
    };

    return (
      <div className='home-profile'>
        <div className="profile-container">
            {/* Profile Picture */}
            <div className="profile-picture">
                <img src="profile-placeholder.png" alt="Profile" />
            </div>

            {/* User Information */}
            <div className="user-info">
                <h2>{name}</h2>
                <div className="info-field">
                    <label>ID:</label>
                    <p>{id}</p>
                </div>
                <div className="info-field">
                    <label>Email:</label>
                    <p>{email}</p>
                </div>
                <div className="info-field">
                    <label>PhoneNumber:</label>
                    <p>Some text</p>
                </div>
                <div className="info-field">
                    <label>Address:</label>
                    <p>Some text</p>
                </div>
                <div className="info-field">
                    <label>Hobby:</label>
                    <p>Some text</p>
                </div>
                <button className="edit-button1">Update</button>
            </div>

            {/* Password and Person ID with Edit Options */}
            <div className="password-section">
                <div className="info-field">
                    <label>Password:</label>
                    {isEditing.password ? (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    ) : (
                        <p>{password}</p>
                    )}
                    <button className="edit-button2" onClick={handleEditPassword}>
                        {isEditing.password ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="info-field">
                    <label>Person ID:</label>
                    {isEditing.personId ? (
                        <input
                            type="personid"
                            value={personId}
                            onChange={(e) => setPersonId(e.target.value)}
                        />
                    ) : (
                        <p>{personId}</p>
                    )}
                    <button className="edit-button3" onClick={handleEditPersonId}>
                        {isEditing.personId ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>
            {/* History Section */}
            <div className="history-section">
                <h3>History</h3>
                <p>{history}</p>
                <button className="read-more-button">Read More</button>
            </div>
        </div>
      </div>
        
    );
};

export default HomeProfile;
