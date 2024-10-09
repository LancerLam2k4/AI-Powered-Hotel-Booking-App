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
        Schema::create('travelers', function (Blueprint $table) {
            $table->id('traveler_id'); // Đảm bảo id sử dụng là traveler_id
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Khóa ngoại tới users
            $table->string('preferences')->nullable(); // Sở thích
            $table->string('search_history')->nullable(); // Lịch sử tìm kiếm
            $table->timestamps();
        });
    }
    
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travelers');
    }
};
