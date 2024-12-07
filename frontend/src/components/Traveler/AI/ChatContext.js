import React, { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const previousRoomsRef = useRef([]);
  const [specificRoom, setSpecificRoom] = useState(null); // Thêm trạng thái specificRoom
  const previousSpecificRoomRef = useRef(); // Ref cho specificRoom
  const navigate = useNavigate();

  // Xử lý điều hướng cho rooms
  useEffect(() => {
    const previousRooms = previousRoomsRef.current; // Lấy giá trị trước đó
    if (JSON.stringify(rooms) !== JSON.stringify(previousRooms)) {
      previousRoomsRef.current = rooms; // Cập nhật giá trị trước đó
      if (rooms.length > 0) {
        console.log("Rooms đã được cập nhật tại ChatContext:", rooms);
        navigate("/booking"); // Chuyển hướng đến trang Booking
      }
    }
  }, [rooms, navigate]);

  // Xử lý điều hướng cho specificRoom
  useEffect(() => {
    const previousSpecificRoom = previousSpecificRoomRef.current; // Lấy giá trị trước đó
    if (JSON.stringify(specificRoom) !== JSON.stringify(previousSpecificRoom)) {
      previousSpecificRoomRef.current = specificRoom; // Cập nhật giá trị trước đó
      if (specificRoom && specificRoom[0].roomId) {
        console.log("Specific Room đã được cập nhật tại ChatContext:", specificRoom[0].roomId);
        navigate(`/BookingDetail/${specificRoom[0].roomId}`); // Chuyển hướng đến trang chi tiết phòng
      }
    }
  }, [specificRoom, navigate]);

  return (
    <ChatContext.Provider value={{ rooms, setRooms, specificRoom, setSpecificRoom }}>
      {children}
    </ChatContext.Provider>
  );
};
