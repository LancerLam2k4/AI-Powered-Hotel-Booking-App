<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function store(Request $request)
{
    // Mảng xác thực cho thông tin phòng
    $validatedRoomData = $request->validate([
        'name' => 'required|string|max:255',
        'type' => 'required|string|max:255',
        'price' => 'required|numeric',
        'description' => 'required|string',
        'province' => 'required|string',
        'district' => 'required|string',
        'reviews' => 'integer|min:0',
    ]);

    // Mảng xác thực cho hình ảnh
    $validatedImageData = $request->validate([
        'main_image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        'additional_images' => 'array',
        'additional_images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
    ]);

    // Tạo mới phòng trong cơ sở dữ liệu
    $room = Room::create($validatedRoomData);

    // Lưu hình ảnh vào Storage
    $mainImagePath = $this->storeImage($request->file('main_image'), 'images');
    $additionalImagesPaths = [];

    // Lưu ảnh bổ sung nếu nó khác với ảnh chính
    if (isset($validatedImageData['additional_images'])) {
        foreach ($validatedImageData['additional_images'] as $image) {
            $additionalImagePath = $this->storeImage($image, 'images');
            if ($additionalImagePath) {
                $additionalImagesPaths[] = $additionalImagePath;
            }
        }
    }

    // Lưu thông tin hình ảnh vào file JSON
    $this->saveImagesToJsonFile($room->roomId, $mainImagePath, $additionalImagesPaths);

    // Kết hợp dữ liệu phòng và hình ảnh vào một mảng chung, bao gồm roomId và status
    $roomData = array_merge($validatedRoomData, [
        'roomId' => $room->roomId, // roomId là id của phòng từ cơ sở dữ liệu
        'status' => 'Sẵn Sàng',  // Trạng thái mặc định là active
        'main_image' => $mainImagePath,
        'additional_images' => $additionalImagesPaths,
    ]);

    // Lưu tất cả dữ liệu vào tệp room.json
    $this->saveRoomDataToJsonFile($roomData);

    return response()->json(['message' => 'Room created successfully!', 'room' => $room], 201);
}

// Phương thức lưu dữ liệu phòng vào tệp room.json
protected function saveRoomDataToJsonFile($roomData)
{
    // Đọc dữ liệu cũ từ room.json
    $jsonFilePath = $path = base_path('AI/data/rooms.json');

    $existingData = [];

    if (file_exists($jsonFilePath)) {
        $existingData = json_decode(file_get_contents($jsonFilePath), true);
    }

    // Thêm phòng mới vào dữ liệu cũ
    $existingData[] = $roomData;

    // Ghi dữ liệu mới vào tệp room.json
    file_put_contents($jsonFilePath, json_encode($existingData, JSON_PRETTY_PRINT));
}


    protected function storeImage($image, $directory)
    {
        // Sử dụng disk public để lưu hình ảnh
        $storagePath = "images"; // Chỉ định thư mục lưu trữ

        // Tạo tên file duy nhất
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // Kiểm tra nếu ảnh đã tồn tại
        if (Storage::disk('public')->exists("{$storagePath}/{$filename}")) {
            return "storage/{$storagePath}/{$filename}"; // Trả về đường dẫn nu ảnh đã tồn tại
        }

        // Lưu ảnh vào thư mục xác định
        $path = Storage::disk('public')->putFileAs($storagePath, $image, $filename);

        // Kiểm tra nếu ảnh được lưu thành công
        if (!$path) {
            throw new \Exception("Failed to save image: $filename");
        }

        // Trả về đường dẫn phù hợp cho JSON
        return "storage/{$storagePath}/{$filename}";
    }

    protected function saveImagesToJsonFile($roomId, $mainImagePath, $additionalImagesPaths)
    {
        $data = [];

        // Đường dẫn đến file JSON
        $jsonFilePath = storage_path('app/public/Rooms.json');

        // Đọc dữ liệu hiện tại nếu file JSON đã tồn tại
        if (file_exists($jsonFilePath)) {
            $data = json_decode(file_get_contents($jsonFilePath), true);
        }

        // Thêm thông tin phòng mới với ảnh vào mảng dữ liệu
        $newEntry = [
            'roomId' => $roomId,
            'main_image' => $mainImagePath,
            'additional_images' => $additionalImagesPaths,
        ];

        // Thêm mảng mới vào dữ liệu hiện có
        $data[] = $newEntry;

        // Ghi dữ liệu mới vào file JSON
        file_put_contents($jsonFilePath, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    public function destroy($roomId)
    {
        try {
            \Log::info('Delete request received for room: ' . $roomId);
            
            // Find the room
            $room = Room::find($roomId);
            if (!$room) {
                return response()->json(['message' => 'Room not found'], 404);
            }

            // Delete images from storage if they exist
            $jsonPath = storage_path('app/public/Rooms.json');
            if (file_exists($jsonPath)) {
                $roomsData = json_decode(file_get_contents($jsonPath), true) ?? [];
                
                // Find and remove room from JSON
                $roomsData = array_filter($roomsData, function($room) use ($roomId) {
                    return $room['roomId'] != $roomId;
                });

                // Save updated JSON
                file_put_contents($jsonPath, json_encode(array_values($roomsData), JSON_PRETTY_PRINT));
            }

            // Delete the room from database
            $room->delete();

            return response()->json(['message' => 'Room deleted successfully']);

        } catch (\Exception $e) {
            \Log::error('Error deleting room: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $roomId)
    {
        try {
            \Log::info('Update request received for room ' . $roomId . ':', $request->all());
            
            // Find the room
            $room = Room::findOrFail($roomId);

            // Validate room details
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'description' => 'required|string',
                'province' => 'required|string',
                'district' => 'required|string',
                'status' => 'required'
            ]);

            // Update room in database
            $room->update($validatedData);

            return response()->json([
                'message' => 'Room updated successfully',
                'room' => $room
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating room: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating room',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    // Add new method for handling image updates
    public function updateImages(Request $request, $roomId)
    {
        try {
            // Find the room first to ensure it exists
            $room = Room::findOrFail($roomId);
            
            // Handle image updates
            if ($request->hasFile('main_image') || $request->hasFile('additional_images') || $request->has('removed_images')) {
                $jsonPath = storage_path('app/public/Rooms.json');
                $roomsData = file_exists($jsonPath) ? json_decode(file_get_contents($jsonPath), true) : [];

                foreach ($roomsData as &$jsonRoom) {
                    if ($jsonRoom['roomId'] == $roomId) {
                        // Update main image if provided
                        if ($request->hasFile('main_image')) {
                            if (isset($jsonRoom['main_image'])) {
                                Storage::disk('public')->delete(str_replace('storage/', '', $jsonRoom['main_image']));
                            }
                            $mainImagePath = $this->storeImage($request->file('main_image'), 'images');
                            $jsonRoom['main_image'] = $mainImagePath;
                        }

                        // Handle additional images
                        $newAdditionalImages = [];

                        // Keep existing images that weren't removed
                        if (isset($jsonRoom['additional_images'])) {
                            $removedImages = json_decode($request->input('removed_images', '[]'), true);
                            foreach ($jsonRoom['additional_images'] as $existingImage) {
                                if (!in_array($existingImage, $removedImages)) {
                                    $newAdditionalImages[] = $existingImage;
                                } else {
                                    Storage::disk('public')->delete(str_replace('storage/', '', $existingImage));
                                }
                            }
                        }

                        // Add new additional images
                        if ($request->hasFile('additional_images')) {
                            foreach ($request->file('additional_images') as $newImage) {
                                $path = $this->storeImage($newImage, 'images');
                                $newAdditionalImages[] = $path;
                            }
                        }

                        $jsonRoom['additional_images'] = $newAdditionalImages;
                        break;
                    }
                }

                file_put_contents($jsonPath, json_encode(array_values($roomsData), JSON_PRETTY_PRINT));

                return response()->json([
                    'message' => 'Images updated successfully',
                    'room' => $room,
                    'images' => [
                        'main_image' => $jsonRoom['main_image'] ?? null,
                        'additional_images' => $jsonRoom['additional_images'] ?? []
                    ]
                ]);
            }

            return response()->json([
                'message' => 'No image updates required',
                'room' => $room
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Room not found',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error updating images: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Add new method to handle removing individual images
    public function removeImage(Request $request, $roomId)
    {
        try {
            $index = $request->input('index');
            
            // Get JSON data
            $jsonPath = storage_path('app/public/Rooms.json');
            $roomsData = json_decode(file_get_contents($jsonPath), true);
            
            // Find room and get image path
            $removedImage = null;
            foreach ($roomsData as &$jsonRoom) {
                if ($jsonRoom['roomId'] == $roomId) {
                    // Just get the image path but don't remove it yet
                    $removedImage = $jsonRoom['additional_images'][$index];
                    // Remove from array temporarily
                    array_splice($jsonRoom['additional_images'], $index, 1);
                    break;
                }
            }
            
            // Don't save changes to JSON file yet, just return updated array
            return response()->json([
                'message' => 'Image removed temporarily',
                'images' => $jsonRoom['additional_images'],
                'removedImage' => $removedImage
            ]);
        } catch (\Exception $e) {
            \Log::error('Error removing image: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error removing image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
