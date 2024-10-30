import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import ForgotPassword from "./ForgotPassword";
import "./ForgotPassword.css";
import { gsap } from "gsap";
import ChatboxButton from "../Traveler/AI/ChatboxButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  useEffect(() => {
    const btn = document.querySelector(".login-button button");
    new HoverButton(btn);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log(response.data);
      const role = response.data.user.role;
      setUserRole(role);

      // Chuyển hướng đến dashboard tương ứng dựa vào role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "traveler":
          navigate("/traveler-profile");
          break;
        case "staff":
          navigate("/staff-dashboard");
          break;
        case "hotel_owner":
          navigate("/hotel-owner-dashboard");
          break;
        default:
          break;
      }

      // Kiểm tra và hiển thị ChatboxButton nếu role là "traveler"
      if (role === "traveler") {
        console.log("User is a traveler, displaying ChatboxButton");
      }

    } catch (error) {
      console.error(error.response?.data?.message || "Login failed.");
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordOpen(true);
  };

  const handleCloseModal = () => {
    setIsForgotPasswordOpen(false);
  };

  const handleLogoClick = (platform) => {
    switch (platform) {
      case "facebook":
        window.location.href = "https://www.facebook.com"; // Thay đổi thành URL OAuth cho Facebook nếu cần
        break;
      case "google":
        window.location.href = "https://www.google.com"; // Thay đổi thành URL OAuth cho Google
        break;
      case "twitter":
        window.location.href = "https://www.twitter.com"; // Thay đổi thành URL OAuth cho Twitter
        break;
      default:
        break;
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img className="logo" src="Logo.png" alt="Logo" />
        <div className="heading">
          <h2>Welcome Back</h2>
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="link-group">
            <button onClick={handleForgotPasswordClick} className="link-button">
              Forgot password?
            </button>
            <p>
              Don't have an account, <a href="/register">register here</a>.
            </p>
          </div>
        </div>

                <div className="login-button">
                    <button type="submit" onClick={handleLogin}>Login</button>
                </div>

        {/* Khối 5: Or và Logos */}
        <div className="alternative">
          <div className="or">Or</div>
          <div className="social-logos">
            <img
              src="facebook.png"
              alt="Facebook"
              onClick={() => handleLogoClick("facebook")}
              style={{ cursor: "pointer" }}
            />
            <img
              src="google.png"
              alt="Google"
              onClick={() => handleLogoClick("google")}
              style={{ cursor: "pointer" }}
            />
            <img
              src="twitter.png"
              alt="Twitter"
              onClick={() => handleLogoClick("twitter")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="footer">
          <p>Developed by Group 5</p>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              x
            </button>{" "}
            {/* Nút X nhỏ */}
            <ForgotPassword onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Chỉ hiển thị ChatboxButton sau khi đăng nhập thành công và vai trò là traveler */}
      {userRole === "traveler" && (
        <>
          {console.log("ChatboxButton is rendering for traveler")}
          <ChatboxButton />
        </>
      )}
    </div>
  );
};

class HoverButton {
  constructor(el) {
    this.el = el;
    this.hover = false;
    this.calculatePosition();
    this.attachEventsListener();
  }

  attachEventsListener() {
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("resize", () => this.calculatePosition());
  }

  calculatePosition() {
    gsap.set(this.el, { x: 0, y: 0, scale: 1 });
    const box = this.el.getBoundingClientRect();
    this.x = box.left + box.width * 0.5;
    this.y = box.top + box.height * 0.5;
    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {
    let hover = false;
    let hoverArea = this.hover ? 0.4 : 0.3; // Thu nhỏ phạm vi kích hoạt và dừng hiệu ứng
    let x = e.clientX - this.x;
    let y = e.clientY - this.y;
    let distance = Math.sqrt(x * x + y * y);

    if (distance < this.width * hoverArea) {
      hover = true;
      if (!this.hover) this.hover = true;
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover) {
      this.onLeave();
      this.hover = false;
    }
  }

  onHover(x, y) {
    gsap.to(this.el, {
      x: (x - this.x) * 0.2,
      y: (y - this.y) * 0.2,
      scale: 1.1,
      ease: "power2.out",
      duration: 0.4,
    });
    this.el.style.zIndex = 10;
  }

  onLeave() {
    gsap.to(this.el, {
      x: 0,
      y: 0,
      scale: 1,
      ease: "elastic.out(1.2, 0.4)",
      duration: 0.7,
    });
    this.el.style.zIndex = 1;
  }
}

export default Login;
