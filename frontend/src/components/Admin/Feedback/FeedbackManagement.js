import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackManagement.css";

const FeedbackManagement = () => {
  // Sample feedback data
  const [isReplyingMode, setIsReplyingMode] = useState(false); // State để hiển thị form trả lời
  const [replyTitle, setReplyTitle] = useState(""); // Lưu trữ tiêu đề của trả lời
  const [replyContent, setReplyContent] = useState(""); // Lưu trữ nội dung trả lời
  const [feedbackData, setFeedbackData] = useState([]);
  // Hàm xử lý khi nhấn nút "Trả lời"
  const handleReplyClick = () => {
    setIsReplyingMode(true); // Hiển thị form trả lời
  };

  // Hàm xử lý thay đổi tiêu đề trong form trả lời
  const handleTitleChange = (event) => {
    setReplyTitle(event.target.value);
  };

  // Hàm xử lý thay đổi nội dung trong form trả lời
  const handleContentChange = (event) => {
    setReplyContent(event.target.value);
  };

  // Hàm xử lý khi nhấn nút "Hủy"
  const handleCancelReply = () => {
    setIsReplyingMode(false); // Ẩn form trả lời khi nhấn "Hủy"
  };

  // Hàm xử lý khi nhấn nút "Gửi"
  const handleSendReply = () => {
    // Logic để gửi trả lời (ví dụ: gọi API hoặc xử lý gửi dữ liệu)
    console.log("Gửi trả lời:", replyTitle, replyContent);
    setIsReplyingMode(false); // Ẩn form trả lời sau khi gửi
  };

  // Hàm xử lý khi nhấn nút "Quay lại" để quay lại trạng thái ban đầu
  const handleBackClick = () => {
    setIsReplying(false);
  };

  useEffect(() => {
    // Gọi API để lấy dữ liệu feedback từ backend
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/feedbacks-management"
        ); // Thay 'your-api-endpoint' bằng URL thực tế của bạn
        setFeedbackData(response.data); // Cập nhật state feedbackData với dữ liệu trả về từ backend
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu feedback:", error);
      }
    };

    fetchFeedbackData(); // Gọi hàm fetch dữ liệu
  }, []);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

  const handleFeedbackClick = (feedback, index) => {
    setSelectedFeedback(feedback);
    setIsReplying(true);

    // Cập nhật item được chọn
    const feedbackItems = document.querySelectorAll(".feedback-item");
    feedbackItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("selected"); // Thêm class selected cho item được chọn
      } else {
        item.classList.remove("selected"); // Xóa class selected cho các item khác
      }
    });
  };

  const handleBack = () => {
    setSelectedFeedback(null);
    setIsReplying(false);
  };

  const handleCloseReply = () => {
    setIsReplying(false);
  };

  const renderEmojis = (reviewsCore) => {
    const emojis = ["😡", "😟", "😐", "😊", "😍"];
    return emojis[reviewsCore - 1] || "😐";
  };

  return (
    <div
      className="feedback-management"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        className="header-row"
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <h2>User Feedbacks</h2>
      </div>

      <div className="feedback-row" style={{ display: "flex", width: "100%" }}>
        <div
          className="feedback-list"
          style={{
            width: isReplying ? "35%" : "100%",
            transition: "width 0.3s",
          }}
        >
          <div className="feedback-container">
            {feedbackData.map((feedback, index) => (
              <div
                key={index}
                className="feedback-item"
                onClick={() => handleFeedbackClick(feedback, index)} // Truyền index vào callback
              >
                <div className="feedback-header">
                  <p style={{ width: "60%" }}>
                    <strong>{feedback.title}</strong>
                  </p>
                  <p style={{ width: "10%" }}>
                    Rating: {renderEmojis(feedback.reviewsCore)}
                  </p>
                  <p style={{ width: "30%", textAlign: "right" }}>
                    {feedback.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isReplying && (
          <div
            className="reply-modal"
            style={{ width: "100%", transition: "width 0.3s" }}
          >
            <div className="reply-modal-content">
              {/* Hiển thị thông tin feedback */}
              <div className="feedback-header">
                <p>
                  <strong>{selectedFeedback.name}</strong>{" "}
                  <span>&lt;from: {selectedFeedback.email}&gt;</span>
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  {renderEmojis(selectedFeedback.reviewsCore)} |{" "}
                  {selectedFeedback.reviewsCore}
                </p>
              </div>

              {/* Hiển thị Title */}
              <div className="feedback-title">
                <p>
                  <strong>Title:</strong> {selectedFeedback.title}
                </p>
              </div>

              {/* Hiển thị nội dung feedback */}
              <div className="feedback-content">
                <textarea value={selectedFeedback.feedback} readOnly></textarea>
              </div>

              {/* Các nút trả lời và chuyển tiếp, sẽ bị ẩn khi đang ở chế độ trả lời */}
              {!isReplyingMode && (
                <div className="reply-modal-actions">
                  <button
                    className="action-button back-button"
                    onClick={handleBackClick}
                  >
                    <span className="icon">&#8592;</span> Quay lại
                  </button>
                  <div className="action-buttons-left">
                    <button
                      className="action-button"
                      onClick={handleReplyClick}
                    >
                      <span className="icon">&#8592;</span> Trả lời
                    </button>
                    <button className="action-button">
                      <span className="icon">&#8594;</span> Chuyển tiếp
                    </button>
                  </div>
                </div>
              )}

              {/* Khung trả lời sẽ xuất hiện khi click vào nút "Trả lời" */}
              {isReplyingMode && (
                <div className="reply-form">
                  <div className="email-row">
                    <label htmlFor="to-email">To:</label>
                    <p>{selectedFeedback.email}</p>
                  </div>

                  <div className="title-row">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Enter title"
                      value={replyTitle}
                      onChange={handleTitleChange}
                    />
                  </div>

                  <label htmlFor="content">Content</label>
                  <textarea
                    id="content"
                    placeholder="Enter content"
                    value={replyContent}
                    onChange={handleContentChange}
                  ></textarea>

                  <div className="reply-actions">
                    <button className="send-button" onClick={handleSendReply}>
                      Submit
                    </button>
                    <button
                      className="cancel-button"
                      onClick={handleCancelReply}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
