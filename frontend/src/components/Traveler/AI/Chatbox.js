import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Chatbox.css";
import { ChatContext } from "./ChatContext";

const Chatbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { rooms, setRooms } = useContext(ChatContext);
  const { specificRoom, setSpecificRoom } = useContext(ChatContext);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      const greeting = {
        sender: "ai",
        text: "Chào bạn! Tôi là quản gia Lily. Liệu tôi có thể giúp gì cho trải nghiệm của bạn tại đây không?",
      };
      setMessages([greeting]);
    }
  }, []);

  const saveChatHistory = (newMessages) => {
    sessionStorage.setItem("chatHistory", JSON.stringify(newMessages));
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
        const userMessage = { sender: "user", text: inputMessage };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        saveChatHistory(updatedMessages);
        setInputMessage("");

        try {
            // Gửi câu hỏi tới API Python (Flask)
            const response = await axios.post(`http://localhost:5000/ask`, {
                question: inputMessage, // Truyền câu hỏi từ inputMessage
            });

            const responseData = response.data;
            console.log(responseData); // Log để kiểm tra dữ liệu nhận được

            // Kiểm tra câu trả lời từ server Python
            if (responseData.answer) {
                const aiMessage = { sender: "ai", text: responseData.answer };
                const newMessages = [...updatedMessages, aiMessage];
                setMessages(newMessages);
                saveChatHistory(newMessages);
            } else {
                // Nếu không có câu trả lời
                const aiMessage = { sender: "ai", text: "Không có câu trả lời cho câu hỏi của bạn." };
                const newMessages = [...updatedMessages, aiMessage];
                setMessages(newMessages);
                saveChatHistory(newMessages);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                sender: "ai",
                text: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Hãy thử lại sau!",
            };
            const newMessages = [...updatedMessages, errorMessage];
            setMessages(newMessages);
            saveChatHistory(newMessages);
        }
    }
};

  const handleClose = () => {
    onClose();
    setMessages([]);
    sessionStorage.removeItem("chatHistory");
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
