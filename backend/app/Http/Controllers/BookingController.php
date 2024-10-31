<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Method to list rooms
    public function listRooms()
    {
        // Get room records from the database
        $rooms = Room::orderBy('updated_at', 'desc')->get();

        // Load JSON data from Rooms.json
        $roomsJson = json_decode(file_get_contents(storage_path('app/public/Rooms.json')), true);

        // Error handling if JSON fails to load
        if ($roomsJson === null) {
            \Log::error("Failed to decode JSON or JSON file is empty.");
            return response()->json(["error" => "Unable to read room data."], 500);
        } else {
            \Log::info("Data from JSON: ", $roomsJson);
        }

        // Preparing response data
        $roomList = [];

        foreach ($rooms as $room) {
            // Find matching data in the JSON using `roomId` (now matches JSON)
            $roomData = collect($roomsJson)->firstWhere('roomId', $room->roomId);

            // Prepare room data for frontend
            $roomList[] = [
                'roomId' => $room->roomId,
                'name' => $room->name,
                'type' => $room->type,
                'price' => $room->price,
                'description' => $room->description,
                'status' => $room->status,
                'reviews' => $room->reviews,
                'main_image' => $roomData ? url($roomData['main_image']) : null,
                'additional_images' => $roomData ? array_map(fn($image) => url($image), $roomData['additional_images']) : [],
            ];

            // Log room data for debugging
            // \Log::info("Room added to list: ", [
            //     'roomId' => $room->roomId,
            //     'name' => $room->name,
            //     'type' => $room->type,
            //     'price' => $room->price,
            //     'description' => $room->description,
            //     'status' => $room->status,
            //     'reviews' => $room->reviews,
            //     'main_image' => $roomData ? $roomData['main_image'] : null,
            //     'additional_images' => $roomData ? $roomData['additional_images'] : [],
            // ]);
        }

        return response()->json($roomList);
    }
}
