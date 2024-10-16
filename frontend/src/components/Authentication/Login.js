import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

    return (
        <div className='login-page'>
            <div className="login-container">
            <img className='logo' src='Logo.png'/>
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
                    <a href="/forgot-password">Forgot password?</a>
                    <p>Don't have an account, <a href="/register">register here</a> .</p>
                </div>
            </div>

            {/* Khối 4: Login Button */}
            <div className="login-button">
                <button type="submit" onClick={handleLogin}>Login</button>
            </div>

            {/* Khối 5: Or và Logos */}
            <div className="alternative">
                <div className="or">Or</div>
                <div className="social-logos">
                    <img src="/path/to/logo1.png" alt="Logo 1" />
                    <img src="/path/to/logo2.png" alt="Logo 2" />
                    <img src="/path/to/logo3.png" alt="Logo 3" />
                </div>
            </div>

            {/* Khối 6: Footer */}
            <div className="footer">
                <p>Developed by Group 5</p>
            </div>
        </div>
        </div>
        
    );
};

export default Login;
