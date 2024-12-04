import React, { useState } from "react";
import "./Feedback.css"; // Import CSS for Feedback page

const Feedback = () => {
  // Define states to store form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting feedback (e.g., API call)
    alert("Thank you for your feedback!");
    
    // Reset form fields after submission
    setName("");
    setEmail("");
    setFeedback("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div className="feedback-form-container">
      <h2 className="feedback-form-title">Give us your valuable feedback</h2>
      <p className="feedback-form-description">Your feedback is very important to us</p>
      <form onSubmit={handleSubmit}>
        <div className="feedback-emojis">
          <span role="img" aria-label="Very Happy">😃</span>
          <span role="img" aria-label="Happy">🙂</span>
          <span role="img" aria-label="Neutral">😐</span>
          <span role="img" aria-label="Sad">😟</span>
          <span role="img" aria-label="Angry">😡</span>
        </div>
        <div className="input-group-feedbback">
          <label htmlFor="feedback-text" className="input-label-feedbback">What would you like to share?</label>
          <textarea
            id="feedback-text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="feedback-textarea"
          ></textarea>
        </div>
        <div className="input-group-feedbback">
          <label className="input-label-feedbback">Do you want to share it publicly?</label>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="public-feedback"
                value="yes"
                required
              /> Yes
            </label>
            <label>
              <input
                type="radio"
                name="public-feedback"
                value="no"
              /> No
            </label>
          </div>
        </div>
        <div className="input-group-feedback">
          <label className="input-label-feedbback" htmlFor="nickname">Nickname</label>
          <input
            type="nick"
            id="nickname"
            className="input-field-feedbback"
            required
          />
        </div>
        <div className="input-group-feedbback">
          <label className="input-label-feedbback" htmlFor="email-address">Email address (Will not be published)</label>
          <input
            type="em"
            id="email-address"
            className="input-field-feedbback"
            required
          />
        </div>
        <div className="input-group terms-acceptance">
          <label>
            <input type="checkbox" required /> I accept the <a href="#" onClick={toggleModal}>terms and conditions</a>
          </label>
        </div>
        <button type="submit" className="submit-button">Send</button>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Terms and Conditions</h3>
            <p>By making a reservation at [Hotel Name], you agree to the following terms and conditions:</p>
            <ul>
              <li><strong>Reservation and Payment:</strong> A valid credit card is required to guarantee your reservation. Payment will be charged upon check-in unless otherwise specified.</li>
              <li><strong>Cancellation Policy:</strong> Free cancellation is allowed up to [x] days before the check-in date. Cancellations made after this period will incur a charge equivalent to [x]% of the total booking amount.</li>
              <li><strong>Check-in and Check-out:</strong> Check-in time is from [x] PM and check-out time is until [x] AM.</li>
              <li><strong>Guest Conduct:</strong> The hotel reserves the right to refuse service or remove guests who engage in disruptive behavior or violate the hotel’s policies.</li>
              <li><strong>Hotel Facilities and Services:</strong> All hotel facilities are for the use of registered guests only. Additional fees may apply for certain services or facilities.</li>
              <li><strong>Liability and Insurance:</strong> The hotel is not liable for any injury, loss, or damage to the guest’s personal property during their stay.</li>
              <li><strong>Smoking and Pet Policy:</strong> Smoking is strictly prohibited inside the hotel rooms and public areas. Pets are not allowed unless prior approval is obtained.</li>
              <li><strong>Force Majeure:</strong> The hotel shall not be held liable for failure to fulfill any obligation due to events beyond its control, such as natural disasters or pandemics.</li>
            </ul>
            <button className="close-modal" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

