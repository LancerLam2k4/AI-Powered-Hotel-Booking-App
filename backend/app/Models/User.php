<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'username',
        'email',
        'password',
        'avatar',
        'role',
    ];

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
