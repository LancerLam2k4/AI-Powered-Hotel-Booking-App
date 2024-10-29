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
        $mainImagePath = $this->storeImage($request->file('main_image'), 'main_image', $room->id);
        $additionalImagesPaths = [];

        if (isset($validatedImageData['additional_images'])) {
            foreach ($validatedImageData['additional_images'] as $image) {
                $additionalImagesPaths[] = $this->storeImage($image, 'additional_images', $room->id);
            }
        }

        // Lưu thông tin hình ảnh vào file JSON
        $this->saveImagesToJsonFile($room->id, $mainImagePath, $additionalImagesPaths);

        return response()->json(['message' => 'Room created successfully!', 'room' => $room], 201);
    }

    protected function storeImage($image, $type, $roomId)
    {
        // Tạo tên file duy nhất
        $filename = time() . '_' . $roomId . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        
        // Lưu hình ảnh vào Storage
        $path = Storage::putFileAs("public/Images/$type", $image, $filename);

        // Trả về đường dẫn tương đối
        return Storage::url($path);
    }

    protected function saveImagesToJsonFile($roomId, $mainImagePath, $additionalImagesPaths)
    {
        $data = [];

        // Đường dẫn đến file JSON
        $jsonFilePath = storage_path('app/public/Rooms.json');

        // Kiểm tra xem file đã tồn tại chưa
        if (file_exists($jsonFilePath)) {
            $data = json_decode(file_get_contents($jsonFilePath), true);
        }

        // Tạo mảng mới với thông tin cần thiết
        $newEntry = [
            'id' => $roomId,
            'main_image' => $mainImagePath,
            'additional_images' => $additionalImagesPaths,
        ];

        // Thêm mảng mới vào dữ liệu
        $data[] = $newEntry;

        // Lưu dữ liệu vào file JSON
        file_put_contents($jsonFilePath, json_encode($data, JSON_PRETTY_PRINT));
    }
}

