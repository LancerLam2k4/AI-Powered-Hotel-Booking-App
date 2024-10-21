<?php
use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'registerTraveler']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmailAndSendCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);

// Route::get('/addRoom',[RoomController::class,'index'])->name('admin.adminAddRoom');
// //them phong
// Route::get('/create-room',[RoomController::class,'adminRoom'])->name('admin.adminRoom');
// Route::post('/create-room',[RoomController::class,'createRoom'])->name('admin.adminCreateRoom');

// Route::post('/update-room={id}',[RoomController::class,'updateRoom'])->name('admin.adminUpdateRoom');
// Route::get('/edit-room={id}',[RoomController::class,'editRoom'])->name('admin.adminEditRoom');
// Route::get('/delete-room={id}',[RoomController::class,'deleteRoom'])->name('admin.adminDeleteRoom');
// Route::get('/searchRoom',[RoomController::class,'searchRoom'])->name('admin.adminsearchRoom');