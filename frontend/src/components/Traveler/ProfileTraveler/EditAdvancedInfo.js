import React, { useState } from "react";
import axios from "axios";
import './EditAdvancedInfo.css';  // Import file CSS

const EditAdvancedInfo = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Thêm state cho mật khẩu cũ
  const [newPassword, setNewPassword] = useState(""); // Sửa tên state cho mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(""); // Giữ nguyên xác nhận mật khẩu mới

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:8000/api/edit-advancedinfo', { email });
        
        if (newPassword !== confirmPassword) {
            alert("Confirm password not correct");
        } else {
            alert("Success!");
        }
    } catch (error) {
        console.error(error);
        alert("Password reset failed. Please try again later.");
    }
  };

  return (
    <div className="edit-info-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit advanced information</h2>
        <div className="edit-info-form-group">
          <label htmlFor="currentPassword" className="edit-info-label">Old password:</label>
          <input
            type="password"
            id="currentPassword"
            className="edit-info-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="edit-info-form-group">
          <label htmlFor="newPassword" className="edit-info-label">New Password:</label>
          <input
            type="password"
            id="newPassword"
            className="edit-info-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="edit-info-form-group">
          <label htmlFor="confirmPassword" className="edit-info-label">Confirm new password:</label>
          <input
            type="password"
            id="confirmPassword"
            className="edit-info-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="edit-info-submit-btn">Update</button>
      </form>
    </div>
  );
};

export default EditAdvancedInfo;
