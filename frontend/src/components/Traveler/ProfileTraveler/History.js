import React from "react";
import "./History.css";

const History = () => {
  // Dữ liệu mẫu (bạn có thể thay bằng dữ liệu thực sau này)
 // Kiểm tra xem tên phòng có hợp lệ không
//  const [data, setData] = useState([]);

//  // Lấy dữ liệu từ API khi component mount
//  useEffect(() => {
//    // Sử dụng fetch hoặc axios để gọi API từ backend
//    axios
//      .get("http://localhost:8000/api/bookings") // Địa chỉ API backend
//      .then((response) => {
//        setData(response.data); // Cập nhật state với dữ liệu trả về
//      })
//      .catch((error) => {
//        console.error("There was an error fetching the data!", error);
//      });
//  }, []);
const isValidRoomName = (roomName) => {
  const validRoomNames = ["Single Room", "Double Room", "Deluxe Room", "Suite Room", "Family Room"];
  return validRoomNames.includes(roomName);
};

// Kiểm tra ngày có đúng định dạng yyyy-mm-dd không
const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
};

// Kiểm tra giá trị tiền có hợp lệ không
const isValidTotal = (total) => {
  const regex = /^\$[0-9,]+(\.[0-9]{2})?$/; // Kiểm tra tiền theo định dạng "$1000.00"
  return regex.test(total);
};

// Dữ liệu mẫu (với các kiểm tra)
const data = [
  { id: 1, room_name: "Deluxe Room", arrival_date: "2024-10-01", departure_date: "2024-10-05", total: "$500" },
  { id: 2, room_name: "Suite Room", arrival_date: "2024-10-10", departure_date: "2024-10-15", total: "$1000" },
];

// Hàm thêm dữ liệu với kiểm tra từng trường
const addData = (newItem) => {
  if (isValidRoomName(newItem.room_name) && isValidDate(newItem.arrival_date) && isValidDate(newItem.departure_date) && isValidTotal(newItem.total)) {
    data.push(newItem);
  } else {
    console.error("Invalid data! Please check the fields.");
  }
};

// Ví dụ về thêm dữ liệu
addData({ id: 3, room_name: "Single Room", arrival_date: "2024-11-01", departure_date: "2024-11-05", total: "$300" });

  

  return (
    <div className="history-container">
      {/* Tiêu đề */}
      <h1 className="history-heading">History</h1>

      {/* Ô trống để hiển thị dữ liệu dạng bảng */}
      <div className="history-data-container">
      <table className="history-table">
  <thead>
    <tr>
      <th>Room Name</th>
      <th>Arrival Date</th>
      <th>Departure Date</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item) => (
      <tr key={item.id}>
        <td>{item.room_name}</td>
        <td>{item.arrival_date}</td>
        <td>{item.departure_date}</td>
        <td>{item.total}</td>
      </tr>
    ))}
  </tbody>
</table>


      </div>

      {/* Nút EXIT */}
      <div className="history-exit">
        <button className="exit-btn">EXIT</button>
      </div>
    </div>
  );
};

export default History;
