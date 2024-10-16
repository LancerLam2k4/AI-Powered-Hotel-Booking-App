import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';


const RegisterTraveler = () => {
    const [personId, setPersonId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    // Hàm kiểm tra toàn bộ các giá trị đầu vào
    const validateInputs = () => {
        // Kiểm tra nếu personId có đúng 12 số
        const personIdPattern = /^\d{12}$/;
        if (!personIdPattern.test(personId)) {
            alert('Person ID must be exactly 12 digits.');
            return false;
        }

        // Kiểm tra nếu email đúng định dạng
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Kiểm tra nếu password và confirm password không khớp
        if (password !== passwordConfirmation) {
            alert('Passwords do not match.');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/check-email', {
                person_id: personId,
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setUserId(response.data.user_id);
            alert('A verification code has been sent to your email. Please check and enter the code.');
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed due to validation errors.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/verify-code', {
                email,
                code: verificationCode,
                person_id: personId,
                username,
                password,
            });
            alert('Email verified and registration successful!');
            setIsModalOpen(false);
            window.location.href = '/login'; // Chuyển hướng về trang login
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Verification failed. Please check the code.');
        }
    };

    return (
        <div className='register-page'>
            <img className='logo' src='Logo.png' alt='Logo' />
            <h1>Welcome to us</h1>
            <div className='register-container'>
                <div className='image-container'>
                    <img className='img-register' src='img-register.png' alt='img-register' />
                </div>
                <div className='form-container'>
                    <form onSubmit={handleRegister}>
                        <div className='form-group'>
                            <label>Username :</label>
                            <input
                                type="text"
                                placeholder="Enter Your Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Email :</label>
                            <input
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Person ID :</label>
                            <input
                                type="text"
                                placeholder="Enter Your Person ID"
                                value={personId}
                                onChange={(e) => setPersonId(e.target.value)}
                                maxLength={12}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Password :</label>
                            <input
                                type="password"
                                placeholder="Enter Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Confirm Password :</label>
                            <input
                                type="password"
                                placeholder="Re-enter Your Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className='button-container'>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => window.location.href='/login'}>Return</button>
                        </div>
                    </form>
                </div>
            </div>
            <label className='footer'>Develop by Group 5</label>
    
            {isModalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Enter Verification Code</h2>
                        <form onSubmit={handleVerifyCode}>
                            <input
                                type="text"
                                placeholder="Verification Code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            <button type="submit">Verify Code</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterTraveler;
