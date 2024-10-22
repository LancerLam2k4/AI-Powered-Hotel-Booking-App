import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setMessage('Password reset successful!');
            setSuccess(true); // Đặt trạng thái thành công
        } catch (error) {
            console.error(error.response?.data);
            setMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
        }
    };

    // Tự động đóng cửa sổ sau khi reset thành công
    useEffect(() => {
        if (success) {
            // Đặt thời gian delay để người dùng có thể thấy thông báo thành công trước khi đóng cửa sổ
            const timer = setTimeout(() => {
                window.close();
            }, 2000); // Đóng cửa sổ sau 2 giây

            return () => clearTimeout(timer); // Xóa timer khi component unmount
        }
    }, [success]);

    return (
        <div className="reset-password-container">
            

            {/* Tiêu đề */}
            <h1>Forgot Password</h1>

            {/* Thông báo */}
            {!success ? (
                <form onSubmit={handleResetPassword}>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                    <a href="/login">Back to login</a>
                </form>
            ) : (
                <div>
                    <p>{message}</p>
                    <p>Window will close automatically in 2 seconds...</p>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
