import React, { createContext, useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]); // Dữ liệu rooms nhận từ Chatbox
  const previousRoomsRef = useRef([]); // Lưu giá trị trước đó của rooms
  const navigate = useNavigate();
  useEffect(() => {
    const previousRooms = previousRoomsRef.current; // Lấy giá trị trước đó
    if (JSON.stringify(rooms) !== JSON.stringify(previousRooms)) {
      // So sánh giá trị mới với giá trị trước đó
      previousRoomsRef.current = rooms; // Cập nhật giá trị trước đó
      if (rooms.length > 0) {
        console.log("Rooms đã được cập nhật tại ChatContext:", rooms);
        navigate("/booking"); // Chuyển hướng đến trang Booking
      }
    }
  }, [rooms,navigate]);

  return (
    <ChatContext.Provider value={{ rooms, setRooms }}>
      {children}
    </ChatContext.Provider>
  );
};
