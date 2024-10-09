<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traveler extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'preferences', 'search_history'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
