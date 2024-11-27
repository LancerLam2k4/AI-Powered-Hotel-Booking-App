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
        $this->saveImagesToJsonFile($room->id, $mainImagePath, $additionalImagesPaths);

        return response()->json(['message' => 'Room created successfully!', 'room' => $room], 201);
    }

    protected function storeImage($image, $directory)
    {
        // Sử dụng disk public để lưu hình ảnh
        $storagePath = "images"; // Chỉ định thư mục lưu trữ

        // Tạo tên file duy nhất
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // Kiểm tra nếu ảnh đã tồn tại
        if (Storage::disk('public')->exists("{$storagePath}/{$filename}")) {
            return "storage/{$storagePath}/{$filename}"; // Trả về đường dẫn nếu ảnh đã tồn tại
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
}
