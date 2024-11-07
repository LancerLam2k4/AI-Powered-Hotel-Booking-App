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
      <h2>Edit advanced information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-advanced-advanced">
          <label htmlFor="currentPassword">Old password:</label>
          <input
          className="input-edit-advanced"
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group-advanced">
          <label htmlFor="newPassword">New Password:</label>
          <input
          className="input-edit-advanced"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group-advanced-advanced">
          <label htmlFor="confirmPassword">Confirm new password:</label>
          <input
          className="input-edit-advanced"
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

export default EditAdvancedInfo;