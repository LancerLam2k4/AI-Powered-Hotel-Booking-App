// UpdateProfile.js
import React, { useState } from 'react';
import './EditBasicInfo.css';

const EditBasicInfo = ({ onClose }) => {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [phoneNumber, setPhoneNumber] = useState("123456789");
    const [address, setAddress] = useState("123 Street Name");
    const [hobby, setHobby] = useState("Reading");
    const [profilePicture, setProfilePicture] = useState(null);

    const onSave = () => {
        // Save the updated profile data logic here
        console.log({ name, email, phoneNumber, address, hobby, profilePicture });
        onClose(); // Close the modal after saving
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

                <label className="label-name-editBasicInfo"> Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label className="label-email">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="label-phone">Phone</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <label className="label-address">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

                <label className="label-hobby">Hobby</label>
                <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} />

                <button className='update'>Update</button>
                <button className='close'>Close</button>
        </div>
        </div>
        
    );
};

export default EditBasicInfo;
