<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); // Đảm bảo id sử dụng là user_id
            $table->string('person_id')->unique();
            $table->string('username');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['traveler', 'staff', 'admin', 'hotel_owner']);
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
