import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Chatbox.css";
import { ChatContext } from "./ChatContext";

const Chatbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { rooms, setRooms} = useContext(ChatContext);
  const { specificRoom, setSpecificRoom } = useContext(ChatContext);
  // Khôi phục lịch sử từ sessionStorage khi tải trang
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

  // Hàm lưu trữ lịch sử chat vào sessionStorage
  const saveChatHistory = (newMessages) => {
    sessionStorage.setItem("chatHistory", JSON.stringify(newMessages));
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const userMessage = { sender: "user", text: inputMessage };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages); // Lưu lịch sử ngay khi người dùng gửi tin nhắn
      setInputMessage("");

      try {
        const response = await axios.post(`http://localhost:5000/ask`, {
          question: inputMessage,
        });

        const responseData = response.data;
        if (responseData.specificRoom) {
          const aiMessage = { sender: "ai", text: responseData.answer };
          const newMessages = [...updatedMessages, aiMessage];
          setMessages(newMessages);
          saveChatHistory(newMessages); // Lưu lịch sử chat
          console.log("Dữ liệu được gửi tới setSpecificRoom:", responseData.specificRoom);
          setSpecificRoom(responseData.specificRoom); // Gửi phòng cụ thể lên ChatContext
          //console.log("Specific Room tại Chatbox:", responseData.specificRoom);
        } else if (responseData.rooms) {
          const aiMessage = { sender: "ai", text: responseData.answer };
          const newMessages = [...updatedMessages, aiMessage];
          setMessages(newMessages);
          saveChatHistory(newMessages); // Lưu lịch sử chat
          setRooms(responseData.rooms); // Gửi danh sách phòng lên ChatContext
          console.log("Rooms tại Chatbox:", responseData.rooms);
        } else {
          // Câu trả lời thông thường
          const aiMessage = { sender: "ai", text: responseData.answer || responseData.error };
          const newMessages = [...updatedMessages, aiMessage];
          setMessages(newMessages);
          saveChatHistory(newMessages); // Lưu lịch sử chat bao gồm cả phản hồi của AI
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          sender: "ai",
          text: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Hãy thử lại sau!",
        };
        const newMessages = [...updatedMessages, errorMessage];
        setMessages(newMessages);
        saveChatHistory(newMessages); // Lưu lịch sử chat ngay cả khi xảy ra lỗi
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
