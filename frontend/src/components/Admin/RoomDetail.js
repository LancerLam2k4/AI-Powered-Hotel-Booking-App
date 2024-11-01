import React, { useState } from 'react';
import './RoomDetail.css';

const RoomDetail = () => {
  const [mainImage, setMainImage] = useState("room.png");

  return (
    <>
      <header id="header-room-detail">
        <a href="#">
          <img src="./img/logo.png" className="logo-room-detail" alt="Logo" />
        </a>
      </header>
      <section id="roomdetails-room-detail" className="section-p1-room-detail">
        <div className="single-room-image-room-detail">
          <img src={mainImage} alt="Room" width="100%" id="mainImg-room-detail" />

          <div className="small-img-group-room-detail">
            <div className="small-img-col-room-detail" onClick={() => setMainImage("room.png")}>
              <img src="sub-room-1.png" className="small-img-room-detail" alt="Room 1" />
            </div>
            <div className="small-img-col-room-detail" onClick={() => setMainImage("sub-room-2.png")}>
              <img src="sub-room-2.png" className="small-img-room-detail" alt="Room 2" />
            </div>
            <div className="small-img-col-room-detail" onClick={() => setMainImage("sub-room-3.png")}>
              <img src="sub-room-3.png" className="small-img-room-detail" alt="Room 3" />
            </div>
            <div className="small-img-col-room-detail" onClick={() => setMainImage("sub-room-4.png")}>
              <img src="sub-room-4.png" className="small-img-room-detail" alt="Room 4" />
            </div>
          </div>
        </div>

        <div className="single-room-details-room-detail">
          <h2>Hotel / Room</h2>
          <h4>Deluxe King Room</h4>
          <h3>$200 per night</h3>
          <select>
            <option value="">Select View</option>
            <option value="garden">Garden View</option>
            <option value="ocean">Ocean View</option>
            <option value="city">City View</option>
          </select>
          <input type="number" min="1" value="1" />
          <button>Book Now</button>
          <h4>Room Details</h4>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, mollitia? Dolorum nostrum odio ipsam ullam...
          </span>
        </div>
      </section>
    </>
  );
};

export default RoomDetail;
