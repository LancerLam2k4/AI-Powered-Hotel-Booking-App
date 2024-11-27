<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class BookingController extends Controller
{
    public function listRooms(Request $request)
    {
        // Nhận các tham số lọc từ request
        $price = $request->input('price');
        $type = $request->input('type');
        $province = $request->input('province');
        $district = $request->input('district');
        $amenities = $request->input('amenities');

        // Truy vấn cơ sở dữ liệu với các bộ lọc
        $roomsQuery = Room::query();

        if ($price) {
            // Tùy chỉnh giá trị để phù hợp với yêu cầu của bạn
            switch ($price) {
                case 'Below 1 million VND':
                    $roomsQuery->where('price', '<', 1000000);
                    break;
                case '1-3 million VND':
                    $roomsQuery->whereBetween('price', [1000000, 3000000]);
                    break;
                case '3-5 million VND':
                    $roomsQuery->whereBetween('price', [3000000, 5000000]);
                    break;
                case 'Above 5 million VND':
                    $roomsQuery->where('price', '>', 5000000);
                    break;
                default:
                    break;
            }
        }
        if ($type) {
            $roomsQuery->where('type', $type);
        }
        if ($province) {
            $roomsQuery->where('province', 'LIKE', "%$province%");
        }
        if ($district) {
            $roomsQuery->where('district', 'LIKE', "%$district%");
        }
        if ($amenities) {
            $roomsQuery->whereHas('amenities', function ($query) use ($amenities) {
                $query->where('name', $amenities);
            });
        }

        $rooms = $roomsQuery->orderBy('updated_at', 'desc')->get();

        $roomsJson = json_decode(file_get_contents(storage_path('app/public/Rooms.json')), true);

        if ($roomsJson === null) {
            \Log::error("Failed to decode JSON or JSON file is empty.");
            return response()->json(["error" => "Unable to read room data."], 500);
        }

        $roomList = [];
        foreach ($rooms as $room) {
            $roomData = collect($roomsJson)->firstWhere('roomId', $room->roomId);
            $location = $room->province . ', ' . $room->district;
            $roomList[] = [
                'roomId' => $room->roomId,
                'name' => $room->name,
                'type' => $room->type,
                'price' => $room->price,
                'description' => $room->description,
                'status' => $room->status,
                'location' => $location,
                'reviews' => $room->reviews,
                'main_image' => $roomData ? url($roomData['main_image']) : null,
                'additional_images' => $roomData ? array_map(fn($image) => url($image), $roomData['additional_images']) : [],
            ];
        }

        return response()->json($roomList);
    }

    public function bookingDetails(){
        try {
            // 1. Lấy dữ liệu từ database
            $rooms = Room::all();
    
            // 2. Đọc file JSON chứa ảnh
            $jsonFilePath = storage_path('app/public/Rooms.json'); // Đường dẫn tới file JSON
            $imagesData = [];
            if (file_exists($jsonFilePath)) {
                $jsonContent = file_get_contents($jsonFilePath);
                $imagesData = json_decode($jsonContent, true);
            }
    
            // 3. Kết hợp dữ liệu từ database với JSON
            $roomsWithImages = $rooms->map(function ($room) use ($imagesData) {
                // Tìm dữ liệu ảnh từ JSON dựa trên roomId
                $roomImages = collect($imagesData)->firstWhere('roomId', $room->roomId);
                $room->main_image = $roomImages['main_image'] ?? null;
                $room->additional_images = $roomImages['additional_images'] ?? [];
                return $room;
            });
    
            // 4. Trả về JSON response
            return response()->json($roomsWithImages);
        } catch (\Exception $e) {
            // Xử lý lỗi nếu có
            return response()->json([
                'error' => 'Failed to fetch data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function bookingRoom($roomId){
        $roomInfor = Room::where('roomId', $roomId)->first();
        // \Log::error($roomInfor);
        return response()->json($roomInfor);
    }

    public function showDetail(Request $request){
        $roomsJson = json_decode(file_get_contents(storage_path('app/public/Rooms.json')), true);
        $roomData = collect($roomsJson)->firstWhere('roomId', (int)$request->roomId);
        if (!$roomData) {
            return response()->json(['message' => 'Room not found in JSON'], 404);
        }
        $room = Room::where('roomId', (int)$request->roomId)->first();
        if (!$room) {
            return response()->json(['message' => 'Room not found in database'], 404);
        }
        return response()->json([
            'roomId' => $roomData['roomId'],
            'name' => $room->name, 
            'price' => $room->price, 
            'description' => $room->description,
            'main_image' => url($roomData['main_image']), 
            'additional_images' => array_map(fn($image) => url($image), $roomData['additional_images']),
        ]);
    }

    public function reserveRoom(Request $request){
        $validatedData = $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email',
            'arrivalDate' => 'required|date',
            'departureDate' => 'required|date',
        ]);
        $room = Room::where('roomId', $request->roomId)->first(); 
        $users = User::where('email', $request->email)->first();
        $bookingData = [
            'room_id' => $room->roomId,  
            'room_name' => $room->name,  
            'price' => $room->price,     
            'user_name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'arrival_date' => $request->arrivalDate,
            'departure_date' => $request->departureDate,
            'total_days' => $request->totalDays,
            'total' => $request->totalPrice
        ];

        $historyGuest = [
            'user_id' => $users->user_id,
            'room_id' => $room->roomId,
            'name' => $request->firstName . ' ' . $request->lastName,
            'room_name' => $room->name,
            'arrival_date' => $request->arrivalDate,
            'departure_date' => $request->departureDate,
            'total' => $request->totalPrice
        ];

        $filePath = storage_path('app/public/bookings.json');
        $existingData = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : [];
        $existingData[] = $bookingData;
        file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT));

        $historyFilePath = storage_path('app/public/historyGuest.json');
        $existingHistoryData = file_exists($historyFilePath) ? json_decode(file_get_contents($historyFilePath),true):[];
        $existingHistoryData[] = $historyGuest;
        file_put_contents($historyFilePath, json_encode($existingHistoryData, JSON_PRETTY_PRINT));
        return response()->json(['success' => 'Reservation saved successfully']);
    }

}