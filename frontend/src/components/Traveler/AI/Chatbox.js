import React, { useState } from "react";
import axios from "axios";
import "./Chatbox.css"; // Thêm CSS cho chatbox

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const userMessage = { sender: "user", text: inputMessage };
      setMessages([...messages, userMessage]);
      setInputMessage("");

      try {
        const response = await axios.post("http://localhost:8000/api/chat", {
          message: inputMessage,
        });
        const aiMessage = { sender: "ai", text: response.data.message };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-icon" onClick={toggleChatbox}>
        <img src="chat-icon.png" alt="Chat" />
      </div>
      {isOpen && (
        <div className="chatbox-window">
          <div className="chatbox-header">
            <h3>AI Chatbox</h3>
            <button onClick={toggleChatbox}>X</button>
          </div>
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbox-footer">
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
      )}
    </div>
  );
};

export default Chatbox;
