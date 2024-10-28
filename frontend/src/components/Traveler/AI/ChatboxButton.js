import React, { useState } from "react";
import Chatbox from "./Chatbox";
import "./Chatbox.css";

const ChatboxButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Chuyển đổi trạng thái ẩn/hiện của Chatbox
  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {!isOpen && (
        <button className="chatbox-toggle" onClick={toggleChatbox}>
          💬
        </button>
      )}
      {isOpen && <Chatbox onClose={toggleChatbox} />} {/* Truyền hàm đóng vào Chatbox */}
    </div>
  );
};

export default ChatboxButton;
