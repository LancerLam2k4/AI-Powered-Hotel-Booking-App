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
        Schema::create('admins', function (Blueprint $table) {
            $table->id('admin_id'); // ID cho Admin
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Khóa ngoại tới bảng users
            $table->text('system_permissions')->nullable(); // Quyền
            $table->text('audit_logs')->nullable(); // Ghi lịch sử thao tác
            $table->timestamps();
        });
    }
    
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
