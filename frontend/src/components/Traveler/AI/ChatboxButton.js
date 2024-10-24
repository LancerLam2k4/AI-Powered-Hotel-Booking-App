import React, { useState } from 'react';
import Chatbox from './Chatbox';  // Component Chatbox
import './Chatbox.css';

const ChatboxButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };
  console.log("ChatboxButton component is rendered");

  return (
    <div>
      <button className="chatbox-toggle" onClick={toggleChatbox}>💬</button>
      {isOpen && <Chatbox />}
    </div>
  );
};

export default ChatboxButton;
