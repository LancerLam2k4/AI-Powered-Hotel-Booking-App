import React, { useState } from "react";
import axios from "axios";
import './EditPersonalID.css';  // Import file CSS

const EditPersonalID = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:8000/api/edit-personal-ID', { email });
        
        if (password !== confirmPassword) {
            alert("Passwords do not match");
        } else {
            alert("ID was reset successfully!");
        }
    } catch (error) {
        console.error(error);
        alert("Unable to reset. Please try again later..");
    }
};

  return (
    <div className="edit-info-container">
      <h2>EditPersonalID </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">EditPersonalID </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Update</button>
      </form>
    </div>
  );
};

export default EditPersonalID;
