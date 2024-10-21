<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

Route::get('/', function () {
    return view('welcome');
});
///////////////////////////////// TEST BACKEND //////////////////////////////
/////// Room ///////

//trang chu //
Route::get('/addRoom',[RoomController::class,'index'])->name('admin.adminAddRoom');
//them phong
Route::get('/create-room',[RoomController::class,'adminRoom'])->name('admin.adminRoom');
Route::post('/create-room',[RoomController::class,'createRoom'])->name('admin.adminCreateRoom');

Route::post('/update-room={id}',[RoomController::class,'updateRoom'])->name('admin.adminUpdateRoom');
Route::get('/edit-room={id}',[RoomController::class,'editRoom'])->name('admin.adminEditRoom');
Route::get('/delete-room={id}',[RoomController::class,'deleteRoom'])->name('admin.adminDeleteRoom');
Route::get('/searchRoom',[RoomController::class,'searchRoom'])->name('admin.adminsearchRoom');
Route::post('/upload_images',[RoomController::class,'uploadImages'])->name('admin.uploadImages');
Route::get('/upload_images',[RoomController::class,'indexUpload'])->name('admin.indexUpload');

/////// User ///////