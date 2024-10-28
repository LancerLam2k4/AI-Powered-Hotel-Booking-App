// AddRoom.js
import React, { useState } from 'react';
import './AddRoom.css';

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    room_id: '',
    type: '',
    price: '',
    amenities: '',
    availability: false,
    mainPhoto: null,
    subPhotos: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMainPhotoChange = (e) => {
    if (e.target.files[0]) {
      setRoomData((prevData) => ({
        ...prevData,
        mainPhoto: e.target.files[0],
      }));
    }
  };

  const handleSubPhotoChange = (e) => {
    if (e.target.files[0]) {
      setRoomData((prevData) => ({
        ...prevData,
        subPhotos: [...prevData.subPhotos, e.target.files[0]],
      }));
    }
  };

  const removeSubPhoto = (index) => {
    setRoomData((prevData) => {
      const updatedPhotos = [...prevData.subPhotos];
      updatedPhotos.splice(index, 1);
      return { ...prevData, subPhotos: updatedPhotos };
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, index) => {
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (fromIndex !== index) {
      setRoomData((prevData) => {
        const updatedPhotos = [...prevData.subPhotos];
        const movedPhoto = updatedPhotos[fromIndex];
        updatedPhotos.splice(fromIndex, 1);
        updatedPhotos.splice(index, 0, movedPhoto);
        return { ...prevData, subPhotos: updatedPhotos };
      });
    }
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(roomData);
  };

  return (
    <div className="add-room-page">
      <div className="add-room-box">
        <h2>Add Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Room Number:</label>
              <input type="text" name="room_id" value={roomData.room_id} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="text" name="price" value={roomData.price} onChange={handleChange} step="0.01" required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Room Type:</label>
              <input type="text" name="type" value={roomData.type} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Amenities:</label>
              <input type="text" name="amenities" value={roomData.amenities} onChange={handleChange} required />
            </div>
          </div>

          <div className="image-section">
            <label>Main Image</label>
            <div className="main-image-container">
              <input type="file" name="mainPhoto" onChange={handleMainPhotoChange} accept="image/*" />
              {roomData.mainPhoto && (
                <img src={URL.createObjectURL(roomData.mainPhoto)} alt="Main Room" className="main-preview-img" />
              )}
            </div>
          </div>

          <div className="image-section">
            <label>Description Images</label>
            <div className="sub-images-container">
              {roomData.subPhotos.map((photo, index) => (
                <div 
                  className="sub-image-wrapper" 
                  key={index} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, index)} 
                  onDrop={(e) => handleDrop(e, index)} 
                  onDragOver={handleDragOver}
                >
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Description ${index}`} 
                    className="sub-preview-img" 
                  />
                  <button type="button" className="remove-btn" onClick={() => removeSubPhoto(index)}>X</button>
                </div>
              ))}
            </div>
            <input type="file" name="subPhoto" onChange={handleSubPhotoChange} accept="image/*" />
          </div>

          <button type="submit" className="add-room-btn">Add Room</button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
