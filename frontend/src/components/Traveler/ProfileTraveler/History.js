import React from "react";
import "./History.css";

const History = () => {
  // Dữ liệu mẫu (bạn có thể thay bằng dữ liệu thực sau này)
  const data = [
    { id: 1, roomId: "101", bookingDate: "2024-10-01", dateReceived: "2024-10-02", paymentDate: "2024-10-03", price: "$100", note: "Paid" },
    { id: 2, roomId: "102", bookingDate: "2024-10-04", dateReceived: "2024-10-05", paymentDate: "2024-10-06", price: "$150", note: "Pending" },
    // Thêm dữ liệu khác nếu cần
  ];

  return (
    <div className="history-container">
      {/* Tiêu đề */}
      <h1 className="history-heading">History</h1>

      {/* Ô trống để hiển thị dữ liệu dạng bảng */}
      <div className="history-data-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID Room</th>
              <th>Booking Date</th>
              <th>Date Received</th>
              <th>Payment Date</th>
              <th>Price</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.roomId}</td>
                <td>{item.bookingDate}</td>
                <td>{item.dateReceived}</td>
                <td>{item.paymentDate}</td>
                <td>{item.price}</td>
                <td>{item.note}</td>
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
