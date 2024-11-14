// src/components/Traveler/TravelerLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatboxButton from './AI/ChatboxButton';
import './TravelerLayout.css';

const TravelerLayout = () => {
  return (
    <div className="traveler-layout">
      <div className="traveler-content">
        <Outlet/> 
      </div>
      <ChatboxButton />
    </div>
  );
};

export default TravelerLayout;
