// UpdateProfile.js
import React, { useState, useEffect } from 'react';
import './EditBasicInfo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBasicInfo = ({ onClose }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [hobby, setHobby] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

    // Fetch current user data when component mounts
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUserResponse = await axios.get('http://localhost:8000/api/getCurrentUserId');
                const userId = currentUserResponse.data.user_id;
                
                const profileResponse = await axios.get(`http://localhost:8000/api/profile/${userId}`);
                const data = profileResponse.data;
                
                setName(data.name);
                setEmail(data.email);
                setPhoneNumber(data.phone_number || '');
                setAddress(data.address || '');
                setHobby(data.preferences || data.hobby || '');
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    const onSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone_number', phoneNumber);
            formData.append('address', address);
            formData.append('hobby', hobby);
            
            if (profilePicture) {
                formData.append('profile_picture', profilePicture);
            }

            await axios.post('http://localhost:8000/api/profile/basic-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Profile updated successfully');
            navigate('/traveler-profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGoBack = () => {
        navigate('/traveler-profile');
      };

    return (
        <div className='updateprofile page'>
            <div className="modal-content">
                <h2>Update Profile</h2>
                {/* Profile Picture Upload */}
                <div className="profile-picture-upload">
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="profile-preview" />
                    ) : (
                        <div className="profile-placeholder">No Image</div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <label className="label-name-editBasicInfo">Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />

                <label className="label-email">Email</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <label className="label-phone">Phone</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <label className="label-address">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

                <label className="label-hobby">Hobby</label>
                <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} />

                <button onClick={onSave} className='update'>Update</button>
                <button onClick={handleGoBack} className='close'>Close</button>
            </div>
        </div>
    );
};

export default EditBasicInfo;
