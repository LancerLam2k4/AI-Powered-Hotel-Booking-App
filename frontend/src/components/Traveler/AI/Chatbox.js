import React, { useState, useEffect,useContext} from "react";
import axios from "axios";
import "./Chatbox.css";
import { ChatContext } from "./ChatContext"
const Chatbox = ({ onClose, onRoomSelected }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { rooms,setRooms } = useContext(ChatContext);
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
        const response = await axios.post(`http://localhost:5000/ask`, {
          question: inputMessage,
        });

        const responseData = response.data;
        console.log(responseData)
        if (responseData.rooms) {
          // Nếu phản hồi có thông tin phòng
          const aiMessage = { sender: "ai", text: responseData.answer };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
          setRooms(responseData.rooms);
          console.log("Rooms tại Chatbox:", responseData.rooms);
          if (onRoomSelected) {
            onRoomSelected(responseData.rooms);
          }
        } else {
          // Câu trả lời thông thường
          const aiMessage = { sender: "ai", text: responseData.answer || responseData.error };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }

        sessionStorage.setItem("chatHistory", JSON.stringify([...messages, userMessage]));
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          sender: "ai",
          text: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Hãy thử lại sau!",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

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
