<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'price',
        'description',
        'status',
        'reviews',
    ];

    // Hàm để lấy đường dẫn hình ảnh từ file JSON
    public function getImages()
    {
        $jsonFilePath = storage_path('app/public/rooms.json');
        if (file_exists($jsonFilePath)) {
            $data = json_decode(file_get_contents($jsonFilePath), true);
            foreach ($data as $room) {
                if ($room['id'] == $this->id) {
                    return [
                        'main_image' => $room['main_image'],
                        'additional_images' => $room['additional_images'],
                    ];
                }
            }
        }
        return null;
    }
}
