import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatbox.css";

const Chatbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Gửi lời chào khi mở Chatbox lần đầu
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = {
        sender: "ai",
        text: "Chào bạn! Tôi là quản gia Lily. Liệu tôi có thể giúp gì cho trải nghiệm của bạn tại đây không?",
      };
      setMessages([greeting]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const userMessage = { sender: "user", text: inputMessage };
      setMessages([...messages, userMessage]);
      setInputMessage("");

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
          message: inputMessage,
        });
        const aiMessage = { sender: "ai", text: response.data.message };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        sessionStorage.setItem("chatHistory", JSON.stringify([...messages, userMessage, aiMessage]));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Khôi phục cuộc trò chuyện khi mở lại Chatbox
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Đóng hộp thoại và xóa dữ liệu cuộc trò chuyện
  const handleClose = () => {
    onClose();
    setMessages([]);
    sessionStorage.removeItem("chatHistory"); // Xóa dữ liệu trong sessionStorage
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-window">
        <div className="chatbox-header">
          Lily
          <div>
            <button onClick={onClose}>-</button>
            <button onClick={handleClose}>x</button>
          </div>
        </div>

        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chatbox-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
