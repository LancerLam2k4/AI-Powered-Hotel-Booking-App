import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
