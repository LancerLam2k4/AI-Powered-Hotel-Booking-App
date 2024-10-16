import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/forgot-password', { email });
            alert('A password reset email has been sent. Please check your inbox.');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error occurred while sending password reset email.');
        }
    };

    return (
        <div className="forgot-password-page">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Email</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
