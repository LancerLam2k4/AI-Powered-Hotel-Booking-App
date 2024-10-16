import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            alert('Password reset successful! Please login with your new password.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error occurred while resetting password.');
        }
    };

    return (
        <div className="reset-password-page">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label>New Password:</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Confirm Password:</label>
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
