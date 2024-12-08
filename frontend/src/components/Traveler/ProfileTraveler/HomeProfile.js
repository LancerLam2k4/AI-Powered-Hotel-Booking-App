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
    const [person_id, setPersonId] = useState('');
    const [avatar, setAvatar] = useState('profile_icon.png');
    const [history, setHistory] = useState('');
    const [hobby, setHobby] = useState('');
    const [isEditing, setIsEditing] = useState({ password: false, person_id: false });
    const [isLoading, setIsLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('Not set');
    const [address, setAddress] = useState('Not set');


    const [userCurrent, setUser] = useState(null);
    const [error, setError] = useState(null); // Trạng thái lỗi

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile'); // Gửi yêu cầu tới backend
                setUser(response.data); // Lưu thông tin vào state
                // setPassword(response.data.password); // Giả sử backend trả về password
                setPersonId(response.data.person_id);
                setId(response.data.user_id)
            } catch (error) {
                console.error("Error fetching profile:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    setError(error.response.data.message || "An error occurred");
                }
            } finally {
                setIsLoading(false); // Đặt trạng thái loading về false
            }
        };

        fetchProfile(); // Gọi hàm khi component mount
    }, []);
    if (error) return <div>Error: {error}</div>;

    


    const handleEditPassword = async () => {
        if (isEditing.password) {
            try {
                if (!id) {
                    alert('User ID không hợp lệ.');
                    return;
                }
    
                // Gửi yêu cầu cập nhật mật khẩu với user_id và password
                const response = await axios.put(`http://localhost:8000/api/updatePassword`, {
                    user_id: id,  // Gửi user_id
                    password: password // Gửi mật khẩu mới
                });
    
                if (response.status === 200) {
                    // Hiển thị thông báo thành công
                    alert('Password updated successfully');
                    
                    // Reset mật khẩu về dạng ẩn
                    setPassword('********');
                } else {
                    // Xử lý lỗi từ backend nếu có
                    alert('Failed to update password. Please try again.');
                }
            } catch (error) {
                console.error("Error updating password:", error);
                alert('Failed to update password. Please try again.');
            }
        }
    
        // Toggle chế độ chỉnh sửa
        setIsEditing(prev => ({ ...prev, password: !prev.password }));
    };    

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className='home-profile'>
            <div className="profile-container">
                {/* Profile Picture */}
                <div className="profile-picture">
                    <img src={userCurrent.avatar} alt="Profile" /> {/* Display user's avatar */}
                </div>

                {/* User Information */}
                <div className="user-info">
                    <h2>{userCurrent.username}</h2>
                    <div className="info-field">
                        <label>Email:</label>
                        <p>{userCurrent.email}</p>
                    </div>
                    <div className="info-field">
                        <label>Hobby:</label>
                        <p>{userCurrent.preferences}</p>
                    </div>
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
                            <p>****************************</p>
                        )}
                    </div>

                    <div className="info-field">
                        <label>Person ID:</label>
                        {isEditing.person_id ? (
                            <input
                                type="text"
                                value={person_id}
                                onChange={(e) => setPersonId(e.target.value)}
                            />
                        ) : (
                            <p>{person_id}</p>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeProfile;
