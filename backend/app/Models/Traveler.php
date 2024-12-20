<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traveler extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'preferences', 'search_history'];

    protected $primaryKey = 'user_id';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
