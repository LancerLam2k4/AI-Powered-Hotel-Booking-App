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
        Schema::create('hotel_owners', function (Blueprint $table) {
            $table->id('hotel_owner_id'); // ID cho Hotel Owner
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Khóa ngoại tới bảng users
            // Thêm các trường đặc thù cho Hotel Owner nếu cần
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_owners');
    }
};
