import React, { useState } from 'react';
import axios from 'axios';
import provinces from '../provinces.json'; // JSON chứa danh sách tỉnh và huyện
import './AddRoom.css';

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    main_image: null,
    additional_images: [],
    province: '',
    district: '',
  });
  const [districts, setDistricts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setRoomData((prevData) => ({
      ...prevData,
      province: selectedProvince,
      district: '', // Xóa giá trị huyện khi đổi tỉnh
    }));
    setDistricts(provinces[selectedProvince] || []);
  };

  const handleMainPhotoChange = (e) => {
    if (e.target.files[0]) {
      setRoomData((prevData) => ({
        ...prevData,
        main_image: e.target.files[0],
      }));
    }
  };

  const handleSubPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomData((prevData) => ({
      ...prevData,
      additional_images: [...prevData.additional_images, ...files], // Append new files
    }));
  };

  const removeSubPhoto = (index) => {
    setRoomData((prevData) => {
      const updatedPhotos = [...prevData.additional_images];
      updatedPhotos.splice(index, 1);
      return { ...prevData, additional_images: updatedPhotos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all fields to FormData
    for (const key in roomData) {
      if (Array.isArray(roomData[key])) {
        roomData[key].forEach((file) => formData.append(`${key}[]`, file)); // Gửi với định dạng mảng
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
      // Redirect to rooms page or another page
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      alert('Failed to add room. Please try again.');
    }
  };

  return (
    <div className="add-room-page">
      <div className="add-room-box">
        <h2>Add Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group left">
              <label>Name:</label>
              <input type="text" name="name" value={roomData.name} onChange={handleChange} required />
            </div>
            <div className="form-group right">
              <label>Room Type:</label>
              <select name="type" value={roomData.type} onChange={handleChange} required>
                <option value="" disabled>Select room type</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Standard">Standard</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group left">
              <label>Price:</label>
              <input type="number" name="price" value={roomData.price} onChange={handleChange} step="0.01" required />
            </div>
            <div className="form-group right">
              <label>Description:</label>
              <input type="text" name="description" value={roomData.description} onChange={handleChange} required />
            </div>
          </div>

          {/* Thêm trường chọn Tỉnh và Huyện */}
          <div className="form-row">
            <div className="form-group">
              <label>Province:</label>
              <select name="province" value={roomData.province} onChange={handleProvinceChange} required>
                <option value="">Select Province</option>
                {Object.keys(provinces).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District:</label>
              <select name="district" value={roomData.district} onChange={handleChange} required>
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thêm phần ảnh */}
          <div className="image-section">
            <label>Main Image</label>
            <div className="main-image-container">
              <input type="file" name="main_image" onChange={handleMainPhotoChange} accept="image/*" required />
              {roomData.main_image && (
                <img src={URL.createObjectURL(roomData.main_image)} alt="Main Room" className="main-preview-img" />
              )}
            </div>
          </div>

          <div className="image-section">
            <label>Additional Images</label>
            <div className="sub-images-container">
              {roomData.additional_images.map((photo, index) => (
                <div className="sub-image-wrapper" key={index}>
                  <img src={URL.createObjectURL(photo)} alt={`Additional ${index}`} className="sub-preview-img" />
                  <button type="button" className="remove-btn" onClick={() => removeSubPhoto(index)}>X</button>
                </div>
              ))}
            </div>
            <input type="file" name="additional_images" onChange={handleSubPhotoChange} accept="image/*" multiple />
          </div>

          <button type="submit" className="add-room-btn">Add Room</button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;