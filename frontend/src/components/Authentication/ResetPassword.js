import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage("Password reset successful!");
      setSuccess(true); // Đặt trạng thái thành công
    } catch (error) {
      console.error(error.response?.data);
      setMessage(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }
  };

  // Tự động đóng cửa sổ sau khi reset thành công
  useEffect(() => {
    if (success) {
      // Đặt thời gian delay để người dùng có thể thấy thông báo thành công trước khi đóng cửa sổ
      const timer = setTimeout(() => {
        window.close();
      }, 2000); // Đóng cửa sổ sau 2 giây

      return () => clearTimeout(timer); // Xóa timer khi component unmount
    }
  }, [success]);

  return (
    <div className="background-reset">
      <div className="reset-password-container">
        <h1>Reset Password</h1>
        {!success ? (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <button type="submit" className="reset-password-button">Reset Password</button>
          </form>
        ) : (
          <div>
            <p>{message}</p>
            <p>Window will close automatically in 2 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
