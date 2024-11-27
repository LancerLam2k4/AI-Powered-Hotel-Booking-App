import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import provinces from '../provinces.json';
import './EditRoom.css';

const EditRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const room = location.state?.room;
    const [districts, setDistricts] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [originalState, setOriginalState] = useState({
        images: room?.additional_images || [],
        roomData: {
            name: room?.name || '',
            type: room?.type || '',
            price: room?.price || '',
            description: room?.description || '',
            province: room?.province || '',
            district: room?.district || '',
            status: room?.status || true
        }
    });

    const [roomData, setRoomData] = useState({
        name: room?.name ?? '',
        type: room?.type ?? '',
        price: room?.price ?? 0,
        description: room?.description ?? '',
        main_image: null,
        additional_images: [],
        province: room?.province ?? '',
        district: room?.district ?? '',
        status: room?.status ?? true
    });

    useEffect(() => {
        if (roomData.province) {
            setDistricts(provinces[roomData.province] || []);
        }
    }, [roomData.province]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setRoomData(prevData => ({
            ...prevData,
            province: selectedProvince,
            district: ''
        }));
        setDistricts(provinces[selectedProvince] || []);
    };

    const handleMainPhotoChange = (e) => {
        if (e.target.files[0]) {
            setRoomData(prevData => ({
                ...prevData,
                main_image: e.target.files[0]
            }));
        }
    };

    const handleSubPhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setRoomData(prevData => ({
            ...prevData,
            additional_images: [...prevData.additional_images, ...files]
        }));
    };

    const removeSubPhoto = (index) => {
        setRoomData(prevData => {
            const updatedPhotos = [...prevData.additional_images];
            updatedPhotos.splice(index, 1);
            return { ...prevData, additional_images: updatedPhotos };
        });
    };

    const removeExistingPhoto = async (index) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/rooms/${room.roomId}/remove-image`,
                { index },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data.images) {
                // Store removed image path
                setRemovedImages(prev => [...prev, response.data.removedImage]);
                // Update UI
                room.additional_images = response.data.images;
                setRoomData(prevData => ({...prevData}));
            }
        } catch (error) {
            console.error('Error removing image:', error);
            alert('Failed to remove image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create the data object for room details
            const updateData = {
                name: roomData.name,
                type: roomData.type,
                price: parseFloat(roomData.price),
                description: roomData.description,
                province: roomData.province,
                district: roomData.district,
                status: roomData.status
            };

            console.log('Sending data:', updateData);

            // First update the room details
            const roomResponse = await axios.put(
                `http://localhost:8000/api/rooms/${room.roomId}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            // If there are images to update, send them separately
            if (roomData.main_image || roomData.additional_images.length > 0 || removedImages.length > 0) {
                const imageFormData = new FormData();
                
                if (roomData.main_image) {
                    imageFormData.append('main_image', roomData.main_image);
                }

                if (roomData.additional_images.length > 0) {
                    roomData.additional_images.forEach((image, index) => {
                        imageFormData.append(`additional_images[${index}]`, image);
                    });
                }

                if (removedImages.length > 0) {
                    imageFormData.append('removed_images', JSON.stringify(removedImages));
                }

                // Log FormData contents for debugging
                for (let pair of imageFormData.entries()) {
                    console.log('Image FormData:', pair[0], pair[1]);
                }

                // Update images
                const imageResponse = await axios.post(
                    `http://localhost:8000/api/rooms/${room.roomId}/update-images`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        }
                    }
                );

                console.log('Image update response:', imageResponse.data);
            }

            alert('Room updated successfully!');
            navigate('/admin-dashboard');

        } catch (error) {
            console.error('Error details:', error.response?.data);
            if (error.response?.data?.errors) {
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                alert(`Validation errors:\n${errorMessages}`);
            } else {
                alert('Failed to update room: ' + (error.response?.data?.message || 'Unknown error'));
            }
        }
    };

    const handleCancel = () => {
        // Restore original state
        if (room) {
            room.additional_images = [...originalState.images];
            setRoomData(originalState.roomData);
        }
        setRemovedImages([]);
        navigate('/admin-dashboard');
    };

    // Add useEffect to set original state when component mounts
    useEffect(() => {
        if (room) {
            setOriginalState({
                images: [...room.additional_images],
                roomData: {
                    name: room.name,
                    type: room.type,
                    price: room.price,
                    description: room.description,
                    province: room.province,
                    district: room.district,
                    status: room.status
                }
            });
        }
    }, [room]);

    // Add useEffect to update roomData when room prop changes
    useEffect(() => {
        if (room) {
            setRoomData(prevData => ({
                ...prevData,
                name: room.name,
                type: room.type,
                price: room.price,
                description: room.description,
                province: room.province,
                district: room.district,
                status: room.status
            }));
        }
    }, [room]);

    return (
        <div className="add-room-page">
            <div className="add-room-box">
                <h2>Edit Room</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group left">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={roomData.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group right">
                            <label>Room Type:</label>
                            <select 
                                name="type" 
                                value={roomData.type} 
                                onChange={handleChange} 
                                required
                            >
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
                            <input 
                                type="number" 
                                name="price" 
                                value={roomData.price} 
                                onChange={handleChange} 
                                step="0.01" 
                                required 
                            />
                        </div>
                        <div className="form-group right">
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

                    <div className="form-row">
                        <div className="form-group left">
                            <label>Province:</label>
                            <select 
                                name="province" 
                                value={roomData.province} 
                                onChange={handleProvinceChange} 
                                required
                            >
                                <option value="">Select Province</option>
                                {Object.keys(provinces).map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group right">
                            <label>District:</label>
                            <select 
                                name="district" 
                                value={roomData.district} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status:</label>
                            <select
                                name="status"
                                value={roomData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value={true}>Available</option>
                                <option value={false}>Not Available</option>
                            </select>
                        </div>
                    </div>

                    <div className="image-section">
                        <label>Additional Images</label>
                        <div className="sub-images-container">
                            {/* Show new uploaded images */}
                            {roomData.additional_images.map((photo, index) => (
                                <div className="sub-image-wrapper" key={`new-${index}`}>
                                    <img 
                                        src={URL.createObjectURL(photo)} 
                                        alt={`Additional ${index}`} 
                                        className="sub-preview-img" 
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-btn" 
                                        onClick={() => removeSubPhoto(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {/* Show existing images */}
                            {room?.additional_images?.map((image, index) => (
                                <div className="sub-image-wrapper" key={`existing-${index}`}>
                                    <img 
                                        src={`http://localhost:8000/${image}`} 
                                        alt={`Current Additional ${index}`} 
                                        className="sub-preview-img" 
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-btn" 
                                        onClick={() => removeExistingPhoto(index)}
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

                    <div className="button-container-edit-room">
                        <button type="submit" className="update-room-btn">Update Room</button>
                        <button 
                            type="button" 
                            className="cancel-edit-btn" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoom; 