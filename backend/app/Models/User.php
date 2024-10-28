<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id'; // Đặt user_id làm khóa chính

    protected $fillable = [
        'person_id',
        'username',
        'email',
        'password',
        'avatar',
        'role',
        'reset_token',
        'token_expires_at',
    ];

    // Đảm bảo các trường được mã hóa và không bị lộ khi trả về JSON
    protected $hidden = [
        'password',
        'reset_token',
        'remember_token',
    ];

    // Định nghĩa các mối quan hệ
    public function traveler()
    {
        return $this->hasOne(Traveler::class);
    }

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function hotelOwner()
    {
        return $this->hasOne(HotelOwner::class);
    }
}
