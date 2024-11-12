<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('roomId'); // Tạo trường ID tự động tăng
            $table->string('name');
            $table->string('type');
            $table->integer('price');
            $table->string('description');
            $table->string('status')->default('Sẵn sàng'); // Mặc định là 'Sẵn sàng'
            $table->string('province')->nullable();
            $table->string('district')->nullable();
            $table->string('reviews')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
