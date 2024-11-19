<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

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
    public function showDetail(Request $request)
    {
        $room = Room::findOrFail($request->room);
        $roomsJson = json_decode(file_get_contents(storage_path('app/public/Rooms.json')), true);
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
            return response()->json($roomList);
    }
}
