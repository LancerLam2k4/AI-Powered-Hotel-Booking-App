import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeProfile.css';
import { useNavigate } from 'react-router-dom';

const HomeProfile = () => {
    const navigate = useNavigate();
    // State variables for user profile data
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [personId, setPersonId] = useState('');
    const [avatar, setAvatar] = useState('profile_icon.png');
    const [history, setHistory] = useState('');
    const [hobby, setHobby] = useState('');
    const [isEditing, setIsEditing] = useState({ password: false, personId: false });
    const [isLoading, setIsLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('Not set');
    const [address, setAddress] = useState('Not set');

    // Fetch user profile data from the server
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const currentUserResponse = await axios.get('http://localhost:8000/api/getCurrentUserId');
                const userId = currentUserResponse.data.user_id;
                
                if (!userId) {
                    throw new Error('No user ID found');
                }

                const profileResponse = await axios.get(`http://localhost:8000/api/profile/${userId}`);
                const data = profileResponse.data;
                
                // Set the state with the fetched data
                setName(data.name);
                setId(data.id);
                setEmail(data.email);
                setPassword(data.password);
                setPersonId(data.person_id);
                setAvatar(data.avatar || 'profile_icon.png');
                setHistory(data.search_history);
                setHobby(data.preferences || data.hobby || 'Not set');
                setPhoneNumber(data.phone_number || 'Not set');
                setAddress(data.address || 'Not set');
            } catch (error) {
                console.error("Error fetching profile:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditBasicInfo = () => {
        navigate('/edit-basic-info');
      };

     // Toggle edit mode and save the changes
     const handleEditPassword = async () => {
        if (isEditing.password) {
            let currentUserResponse;  // Declare outside try block so it's accessible in catch
            try {
                // Get the current user ID
                currentUserResponse = await axios.get('http://localhost:8000/api/getCurrentUserId');
                const userId = currentUserResponse.data.user_id;

                // Send update request to backend
                await axios.put(`http://localhost:8000/api/profile`, {
                    password: password
                });

                // Show success message
                alert('Password updated successfully');
                
                // Reset password display to masked version
                setPassword('********');
            } catch (error) {
                console.error("Error updating password:", error);
                alert('Failed to update password. Please try again.');
                
                if (currentUserResponse?.data?.user_id) {
                    // Optionally revert the password to its previous value
                    const profileResponse = await axios.get(`http://localhost:8000/api/profile/${currentUserResponse.data.user_id}`);
                    setPassword(profileResponse.data.password);
                }
            }
        }
        // Toggle edit mode
        setIsEditing(prev => ({ ...prev, password: !prev.password }));
    };
   
    const handleEditPersonId = async () => {
        if (isEditing.personId) {
            try {
                await axios.put('http://localhost:8000/api/profile', { person_id: personId });
                alert('Person ID updated successfully');
            } catch (error) {
                console.error("Error updating person ID:", error);
            }
        }
        setIsEditing(prev => ({ ...prev, personId: !prev.personId }));
    };

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className='home-profile'>
            <div className="profile-container">
                {/* Profile Picture */}
                <div className="profile-picture">
                    <img src={avatar} alt="Profile" /> {/* Display user's avatar */}
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
                        <p>{phoneNumber}</p>
                    </div>
                    <div className="info-field">
                        <label>Address:</label>
                        <p>{address}</p>
                    </div>
                    <div className="info-field">
                        <label>Hobby:</label>
                        <p>{hobby}</p>
                    </div>
                    <button onClick={handleEditBasicInfo} className="edit-button1">Update</button>
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
                                type="text"
                                value={personId}
                                onChange={(e) => setPersonId(e.target.value)}
                            />
                        ) : (
                            <p>{personId}</p>
                        )}
                        {/* <button className="edit-button3" onClick={handleEditPersonId}>
                            {isEditing.personId ? 'Save' : 'Edit'}
                        </button> */}
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
