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
        Schema::create('staffs', function (Blueprint $table) {
            $table->id('staff_id'); // ID cho Staff
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Khóa ngoại tới bảng users
            $table->string('assigned_role')->nullable(); // Vị trí công việc
            $table->string('working_hours')->nullable(); // Ca làm
            $table->timestamps();
        });
    }
    
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};
