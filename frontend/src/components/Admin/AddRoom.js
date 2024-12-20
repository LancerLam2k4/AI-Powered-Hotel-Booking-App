import React, { useState } from "react";
import axios from "axios";
import provinces from "../provinces.json"; // JSON chứa danh sách tỉnh và huyện
import "./AddRoom.css";

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    main_image: null,
    additional_images: [],
    province: "",
    district: "",
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
      district: "", // Xóa giá trị huyện khi đổi tỉnh
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
      await axios.post("http://localhost:8000/api/add-room", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Room added successfully!");
      // Redirect to rooms page or another page
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      alert("Failed to add room. Please try again.");
    }
  };

  return (
    <div className="add-room-page-add-room">
      <div className="add-room-box-add-room">
        <h2>Add Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-container-add-room">
            <div className="Left-add-room">
              <div className="form-row-add-room">
                <div className="form-group-left-add-room">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={roomData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-right-add-room">
                  <label>Room Type:</label>
                  <select
                    name="type"
                    value={roomData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select room type
                    </option>
                    <option value="Deluxe">Single Room</option>
                    <option value="Standard">Double Room</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Apartment</option>
                  </select>
                </div>
              </div>

              <div className="form-row-add-room">
                <div className="form-group-left-add-room">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={roomData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group-right-add-room">
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={roomData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Thêm trường chọn Tỉnh và Huyện */}
              <div className="form-row-add-room">
                <div className="form-group-add-room">
                  <label>Province:</label>
                  <select
                    name="province"
                    value={roomData.province}
                    onChange={handleProvinceChange}
                    required
                  >
                    <option value="">Select Province</option>
                    {Object.keys(provinces).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-add-room">
                  <label>District:</label>
                  <select
                    name="district"
                    value={roomData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="Right-add-room">
              <div className="image-section-add-room">
                <div className="image-left-add-room">
                  <label>Main Image</label>
                  <div className="main-image-container-add-room">
                    <input
                      type="file"
                      name="main_image"
                      onChange={handleMainPhotoChange}
                      accept="image/*"
                      required
                    />
                    {roomData.main_image && (
                      <img
                        src={URL.createObjectURL(roomData.main_image)}
                        alt="Main Room"
                        className="main-preview-img-add-room"
                      />
                    )}
                  </div>
                </div>

                <div className="image-right-add-room">
                  <label>Additional Images</label>
                  <div className="sub-images-container-add-room">
                    {roomData.additional_images.map((photo, index) => (
                      <div className="sub-image-wrapper-add-room" key={index}>
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Additional ${index}`}
                          className="sub-preview-img-add-room"
                        />
                        <button
                          type="button"
                          className="remove-btn-add-room"
                          onClick={() => removeSubPhoto(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    name="additional_images"
                    onChange={handleSubPhotoChange}
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="add-room-btn-add-room">
            Add Room
          </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
