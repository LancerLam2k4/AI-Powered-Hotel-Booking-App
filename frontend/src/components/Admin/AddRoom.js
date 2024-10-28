import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddRoom.css';

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    room_id: '',
    name: '',
    type: '',
    price: '',
    description: '',
    status: 'available', // Default status
    reviews: [], // Assuming reviews will be an array of objects later
    mainPhoto: null,
    subPhotos: [],
  });

  const navigate = useNavigate(); // For navigation after successful submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all fields to FormData
    for (const key in roomData) {
      if (Array.isArray(roomData[key])) {
        roomData[key].forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, roomData[key]);
      }
    }

    try {
      await axios.post('http://localhost:8000/api/add-room', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Room added successfully!');
      navigate('/rooms'); // Redirect to rooms page after successful submission
    } catch (error) {
      console.error(error);
      alert('Failed to add room. Please try again.');
    }
  };

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

  return (
    <div className="add-room-page">
      <div className="add-room-box">
        <h2>Add Room</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-group left">
            <label>Room Number:</label>
            <input type="text" name="room_id" value={roomData.room_id} onChange={handleChange} required />
            </div>
            <div className="form-group right">
            <label>Name:</label>
            <input type="text" name="name" value={roomData.name} onChange={handleChange} required />
            </div>
        </div>
        
        <div className="form-row">
            <div className="form-group left">
            <label>Price:</label>
            <input type="text" name="price" value={roomData.price} onChange={handleChange} step="0.01" required />
            </div>
            <div className="form-group right">
            <label>Room Type:</label>
            <input type="text" name="type" value={roomData.type} onChange={handleChange} required />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group left">
            <label>Description:</label>
            <input type="text" name="description" value={roomData.description} onChange={handleChange} required />
            </div>
            <div className="form-group right">
            <label>Status:</label>
            <select name="status" value={roomData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
            </select>
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
