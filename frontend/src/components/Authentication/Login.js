import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import ForgotPassword from './ForgotPassword';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            console.log(response.data);
            // Chuyển hướng đến dashboard tương ứng dựa vào role
            switch (response.data.user.role) {
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'traveler':
                    navigate('/traveler-dashboard');
                    break;
                case 'staff':
                    navigate('/staff-dashboard');
                    break;
                case 'hotel_owner':
                    navigate('/hotel-owner-dashboard');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error.response.data.message);
            alert(error.response.data.message);
        }
    };

    const handleForgotPasswordClick = () => {
        setIsForgotPasswordOpen(true);
    };

    const handleCloseModal = () => {
        setIsForgotPasswordOpen(false);
    };

    return (
        <div className='login-page'>
            <div className="login-container">
                <img className='logo' src='Logo.png' alt='Logo' />
                <div className="heading">
                    <h2>Welcome Back</h2>
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="link-group">
                        <button onClick={handleForgotPasswordClick} className="link-button">
                            Forgot password?
                        </button>
                        <p>Don't have an account, <a href="/register">register here</a>.</p>
                    </div>
                </div>

                <div className="login-button">
                    <button type="submit" onClick={handleLogin}>Login</button>
                </div>

            {/* Khối 5: Or và Logos */}
            <div className="alternative">
                <div className="or">Or</div>
                <div className="social-logos">
                    <img src="facebook.png" alt="Facebook" />
                    <img src="google.png" alt="Google" />
                    <img src="twitter.png" alt="Twitter" />
                </div>
            </div>

                <div className="footer">
                    <p>Developed by Group 5</p>
                </div>
            </div>

            {/* Modal Forgot Password */}
            {isForgotPasswordOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseModal}>X</button>
                        <ForgotPassword onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
