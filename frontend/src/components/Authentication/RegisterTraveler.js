import React, { useState, useEffect } from 'react';
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

    // Hàm kiểm tra đầu vào
    const validateInputs = () => {
        const personIdPattern = /^\d{12}$/;
        if (!personIdPattern.test(personId)) {
            alert('Person ID must be exactly 12 digits.');
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (password !== passwordConfirmation) {
            alert('Passwords do not match.');
            return false;
        }

        return true;
    };

    // Hàm xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            // Gửi yêu cầu đăng ký
            await axios.post('http://localhost:8000/api/check-email', {
                person_id: personId,
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            alert('A verification code has been sent to your email. Please check and enter the code.');
            setIsModalOpen(true); // Đặt isModalOpen thành true để mở modal
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed due to validation errors.');
        }
    };

    useEffect(() => {
        console.log("Modal Open State: ", isModalOpen); // Kiểm tra giá trị của isModalOpen
    }, [isModalOpen]);

    // Hàm xử lý xác minh mã
    const handleVerifyCode = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/api/verify-code', {
                email,
                code: verificationCode,
                person_id: personId,
                username,
                password,
            });
            alert('Email verified and registration successful!');
            setIsModalOpen(false); // Đóng modal sau khi xác minh thành công
            window.location.href = '/'; // Chuyển hướng về trang login
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
                <div className='form-container-register'>
                    <form onSubmit={handleRegister}>
                        <div className='form-group-register'>
                            <label className='label-register'>Username :</label>
                            <input
                                className='input-register'
                                type="text"
                                placeholder="Enter Your Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group-register'>
                            <label className='label-register'>Email :</label>
                            <input
                                className='input-register'
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group-register'>
                            <label className='label-register'>Person ID :</label>
                            <input
                                className='input-register'
                                type="text"
                                placeholder="Enter Your Person ID"
                                value={personId}
                                onChange={(e) => setPersonId(e.target.value)}
                                maxLength={12}
                                required
                            />
                        </div>
                        <div className='form-group-register'>
                            <label className='label-register'>Password :</label>
                            <input
                                className='input-register'
                                type="password"
                                placeholder="Enter Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className='form-group-register'>
                            <label className='label-register'>Confirm Password :</label>
                            <input
                                className='input-register'
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
                            <button type="button" onClick={() => window.location.href='/'}>Return</button>
                        </div>
                    </form>
                </div>
            </div>
            <label className='footer'>Develop by Group 5</label>

            {/* Modal */}
            <div className={`modal ${isModalOpen ? 'open' : ''}`}>
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
        </div>
    );
};

export default RegisterTraveler;
