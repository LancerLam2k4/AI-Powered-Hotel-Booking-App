import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
const RegisterTraveler = () => {
    const [personId, setPersonId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [preferences, setPreferences] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                person_id: personId,
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
                preferences,
            });
            alert('Registration successful!');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    };

    return (
        <div className='register-page'>
            <form onSubmit={handleRegister}>
            <h1> Hello</h1>
            <input type="text" placeholder="Căn cước công dân" value={personId} onChange={(e) => setPersonId(e.target.value)} required />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
            <input type="text" placeholder="Preferences" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
            <button type="submit">Register</button>
        </form>
        </div>
        
    );
};

export default RegisterTraveler;
